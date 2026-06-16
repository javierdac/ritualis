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

/* Proveedor Jira (Cloud / Data Center).
 *
 * En vivo: Velocity y Predictibilidad (velocity report), Calidad (bugs por
 * sprint, producción por label), Bloqueos (flag de Jira) y Flow Metrics
 * (Cycle/Lead Time y Aging, vía changelog y categoría de estado Done).
 * Sigue con datos de ejemplo el semáforo de retro. */

/** Cuántos sprints, como máximo, mostrar en los gráficos. */
const MAX_SPRINTS = 10;

/** Labels que marcan un bug como "de producción" (configurable a futuro). */
const PROD_LABELS = ["production", "prod", "produccion", "producción"];

/** Header de auth básica: base64(email:apiToken). */
export function jiraAuthHeader(email: string, token: string): string {
  return "Basic " + Buffer.from(`${email}:${token}`).toString("base64");
}

function authHeaders(cfg: IntegrationConfig): HeadersInit {
  if (!cfg.baseUrl || !cfg.email || !cfg.token) {
    throw new IntegrationError("Faltan baseUrl, email o token de Jira.");
  }
  return {
    Authorization: jiraAuthHeader(cfg.email, cfg.token),
    Accept: "application/json",
  };
}

/** GET autenticado contra la API de Jira. Devuelve JSON ya parseado. */
export async function jiraRequest<T>(
  cfg: IntegrationConfig,
  path: string,
): Promise<T> {
  const url = `${cfg.baseUrl!.replace(/\/$/, "")}${path}`;
  // Caché corto: las métricas no cambian segundo a segundo. "Refrescar"
  // invalida el path y fuerza un refetch.
  const res = await fetch(url, { headers: authHeaders(cfg), next: { revalidate: 300 } });
  if (!res.ok) throw new IntegrationError(`Jira respondió ${res.status} en ${path}`);
  return (await res.json()) as T;
}

/** Cantidad aproximada de issues que matchean un JQL (endpoint nuevo de Cloud). */
export async function approxCount(cfg: IntegrationConfig, jql: string): Promise<number> {
  const url = `${cfg.baseUrl!.replace(/\/$/, "")}/rest/api/3/search/approximate-count`;
  const res = await fetch(url, {
    method: "POST",
    headers: { ...authHeaders(cfg), "Content-Type": "application/json" },
    body: JSON.stringify({ jql }),
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new IntegrationError(`Jira respondió ${res.status} en approximate-count`);
  const data = (await res.json()) as { count?: number };
  return data.count ?? 0;
}

interface JqlSearch {
  issues: { key: string; fields: { labels?: string[]; statuscategorychangedate?: string } }[];
}

/** Búsqueda JQL (endpoint nuevo /search/jql). */
export function searchJql(
  cfg: IntegrationConfig,
  jql: string,
  fields: string[],
  maxResults = 100,
): Promise<JqlSearch> {
  const qs = new URLSearchParams({
    jql,
    maxResults: String(maxResults),
    fields: fields.join(","),
  });
  return jiraRequest<JqlSearch>(cfg, `/rest/api/3/search/jql?${qs}`);
}

/** Project key del board (location.projectKey). */
export async function getBoardProjectKey(cfg: IntegrationConfig): Promise<string> {
  const board = await jiraRequest<{ location?: { projectKey?: string } }>(
    cfg,
    `/rest/agile/1.0/board/${cfg.board}`,
  );
  return board.location?.projectKey ?? "";
}

interface VelocityReport {
  sprints: { id: number; name: string; sequence?: number }[];
  velocityStatEntries: Record<
    string,
    { estimated?: { value?: number }; completed?: { value?: number } }
  >;
}

/** Reporte de velocity de un board (rapidViewId = cfg.board). */
export function getVelocityReport(cfg: IntegrationConfig) {
  return jiraRequest<VelocityReport>(
    cfg,
    `/rest/greenhopper/1.0/rapid/charts/velocity?rapidViewId=${cfg.board}`,
  );
}

function mean(nums: number[]): number {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

/* ── Flow Metrics (Cycle/Lead Time, Aging) ── */

interface ChangelogIssue {
  key: string;
  fields: {
    created?: string;
    resolutiondate?: string | null;
    statuscategorychangedate?: string;
  };
  changelog?: {
    histories: { created: string; items: { field: string; toString?: string }[] }[];
  };
}

/** Búsqueda con changelog expandido (para reconstruir transiciones de estado). */
async function searchWithChangelog(
  cfg: IntegrationConfig,
  jql: string,
  fields: string[],
  maxResults: number,
): Promise<ChangelogIssue[]> {
  const qs = new URLSearchParams({
    jql,
    maxResults: String(maxResults),
    fields: fields.join(","),
    expand: "changelog",
  });
  const data = await jiraRequest<{ issues?: ChangelogIssue[] }>(
    cfg,
    `/rest/api/3/search/jql?${qs}`,
  );
  return data.issues ?? [];
}

/** Nombres de estados cuya categoría es "in progress" (indeterminate). */
async function getInProgressStatuses(
  cfg: IntegrationConfig,
  pk: string,
): Promise<Set<string>> {
  const types = await jiraRequest<
    { statuses: { name: string; statusCategory?: { key?: string } }[] }[]
  >(cfg, `/rest/api/3/project/${pk}/statuses`);
  const set = new Set<string>();
  for (const t of types)
    for (const s of t.statuses)
      if (s.statusCategory?.key === "indeterminate") set.add(s.name);
  return set;
}

function daysBetween(aIso: string, bIso: string): number {
  return Math.round((new Date(bIso).getTime() - new Date(aIso).getTime()) / 86_400_000);
}

/** Primer momento en que el issue entró a un estado "in progress". */
function firstInProgress(issue: ChangelogIssue, inProg: Set<string>): string | null {
  const hits = (issue.changelog?.histories ?? [])
    .filter((h) =>
      h.items.some((it) => it.field === "status" && it.toString && inProg.has(it.toString)),
    )
    .map((h) => h.created)
    .sort();
  return hits[0] ?? null;
}

interface FlowMetrics {
  cycleTime: { items: WorkItemDays[]; avg: number };
  aging: { items: WorkItemDays[]; threshold: number };
  cycleAvg: number;
  leadAvg: number;
}

async function fetchFlowMetrics(cfg: IntegrationConfig, pk: string): Promise<FlowMetrics> {
  const inProg = await getInProgressStatuses(cfg, pk);

  // Issues terminados recientemente (categoría Done = estado terminal real).
  const done = await searchWithChangelog(
    cfg,
    `project = "${pk}" AND statusCategory = Done ORDER BY statuscategorychangedate DESC`,
    ["created", "resolutiondate", "statuscategorychangedate"],
    40,
  );

  const cycleItems: WorkItemDays[] = [];
  const cycleDays: number[] = [];
  const leadDays: number[] = [];
  for (const it of done) {
    const doneDate = it.fields.resolutiondate ?? it.fields.statuscategorychangedate;
    if (!doneDate || !it.fields.created) continue;
    leadDays.push(Math.max(0, daysBetween(it.fields.created, doneDate)));
    const start = firstInProgress(it, inProg);
    if (start) {
      const d = Math.max(0, daysBetween(start, doneDate));
      cycleDays.push(d);
      cycleItems.push({ id: it.key, days: d, outlier: false });
    }
  }
  if (cycleDays.length === 0) {
    throw new IntegrationError("No hay issues terminados con transición a 'en progreso'.");
  }

  const cycleAvg = mean(cycleDays);
  const threshold = cycleAvg * 2; // regla del documento: 2× el promedio.
  for (const c of cycleItems) c.outlier = c.days > threshold;

  // Aging: issues hoy en progreso, días desde que entraron a esa categoría.
  const inProgress = await searchJql(
    cfg,
    `project = "${pk}" AND statusCategory = "In Progress" ORDER BY statuscategorychangedate ASC`,
    ["statuscategorychangedate"],
    30,
  );
  const now = new Date().toISOString();
  const agingItems: WorkItemDays[] = inProgress.issues
    .filter((i) => i.fields.statuscategorychangedate)
    .map((i) => {
      const d = Math.max(0, daysBetween(i.fields.statuscategorychangedate!, now));
      return { id: i.key, days: d, outlier: d > threshold };
    })
    .sort((a, b) => b.days - a.days)
    .slice(0, 8);

  return {
    cycleTime: { avg: cycleAvg, items: cycleItems.slice(0, 8) },
    aging: { threshold, items: agingItems },
    cycleAvg,
    leadAvg: mean(leadDays),
  };
}

interface SprintPoint {
  id: number;
  label: string;
  committed: number;
  completed: number;
}

export async function fetchJira(cfg: IntegrationConfig): Promise<ProviderResult> {
  if (!cfg.baseUrl || !cfg.email || !cfg.token || !cfg.board) {
    throw new IntegrationError(
      "Configuración de Jira incompleta (baseUrl, email, token y board).",
    );
  }

  /* ── Velocity + Predictibilidad (siempre, es el ancla) ── */
  const report = await getVelocityReport(cfg);
  const sprints = report.sprints ?? [];
  if (sprints.length === 0) {
    throw new IntegrationError(
      "El board no devolvió sprints. Verificá que el rapidViewId sea de un board Scrum.",
    );
  }

  // Jira no devuelve los sprints ordenados; `sequence` es el orden real.
  const ordered = [...sprints].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
  const points: SprintPoint[] = [];
  for (const s of ordered) {
    const entry = report.velocityStatEntries?.[String(s.id)];
    const committed = Math.round(entry?.estimated?.value ?? 0);
    const completed = Math.round(entry?.completed?.value ?? 0);
    if (committed === 0 && completed === 0) continue; // sin estimación en puntos
    points.push({ id: s.id, label: s.name.replace(/\s+/g, " ").trim(), committed, completed });
  }
  if (points.length === 0) {
    throw new IntegrationError(
      "El board no tiene sprints con estimación en puntos (story points). " +
        "Velocity/Predictibilidad necesitan que estimes en puntos.",
    );
  }
  points.splice(0, Math.max(0, points.length - MAX_SPRINTS));

  const velocity: VelocityPoint[] = points.map((p) => ({ sprint: p.label, value: p.completed }));
  const predictability: PredictabilityPoint[] = points.map((p) => ({
    sprint: p.label,
    committed: p.committed,
    completed: p.completed,
  }));

  const last = points[points.length - 1];
  const ratios = points.filter((p) => p.committed > 0).map((p) => p.completed / p.committed);
  const curRatio = last.committed > 0 ? last.completed / last.committed : 0;
  const velValues = points.map((p) => p.completed);

  const predRow: SummaryRow = {
    label: "Predictibilidad",
    current: `${Math.round(curRatio * 100)}%`,
    average: `${Math.round(mean(ratios) * 100)}%`,
    status: curRatio >= 0.8 ? "green" : curRatio >= 0.6 ? "yellow" : "red",
  };
  const velRow: SummaryRow = {
    label: "Velocity",
    current: `${last.completed} pts`,
    average: `${Math.round(mean(velValues))} pts`,
    status: "green",
  };

  /* ── Calidad + Bloqueos + Flow (necesitan el project key) ── */
  const sample = sampleSnapshot();
  let quality = sample.quality;
  let blockers = sample.blockers;
  let cycleTime = sample.cycleTime;
  let aging = sample.aging;
  let flow: FlowMetrics | null = null;
  let qualityLive = false;
  let blockersLive = false;
  let flowLive = false;

  let projectKey = cfg.project?.trim() ?? "";
  if (!projectKey) {
    try {
      projectKey = await getBoardProjectKey(cfg);
    } catch {
      projectKey = "";
    }
  }

  if (projectKey) {
    const pk = projectKey.replace(/"/g, "");

    // Calidad: bugs por sprint (qa = total - producción).
    try {
      quality = await Promise.all(
        points.map(async (p): Promise<QualityPoint> => {
          const total = await approxCount(
            cfg,
            `project = "${pk}" AND issuetype = Bug AND sprint = ${p.id}`,
          );
          const prod = await approxCount(
            cfg,
            `project = "${pk}" AND issuetype = Bug AND sprint = ${p.id} AND labels in (${PROD_LABELS.join(", ")})`,
          );
          return { sprint: p.label, qa: Math.max(0, total - prod), prod };
        }),
      );
      qualityLive = true;
    } catch {
      quality = sample.quality;
    }

    // Bloqueos: issues con flag, agrupados por label.
    try {
      const flagged = await searchJql(
        cfg,
        `project = "${pk}" AND Flagged is not EMPTY`,
        ["labels"],
        100,
      );
      blockers = groupBlockers(flagged.issues);
      blockersLive = true;
    } catch {
      blockers = sample.blockers;
    }

    // Flow Metrics: Cycle/Lead Time y Aging desde el changelog.
    try {
      flow = await fetchFlowMetrics(cfg, pk);
      cycleTime = flow.cycleTime;
      aging = flow.aging;
      flowLive = true;
    } catch {
      cycleTime = sample.cycleTime;
      aging = sample.aging;
    }
  }

  /* ── Filas de resumen para Calidad/Bloqueos si vinieron en vivo ── */
  const restSummary: SummaryRow[] = [];
  for (const row of sample.summary) {
    if (row.label === "Predictibilidad" || row.label === "Velocity") continue;
    if (row.label === "Cycle Time" && flow) {
      restSummary.push({
        label: "Cycle Time",
        current: `${flow.cycleAvg.toFixed(1)} días`,
        average: "—",
        status: "green",
      });
    } else if (row.label === "Lead Time" && flow) {
      restSummary.push({
        label: "Lead Time",
        current: `${flow.leadAvg.toFixed(1)} días`,
        average: "—",
        status: "green",
      });
    } else if (row.label === "Bugs Producción" && qualityLive) {
      const cur = quality[quality.length - 1]?.prod ?? 0;
      restSummary.push({
        label: "Bugs Producción",
        current: String(cur),
        average: String(Math.round(mean(quality.map((q) => q.prod)))),
        status: cur === 0 ? "green" : cur <= 2 ? "yellow" : "red",
      });
    } else if (row.label === "Bloqueos" && blockersLive) {
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

  // Capacidad ← estabilidad de la velocity (coef. de variación).
  const vMean = mean(velValues);
  const vSd = Math.sqrt(mean(velValues.map((v) => (v - vMean) ** 2)));
  const cv = vMean > 0 ? vSd / vMean : 1;

  const retro: RetroLight[] = sample.retro.map((r) => ({ ...r }));
  const setRetro = (area: string, status: MetricStatus) => {
    const e = retro.find((x) => x.area === area);
    if (e) e.status = status;
  };
  setRetro("Delivery", ratioStatus(curRatio)); // velocity/predictibilidad: siempre en vivo
  setRetro("Capacidad", cv < 0.3 ? "green" : cv < 0.6 ? "yellow" : "red");
  if (qualityLive) {
    const prodCur = quality[quality.length - 1]?.prod ?? 0;
    setRetro("Calidad", prodCur === 0 ? "green" : prodCur <= 2 ? "yellow" : "red");
  }
  if (flowLive) {
    const outliers = aging.items.filter((i) => i.outlier).length;
    setRetro("Flujo", outliers === 0 ? "green" : outliers <= 2 ? "yellow" : "red");
  }
  if (blockersLive) {
    const total = blockers.reduce((a, b) => a + b.count, 0);
    setRetro("Dependencias", total === 0 ? "green" : total <= 3 ? "yellow" : "red");
  }

  const liveSections = ["Velocity", "Predictibilidad", "semáforo de retro"];
  if (qualityLive) liveSections.push("Calidad");
  if (blockersLive) liveSections.push("Bloqueos");
  if (flowLive) liveSections.push("Cycle/Lead Time", "Aging");
  const sampleSections: string[] = [];
  if (!qualityLive) sampleSections.push("Calidad");
  if (!blockersLive) sampleSections.push("Bloqueos");
  if (!flowLive) sampleSections.push("Cycle/Lead Time", "Aging");

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
    note: sampleSections.length
      ? `En vivo desde Jira: ${liveSections.join(", ")}. Usa datos de ejemplo: ${sampleSections.join(", ")}.`
      : "Todo en vivo desde Jira.",
    live: { quality: qualityLive, blockers: blockersLive, flow: flowLive },
  };
}

/** Agrupa issues con flag por su label (cada label suma 1; sin label → "Sin motivo"). */
function groupBlockers(issues: JqlSearch["issues"]): BlockerRow[] {
  const counts = new Map<string, number>();
  for (const it of issues) {
    const labels = it.fields.labels?.length ? it.fields.labels : ["Sin motivo"];
    for (const l of labels) counts.set(l, (counts.get(l) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count);
}
