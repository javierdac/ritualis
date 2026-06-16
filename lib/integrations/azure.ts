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

/* Proveedor Azure DevOps.
 *
 * ⚠️ Implementado siguiendo la documentación oficial (Analytics OData + WIQL)
 * pero SIN validar contra una organización real (a diferencia de Jira). Los
 * nombres de tipos/campos varían según el proceso (Agile / Scrum / CMMI /
 * custom): ajustá las constantes de abajo si tu proyecto usa otros.
 *
 * Mapeo: cfg.email = organización · cfg.project = proyecto · cfg.board = team.
 *
 * En vivo (cuando hay credenciales válidas): Velocity, Predictibilidad,
 * Cycle/Lead Time, Aging, Calidad y Bloqueos. El semáforo se deriva. Cada
 * sección degrada a datos de ejemplo si su consulta falla. */

/* ── Constantes dependientes del proceso (ajustables) ── */
const WORK_ITEM_TYPE = "User Story"; // Scrum: "Product Backlog Item"
const POINTS_FIELD = "StoryPoints"; // Scrum: "Effort"
const PROD_TAGS = ["production", "prod", "produccion", "producción"];
const BLOCKED_TAGS = ["blocked", "bloqueado", "blocker"];
const MAX_SPRINTS = 10;

/** Header de auth básica de Azure DevOps: base64(":"+PAT). */
export function azureAuthHeader(pat: string): string {
  return "Basic " + Buffer.from(`:${pat}`).toString("base64");
}

function requireCfg(cfg: IntegrationConfig) {
  if (!cfg.email || !cfg.project || !cfg.token) {
    throw new IntegrationError(
      "Configuración de Azure DevOps incompleta (organización, proyecto y PAT).",
    );
  }
}

/** Request REST autenticado (org = cfg.email, project = cfg.project). */
export async function azureRequest<T>(
  cfg: IntegrationConfig,
  path: string,
  init?: RequestInit,
): Promise<T> {
  requireCfg(cfg);
  const base = `https://dev.azure.com/${cfg.email}/${encodeURIComponent(cfg.project!)}`;
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      Authorization: azureAuthHeader(cfg.token!),
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new IntegrationError(`Azure DevOps respondió ${res.status} en ${path}`);
  return (await res.json()) as T;
}

/** Consulta Analytics OData. `query` es lo que va después de _odata/v3.0-preview/. */
export async function analyticsOData<T>(
  cfg: IntegrationConfig,
  query: string,
): Promise<{ value: T[] }> {
  requireCfg(cfg);
  const url = `https://analytics.dev.azure.com/${cfg.email}/${encodeURIComponent(
    cfg.project!,
  )}/_odata/v3.0-preview/${query}`;
  const res = await fetch(url, {
    headers: { Authorization: azureAuthHeader(cfg.token!), Accept: "application/json" },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new IntegrationError(`Azure Analytics respondió ${res.status}`);
  return (await res.json()) as { value: T[] };
}

/** Filtro de scope por team o, si no hay team, por todo el proyecto. */
function teamFilter(cfg: IntegrationConfig): string {
  return cfg.board?.trim()
    ? `Teams/any(x:x/TeamName eq '${cfg.board.replace(/'/g, "''")}')`
    : "";
}

function and(...parts: string[]): string {
  return parts.filter(Boolean).join(" and ");
}

function mean(nums: number[]): number {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

/* ── Velocity + Predictibilidad ── */
interface IterAgg {
  Iteration?: { IterationName?: string; StartDate?: string };
  IterationName?: string;
  StartDate?: string;
  StateCategory?: string;
  Points?: number;
}

async function fetchVelocity(cfg: IntegrationConfig) {
  const scope = teamFilter(cfg);
  const filter = and(`WorkItemType eq '${WORK_ITEM_TYPE}'`, "Iteration/StartDate ne null", scope);
  const q =
    `WorkItems?$apply=filter(${filter})/groupby(` +
    `(Iteration/IterationName,Iteration/StartDate,StateCategory),` +
    `aggregate(${POINTS_FIELD} with sum as Points))`;
  const { value } = await analyticsOData<IterAgg>(cfg, encodeURI(q));

  // Acumula committed (todo) y completed (StateCategory = Completed) por sprint.
  const byIter = new Map<string, { name: string; start: string; committed: number; completed: number }>();
  for (const r of value) {
    const name = r.Iteration?.IterationName ?? r.IterationName ?? "—";
    const start = r.Iteration?.StartDate ?? r.StartDate ?? "";
    const pts = Math.round(r.Points ?? 0);
    const cur = byIter.get(name) ?? { name, start, committed: 0, completed: 0 };
    cur.committed += pts;
    if (r.StateCategory === "Completed") cur.completed += pts;
    byIter.set(name, cur);
  }

  const sprints = [...byIter.values()]
    .filter((s) => s.committed > 0 || s.completed > 0)
    .sort((a, b) => (a.start < b.start ? -1 : 1));
  if (sprints.length === 0) throw new IntegrationError("Sin sprints con puntos en Analytics.");
  const recent = sprints.slice(-MAX_SPRINTS);

  const velocity: VelocityPoint[] = recent.map((s) => ({ sprint: s.name, value: s.completed }));
  const predictability: PredictabilityPoint[] = recent.map((s) => ({
    sprint: s.name,
    committed: s.committed,
    completed: s.completed,
  }));
  return { velocity, predictability, recent };
}

/* ── Cycle / Lead Time + Aging ── */
interface WiOData {
  WorkItemId?: number;
  CycleTimeDays?: number;
  LeadTimeDays?: number;
  InProgressDate?: string;
}

async function fetchFlow(cfg: IntegrationConfig) {
  const scope = teamFilter(cfg);

  // Cycle / Lead Time de items completados (la doc calcula estos campos solo
  // para items en estado Completed).
  const doneFilter = and(`StateCategory eq 'Completed'`, `CompletedDate ne null`, scope);
  const doneQ =
    `WorkItems?$filter=${doneFilter}` +
    `&$select=WorkItemId,CycleTimeDays,LeadTimeDays,CompletedDateSK` +
    `&$orderby=CompletedDateSK desc&$top=40`;
  const done = (await analyticsOData<WiOData>(cfg, encodeURI(doneQ))).value;

  const cycleDays = done.map((w) => Math.round(w.CycleTimeDays ?? 0)).filter((d) => d > 0);
  const leadDays = done.map((w) => Math.round(w.LeadTimeDays ?? 0)).filter((d) => d > 0);
  if (cycleDays.length === 0) throw new IntegrationError("Analytics no devolvió cycle time.");

  const cycleAvg = mean(cycleDays);
  const threshold = cycleAvg * 2;
  const cycleItems: WorkItemDays[] = done
    .filter((w) => (w.CycleTimeDays ?? 0) > 0)
    .slice(0, 8)
    .map((w) => ({
      id: `WI-${w.WorkItemId}`,
      days: Math.round(w.CycleTimeDays ?? 0),
      outlier: Math.round(w.CycleTimeDays ?? 0) > threshold,
    }));

  // Aging: items en progreso, días desde InProgressDate.
  const inProgFilter = and(`StateCategory eq 'InProgress'`, `InProgressDate ne null`, scope);
  const agingQ =
    `WorkItems?$filter=${inProgFilter}` +
    `&$select=WorkItemId,InProgressDate&$orderby=InProgressDate asc&$top=30`;
  const inProg = (await analyticsOData<WiOData>(cfg, encodeURI(agingQ))).value;
  const now = Date.now();
  const agingItems: WorkItemDays[] = inProg
    .filter((w) => w.InProgressDate)
    .map((w) => {
      const days = Math.max(0, Math.round((now - new Date(w.InProgressDate!).getTime()) / 86_400_000));
      return { id: `WI-${w.WorkItemId}`, days, outlier: days > threshold };
    })
    .sort((a, b) => b.days - a.days)
    .slice(0, 8);

  return {
    cycleTime: { avg: cycleAvg, items: cycleItems },
    aging: { threshold, items: agingItems },
    cycleAvg,
    leadAvg: mean(leadDays),
  };
}

/* ── Calidad (bugs por sprint) ── */
interface BugAgg {
  Iteration?: { IterationName?: string; StartDate?: string };
  IterationName?: string;
  StartDate?: string;
  Count?: number;
}

async function fetchQuality(
  cfg: IntegrationConfig,
  recent: { name: string; start: string }[],
): Promise<QualityPoint[]> {
  const scope = teamFilter(cfg);
  const base = and("WorkItemType eq 'Bug'", "Iteration/StartDate ne null", scope);
  const group = `/groupby((Iteration/IterationName),aggregate($count as Count))`;

  const totalQ = `WorkItems?$apply=filter(${base})${group}`;
  const prodFilter = and(base, `Tags/any(t:${PROD_TAGS.map((p) => `t/TagName eq '${p}'`).join(" or ")})`);
  const prodQ = `WorkItems?$apply=filter(${prodFilter})${group}`;

  const [totals, prods] = await Promise.all([
    analyticsOData<BugAgg>(cfg, encodeURI(totalQ)),
    analyticsOData<BugAgg>(cfg, encodeURI(prodQ)).catch(() => ({ value: [] as BugAgg[] })),
  ]);
  const totalMap = new Map(totals.value.map((r) => [r.Iteration?.IterationName ?? r.IterationName ?? "—", r.Count ?? 0]));
  const prodMap = new Map(prods.value.map((r) => [r.Iteration?.IterationName ?? r.IterationName ?? "—", r.Count ?? 0]));

  return recent.map((s) => {
    const total = totalMap.get(s.name) ?? 0;
    const prod = prodMap.get(s.name) ?? 0;
    return { sprint: s.name, qa: Math.max(0, total - prod), prod };
  });
}

/* ── Bloqueos (work items con tag de bloqueo) ── */
interface BlockedWi {
  Tags?: { TagName?: string }[];
}

async function fetchBlockers(cfg: IntegrationConfig): Promise<BlockerRow[]> {
  const scope = teamFilter(cfg);
  const tagFilter = `Tags/any(t:${BLOCKED_TAGS.map((t) => `t/TagName eq '${t}'`).join(" or ")})`;
  const filter = and(`StateCategory ne 'Completed'`, tagFilter, scope);
  const q = `WorkItems?$filter=${filter}&$select=WorkItemId&$expand=Tags($select=TagName)&$top=200`;
  const { value } = await analyticsOData<BlockedWi>(cfg, encodeURI(q));

  const counts = new Map<string, number>();
  for (const wi of value) {
    const blocked = (wi.Tags ?? []).filter((t) =>
      BLOCKED_TAGS.includes((t.TagName ?? "").toLowerCase()),
    );
    const reason = blocked[0]?.TagName ?? "Bloqueado";
    counts.set(reason, (counts.get(reason) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count);
}

export async function fetchAzure(cfg: IntegrationConfig): Promise<ProviderResult> {
  requireCfg(cfg);
  const sample = sampleSnapshot();

  // Velocity es el ancla: si falla, no hay base para el resto → error (sample).
  const { velocity, predictability, recent } = await fetchVelocity(cfg);

  const last = predictability[predictability.length - 1];
  const ratios = predictability.filter((p) => p.committed > 0).map((p) => p.completed / p.committed);
  const curRatio = last && last.committed > 0 ? last.completed / last.committed : 0;
  const velValues = velocity.map((v) => v.value);

  const ratioStatus = (r: number): MetricStatus => (r >= 0.8 ? "green" : r >= 0.6 ? "yellow" : "red");
  const predRow: SummaryRow = {
    label: "Predictibilidad",
    current: `${Math.round(curRatio * 100)}%`,
    average: `${Math.round(mean(ratios) * 100)}%`,
    status: ratioStatus(curRatio),
  };
  const velRow: SummaryRow = {
    label: "Velocity",
    current: `${last?.completed ?? 0} pts`,
    average: `${Math.round(mean(velValues))} pts`,
    status: "green",
  };

  // Secciones independientes (cada una degrada a ejemplo).
  let cycleTime = sample.cycleTime;
  let aging = sample.aging;
  let quality = sample.quality;
  let blockers = sample.blockers;
  let flow: Awaited<ReturnType<typeof fetchFlow>> | null = null;
  let flowLive = false;
  let qualityLive = false;
  let blockersLive = false;

  try {
    flow = await fetchFlow(cfg);
    cycleTime = flow.cycleTime;
    aging = flow.aging;
    flowLive = true;
  } catch {
    /* sample */
  }
  try {
    quality = await fetchQuality(cfg, recent);
    qualityLive = true;
  } catch {
    /* sample */
  }
  try {
    blockers = await fetchBlockers(cfg);
    blockersLive = true;
  } catch {
    /* sample */
  }

  /* Resumen */
  const restSummary: SummaryRow[] = [];
  for (const row of sample.summary) {
    if (row.label === "Predictibilidad" || row.label === "Velocity") continue;
    if (row.label === "Cycle Time" && flow) {
      restSummary.push({ label: "Cycle Time", current: `${flow.cycleAvg.toFixed(1)} días`, average: "—", status: "green" });
    } else if (row.label === "Lead Time" && flow) {
      restSummary.push({ label: "Lead Time", current: `${flow.leadAvg.toFixed(1)} días`, average: "—", status: "green" });
    } else if (row.label === "Bugs Producción" && qualityLive) {
      const cur = quality[quality.length - 1]?.prod ?? 0;
      restSummary.push({ label: "Bugs Producción", current: String(cur), average: String(Math.round(mean(quality.map((q) => q.prod)))), status: cur === 0 ? "green" : cur <= 2 ? "yellow" : "red" });
    } else if (row.label === "Bloqueos" && blockersLive) {
      const total = blockers.reduce((a, b) => a + b.count, 0);
      restSummary.push({ label: "Bloqueos", current: String(total), average: "—", status: total === 0 ? "green" : total <= 3 ? "yellow" : "red" });
    } else {
      restSummary.push(row);
    }
  }

  /* Semáforo de retro derivado */
  const vMean = mean(velValues);
  const vSd = Math.sqrt(mean(velValues.map((v) => (v - vMean) ** 2)));
  const cv = vMean > 0 ? vSd / vMean : 1;
  const retro: RetroLight[] = sample.retro.map((r) => ({ ...r }));
  const setRetro = (area: string, status: MetricStatus) => {
    const e = retro.find((x) => x.area === area);
    if (e) e.status = status;
  };
  setRetro("Delivery", ratioStatus(curRatio));
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

  const live = ["Velocity", "Predictibilidad", "semáforo de retro"];
  if (flowLive) live.push("Cycle/Lead Time", "Aging");
  if (qualityLive) live.push("Calidad");
  if (blockersLive) live.push("Bloqueos");
  const stillSample: string[] = [];
  if (!flowLive) stillSample.push("Cycle/Lead Time", "Aging");
  if (!qualityLive) stillSample.push("Calidad");
  if (!blockersLive) stillSample.push("Bloqueos");

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
    note: stillSample.length
      ? `En vivo desde Azure DevOps: ${live.join(", ")}. Usa datos de ejemplo: ${stillSample.join(", ")}.`
      : "Todo en vivo desde Azure DevOps.",
    live: { quality: qualityLive, blockers: blockersLive, flow: flowLive },
  };
}
