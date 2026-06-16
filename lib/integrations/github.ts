import {
  IntegrationError,
  type IntegrationConfig,
  type ProviderResult,
  type SummaryRow,
  type VelocityPoint,
  type PredictabilityPoint,
  type QualityPoint,
  type BlockerRow,
  type WorkItemDays,
  type RetroLight,
  type MetricStatus,
} from "./types";
import { sampleSnapshot } from "./sample";

/* Proveedor GitHub (Projects v2).
 *
 * Las métricas de sprint (Velocity, Predictibilidad, Calidad, Bloqueos) no
 * existen en los repos: viven en un GitHub Project v2 con un campo de tipo
 * Iteration (los sprints) y un campo numérico de puntos. Todo se lee con UNA
 * sola consulta GraphQL paginada (la API de Projects v2 sólo está en GraphQL),
 * así que cada sección se deriva en memoria sin pedidos extra.
 *
 * Mapeo: cfg.project = owner (organización o usuario dueño del Project) ·
 * cfg.board = número del Project · cfg.token = PAT (classic con scope
 * `read:project`+`repo`, o fine-grained con permiso de lectura de Projects).
 * cfg.baseUrl es opcional (sólo para GitHub Enterprise; default github.com).
 *
 * Límites conocidos: GitHub no expone el historial de cambios de estado del
 * tablero, así que Cycle Time se aproxima con el Lead Time (created→closed) y
 * el Aging usa la antigüedad del item. El semáforo de retro se deriva. */

const MAX_SPRINTS = 10;
const MAX_ITEMS = 500;
const PAGE = 100;

/** Labels que marcan un bug como "de producción". */
const PROD_LABELS = ["production", "prod", "produccion", "producción"];
/** Labels que marcan un item como bloqueado. */
const BLOCKED_LABELS = ["blocked", "bloqueado", "blocker", "blocked-by"];
/** Nombres de la opción de estado "terminado" (single-select Status). */
const DONE_STATUSES = ["done", "closed", "cerrado", "completado", "finalizado", "shipped"];
/** Nombres de la opción de estado "en progreso". */
const IN_PROGRESS_STATUSES = [
  "in progress",
  "in-progress",
  "doing",
  "en progreso",
  "en curso",
  "wip",
];
/** Heurística para reconocer el campo numérico de puntos. */
const POINTS_FIELD_RE = /point|estimate|size|esfuerzo|punto|story/i;

function mean(nums: number[]): number {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

function daysBetween(aIso: string, bIso: string): number {
  return Math.round((new Date(bIso).getTime() - new Date(aIso).getTime()) / 86_400_000);
}

/* ── GraphQL ── */

const PROJECT_QUERY = `
query($owner: String!, $number: Int!, $cursor: String) {
  __ROOT__(login: $owner) {
    projectV2(number: $number) {
      title
      fields(first: 50) {
        nodes {
          __typename
          ... on ProjectV2FieldCommon { name dataType }
        }
      }
      items(first: ${PAGE}, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          type
          fieldValues(first: 30) {
            nodes {
              __typename
              ... on ProjectV2ItemFieldNumberValue { number field { ... on ProjectV2FieldCommon { name } } }
              ... on ProjectV2ItemFieldSingleSelectValue { name field { ... on ProjectV2FieldCommon { name } } }
              ... on ProjectV2ItemFieldIterationValue { title startDate field { ... on ProjectV2FieldCommon { name } } }
            }
          }
          content {
            __typename
            ... on Issue { number title state createdAt closedAt labels(first: 20) { nodes { name } } }
            ... on PullRequest { number title state createdAt closedAt labels(first: 20) { nodes { name } } }
            ... on DraftIssue { title }
          }
        }
      }
    }
  }
}`;

interface GqlField {
  __typename: string;
  name?: string;
  dataType?: string;
}

interface GqlFieldValue {
  __typename: string;
  number?: number;
  name?: string;
  title?: string;
  startDate?: string | null;
  field?: { name?: string };
}

interface GqlNode {
  type: string;
  fieldValues: { nodes: GqlFieldValue[] };
  content?: {
    __typename: string;
    number?: number;
    title?: string;
    state?: string;
    createdAt?: string;
    closedAt?: string | null;
    labels?: { nodes: { name: string }[] };
  };
}

interface GqlProject {
  title: string;
  fields: { nodes: GqlField[] };
  items: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: GqlNode[] };
}

async function ghGraphQL<T>(
  cfg: IntegrationConfig,
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const base = (cfg.baseUrl?.trim() || "https://api.github.com").replace(/\/+$/, "");
  const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      "User-Agent": "Ritualis-Metrics",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new IntegrationError(`GitHub respondió ${res.status}.`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new IntegrationError(`GitHub GraphQL: ${json.errors[0].message}`);
  if (!json.data) throw new IntegrationError("GitHub no devolvió datos.");
  return json.data;
}

/** Una página de items del Project, bajo el root indicado (organization|user). */
function fetchPage(cfg: IntegrationConfig, root: string, cursor: string | null) {
  return ghGraphQL<Record<string, { projectV2: GqlProject | null }>>(
    cfg,
    PROJECT_QUERY.replace("__ROOT__", root),
    { owner: cfg.project, number: Number(cfg.board), cursor },
  );
}

/** Carga el Project completo (fields + todos los items) probando org y luego user. */
async function loadProject(cfg: IntegrationConfig): Promise<GqlProject> {
  for (const root of ["organization", "user"] as const) {
    try {
      const first = await fetchPage(cfg, root, null);
      const proj = first[root]?.projectV2;
      if (!proj) continue; // existe el owner pero no el número de Project bajo este root
      const items = [...proj.items.nodes];
      let pageInfo = proj.items.pageInfo;
      let guard = 0;
      while (pageInfo.hasNextPage && items.length < MAX_ITEMS && guard < 12) {
        const next = await fetchPage(cfg, root, pageInfo.endCursor);
        const p = next[root]?.projectV2;
        if (!p) break;
        items.push(...p.items.nodes);
        pageInfo = p.items.pageInfo;
        guard++;
      }
      return { title: proj.title, fields: proj.fields, items: { pageInfo, nodes: items } };
    } catch (err) {
      // org puede fallar porque el owner es un usuario: probamos user antes de rendirnos.
      if (root === "user") throw err;
    }
  }
  throw new IntegrationError(
    "No se encontró el Project. Verificá el owner y el número del Project.",
  );
}

/* ── Normalización de items ── */

interface Item {
  number?: number;
  state?: string; // OPEN | CLOSED | MERGED
  createdAt?: string;
  closedAt?: string | null;
  labels: string[];
  points: number;
  status?: string; // opción del single-select Status, en minúsculas
  iterTitle?: string;
  iterStart?: string | null;
}

/** Nombre del campo numérico que mejor representa los puntos. */
function detectPointsField(fields: GqlField[]): string | null {
  const numbers = fields.filter((f) => f.dataType === "NUMBER" && f.name);
  return (
    numbers.find((f) => POINTS_FIELD_RE.test(f.name!))?.name ?? numbers[0]?.name ?? null
  );
}

/** Nombre del single-select que mejor representa el estado del tablero. */
function detectStatusField(fields: GqlField[]): string | null {
  const selects = fields.filter((f) => f.dataType === "SINGLE_SELECT" && f.name);
  return selects.find((f) => /status|estado/i.test(f.name!))?.name ?? selects[0]?.name ?? null;
}

function normalize(node: GqlNode, pointsField: string | null, statusField: string | null): Item {
  let points = 0;
  let status: string | undefined;
  let iterTitle: string | undefined;
  let iterStart: string | null | undefined;
  for (const fv of node.fieldValues?.nodes ?? []) {
    const fname = fv.field?.name;
    if (fv.__typename === "ProjectV2ItemFieldNumberValue" && fname === pointsField) {
      points = fv.number ?? 0;
    } else if (fv.__typename === "ProjectV2ItemFieldSingleSelectValue") {
      // priorizamos el campo de estado detectado; si no, el primer single-select.
      if (fname === statusField || status === undefined) status = fv.name?.toLowerCase();
    } else if (fv.__typename === "ProjectV2ItemFieldIterationValue") {
      iterTitle = fv.title;
      iterStart = fv.startDate;
    }
  }
  const c = node.content ?? { __typename: "" };
  return {
    number: c.number,
    state: c.state,
    createdAt: c.createdAt,
    closedAt: c.closedAt ?? null,
    labels: (c.labels?.nodes ?? []).map((l) => l.name.toLowerCase()),
    points,
    status,
    iterTitle,
    iterStart,
  };
}

function isDone(it: Item): boolean {
  if (it.state === "CLOSED" || it.state === "MERGED") return true;
  return it.status ? DONE_STATUSES.includes(it.status) : false;
}

function label(it: Item): string {
  return it.number != null ? `#${it.number}` : "draft";
}

/* ── Provider ── */

interface Sprint {
  title: string;
  start: string | null | undefined;
  committed: number;
  completed: number;
}

export async function fetchGithub(
  cfg: IntegrationConfig,
  opts: { overlay?: boolean } = {},
): Promise<ProviderResult> {
  if (!cfg.token || !cfg.project || !cfg.board) {
    throw new IntegrationError(
      "Configuración de GitHub incompleta (token, owner y número de Project).",
    );
  }
  if (!Number.isInteger(Number(cfg.board))) {
    throw new IntegrationError("El número de Project tiene que ser un entero (ej. 7).");
  }

  const project = await loadProject(cfg);
  const pointsField = detectPointsField(project.fields.nodes);
  const statusField = detectStatusField(project.fields.nodes);
  const items = project.items.nodes.map((n) => normalize(n, pointsField, statusField));

  /* ── Velocity + Predictibilidad (ancla: iteraciones con puntos) ── */
  const iterMap = new Map<string, Sprint>();
  for (const it of items) {
    if (!it.iterTitle) continue;
    const e =
      iterMap.get(it.iterTitle) ??
      iterMap.set(it.iterTitle, {
        title: it.iterTitle,
        start: it.iterStart,
        committed: 0,
        completed: 0,
      }).get(it.iterTitle)!;
    e.committed += it.points;
    if (isDone(it)) e.completed += it.points;
  }
  const sprints = [...iterMap.values()]
    .sort((a, b) => new Date(a.start ?? 0).getTime() - new Date(b.start ?? 0).getTime())
    .slice(-MAX_SPRINTS);

  const totalPoints = sprints.reduce((s, x) => s + x.committed, 0);
  const hasSprints = sprints.length > 0 && totalPoints > 0;
  // Como primario, las iteraciones con puntos son el ancla (sin eso no hay
  // velocity). Como overlay sólo nos interesa el flujo, así que es opcional.
  if (!hasSprints && !opts.overlay) {
    throw new IntegrationError(
      "El Project no tiene iteraciones con puntos. Velocity/Predictibilidad necesitan " +
        "un campo de tipo Iteration y un campo numérico de puntos.",
    );
  }

  const sample = sampleSnapshot();

  // Velocity / Predictibilidad / Calidad dependen de iteraciones con puntos.
  let velocity: VelocityPoint[] = sample.velocity;
  let predictability: PredictabilityPoint[] = sample.predictability.points;
  let predRow = sample.summary.find((r) => r.label === "Predictibilidad")!;
  let velRow = sample.summary.find((r) => r.label === "Velocity")!;
  let quality: QualityPoint[] = sample.quality;
  let curRatio = 0;
  let velValues: number[] = [];

  if (hasSprints) {
    velocity = sprints.map((s) => ({ sprint: s.title, value: s.completed }));
    predictability = sprints.map((s) => ({
      sprint: s.title,
      committed: s.committed,
      completed: s.completed,
    }));

    const last = sprints[sprints.length - 1];
    const ratios = sprints.filter((s) => s.committed > 0).map((s) => s.completed / s.committed);
    curRatio = last.committed > 0 ? last.completed / last.committed : 0;
    velValues = sprints.map((s) => s.completed);

    predRow = {
      label: "Predictibilidad",
      current: `${Math.round(curRatio * 100)}%`,
      average: `${Math.round(mean(ratios) * 100)}%`,
      status: curRatio >= 0.8 ? "green" : curRatio >= 0.6 ? "yellow" : "red",
    };
    velRow = {
      label: "Velocity",
      current: `${last.completed} pts`,
      average: `${Math.round(mean(velValues))} pts`,
      status: "green",
    };

    /* ── Calidad: bugs por iteración (label "bug"; prod por label) ── */
    quality = sprints.map((s) => {
      const bugs = items.filter((i) => i.iterTitle === s.title && i.labels.includes("bug"));
      const prod = bugs.filter((i) => i.labels.some((l) => PROD_LABELS.includes(l))).length;
      return { sprint: s.title, qa: Math.max(0, bugs.length - prod), prod };
    });
  }

  /* ── Bloqueos: items abiertos con label de bloqueo, agrupados por motivo ── */
  const blockedItems = items.filter(
    (i) => i.state !== "CLOSED" && i.labels.some((l) => BLOCKED_LABELS.includes(l)),
  );
  const blockers = groupBlockers(blockedItems);

  /* ── Flow: Lead Time (created→closed) y Aging (antigüedad de WIP) ── */
  const closed = items
    .filter((i) => (i.state === "CLOSED" || i.state === "MERGED") && i.createdAt && i.closedAt)
    .sort((a, b) => new Date(b.closedAt!).getTime() - new Date(a.closedAt!).getTime())
    .slice(0, 40);

  let cycleTime = sample.cycleTime;
  let aging = sample.aging;
  let cycleAvg = 0;
  let leadAvg = 0;
  let flowLive = false;

  if (closed.length > 0) {
    const leadDays = closed.map((i) => Math.max(0, daysBetween(i.createdAt!, i.closedAt!)));
    cycleAvg = mean(leadDays);
    leadAvg = cycleAvg; // GitHub no expone historial de estados: Cycle ≈ Lead.
    const threshold = cycleAvg * 2; // regla del documento: 2× el promedio.
    const cycleItems: WorkItemDays[] = closed
      .slice(0, 8)
      .map((i, idx) => ({ id: label(i), days: leadDays[idx], outlier: leadDays[idx] > threshold }));

    const now = new Date().toISOString();
    const agingItems: WorkItemDays[] = items
      .filter((i) => i.state === "OPEN" && i.status && IN_PROGRESS_STATUSES.includes(i.status))
      .filter((i) => i.createdAt)
      .map((i) => {
        const d = Math.max(0, daysBetween(i.createdAt!, now));
        return { id: label(i), days: d, outlier: d > threshold };
      })
      .sort((a, b) => b.days - a.days)
      .slice(0, 8);

    cycleTime = { avg: cycleAvg, items: cycleItems };
    aging = { threshold, items: agingItems };
    flowLive = true;
  }

  /* ── Filas de resumen (reemplazan las de ejemplo donde hay datos vivos) ── */
  const restSummary: SummaryRow[] = [];
  for (const row of sample.summary) {
    if (row.label === "Predictibilidad" || row.label === "Velocity") continue;
    if (row.label === "Cycle Time" && flowLive) {
      restSummary.push({
        label: "Cycle Time",
        current: `${cycleAvg.toFixed(1)} días`,
        average: "—",
        status: "green",
      });
    } else if (row.label === "Lead Time" && flowLive) {
      restSummary.push({
        label: "Lead Time",
        current: `${leadAvg.toFixed(1)} días`,
        average: "—",
        status: "green",
      });
    } else if (row.label === "Bugs Producción" && hasSprints) {
      const cur = quality[quality.length - 1]?.prod ?? 0;
      restSummary.push({
        label: "Bugs Producción",
        current: String(cur),
        average: String(Math.round(mean(quality.map((q) => q.prod)))),
        status: cur === 0 ? "green" : cur <= 2 ? "yellow" : "red",
      });
    } else if (row.label === "Bloqueos") {
      const total = blockers.reduce((a, b) => a + b.count, 0);
      restSummary.push({
        label: "Bloqueos",
        current: String(total),
        average: "—",
        status: total === 0 ? "green" : total <= 3 ? "yellow" : "red",
      });
    } else {
      restSummary.push(row);
    }
  }

  /* ── Semáforo de retro: derivado de las métricas en vivo ── */
  const ratioStatus = (r: number): MetricStatus =>
    r >= 0.8 ? "green" : r >= 0.6 ? "yellow" : "red";
  const vMean = mean(velValues);
  const vSd = Math.sqrt(mean(velValues.map((v) => (v - vMean) ** 2)));
  const cv = vMean > 0 ? vSd / vMean : 1;

  const retro: RetroLight[] = sample.retro.map((r) => ({ ...r }));
  const setRetro = (area: string, status: MetricStatus) => {
    const e = retro.find((x) => x.area === area);
    if (e) e.status = status;
  };
  if (hasSprints) {
    setRetro("Delivery", ratioStatus(curRatio));
    setRetro("Capacidad", cv < 0.3 ? "green" : cv < 0.6 ? "yellow" : "red");
    const prodCur = quality[quality.length - 1]?.prod ?? 0;
    setRetro("Calidad", prodCur === 0 ? "green" : prodCur <= 2 ? "yellow" : "red");
  }
  const blockTotal = blockers.reduce((a, b) => a + b.count, 0);
  setRetro("Dependencias", blockTotal === 0 ? "green" : blockTotal <= 3 ? "yellow" : "red");
  if (flowLive) {
    const outliers = aging.items.filter((i) => i.outlier).length;
    setRetro("Flujo", outliers === 0 ? "green" : outliers <= 2 ? "yellow" : "red");
  }

  const liveSections = ["Bloqueos"];
  if (hasSprints) liveSections.unshift("Velocity", "Predictibilidad", "Calidad");
  if (flowLive) liveSections.push("Lead Time", "Aging");
  let note = `En vivo desde GitHub (Project «${project.title}»): ${liveSections.join(", ")}.`;
  if (flowLive) {
    note += " Cycle Time es una aproximación por Lead Time (GitHub no expone el historial de estados).";
  } else {
    note += " Usa datos de ejemplo: Cycle/Lead Time y Aging (no hay items cerrados con fechas).";
  }

  return {
    raw: {
      summary: [predRow, velRow, ...restSummary],
      velocity,
      predictability: { points: predictability, target: 0.8 },
      cycleTime,
      aging,
      blockers,
      quality,
      retro,
    },
    note,
    live: {
      quality: hasSprints && quality.some((q) => q.qa + q.prod > 0),
      blockers: blockers.length > 0,
      flow: flowLive,
    },
  };
}

/** Agrupa items bloqueados por sus labels (descontando los marcadores de
 *  bloqueo). Sin otro label → "Sin motivo". */
function groupBlockers(items: Item[]): BlockerRow[] {
  const counts = new Map<string, number>();
  for (const it of items) {
    const reasons = it.labels.filter((l) => !BLOCKED_LABELS.includes(l));
    const keys = reasons.length ? reasons : ["Sin motivo"];
    for (const k of keys) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count);
}
