/* Tipos compartidos del dashboard de métricas.
 *
 * La idea: cualquier proveedor (Jira, Azure DevOps, datos de ejemplo…)
 * produce un mismo `MetricsSnapshot`. La UI sólo conoce este tipo, así que
 * agregar un proveedor nuevo no toca la presentación. */

export type MetricStatus = "green" | "yellow" | "red";
export type IntegrationProvider = "sample" | "jira" | "azure";

export interface SummaryRow {
  /** Nombre de la métrica (Predictibilidad, Velocity, …). */
  label: string;
  /** Valor del sprint actual, ya formateado (p. ej. "92%", "38 pts"). */
  current: string;
  /** Promedio de los últimos sprints, formateado. */
  average: string;
  status: MetricStatus;
}

export interface VelocityPoint {
  sprint: string;
  value: number;
}

export interface PredictabilityPoint {
  sprint: string;
  committed: number;
  completed: number;
}

export interface WorkItemDays {
  id: string;
  days: number;
  outlier: boolean;
}

export interface BlockerRow {
  reason: string;
  count: number;
}

export interface QualityPoint {
  sprint: string;
  /** Bugs encontrados por QA. */
  qa: number;
  /** Bugs escapados a producción. */
  prod: number;
}

export interface RetroLight {
  area: string;
  status: MetricStatus;
}

export interface MetricsSnapshot {
  meta: {
    /** Nombre del proyecto al que pertenece el reporte. */
    scopeName: string;
    provider: IntegrationProvider;
    /** "live" = vino del proveedor; "sample" = datos de ejemplo. */
    source: "live" | "sample";
    /** Mensaje opcional (p. ej. motivo del fallback a ejemplo). */
    note?: string;
    generatedAt: string; // ISO
  };
  summary: SummaryRow[];
  velocity: VelocityPoint[];
  predictability: { points: PredictabilityPoint[]; target: number };
  cycleTime: { items: WorkItemDays[]; avg: number };
  aging: { items: WorkItemDays[]; threshold: number };
  blockers: BlockerRow[];
  quality: QualityPoint[];
  retro: RetroLight[];
}

/** Snapshot sin metadatos: lo que devuelve cada proveedor antes de sellar. */
export type RawSnapshot = Omit<MetricsSnapshot, "meta">;

/** Lo que devuelve un proveedor en vivo: el snapshot + una nota opcional
 *  (p. ej. qué secciones siguen usando datos de ejemplo). */
export interface ProviderResult {
  raw: RawSnapshot;
  note?: string;
}

/** Config de conexión de un equipo con su herramienta de gestión. */
export interface IntegrationConfig {
  provider: IntegrationProvider;
  /** Nombre del proyecto del reporte. */
  scopeName: string;
  baseUrl?: string;
  /** Project key (Jira) o nombre de proyecto (Azure DevOps). */
  project?: string;
  /** Board / rapidViewId (Jira) o team (Azure DevOps). */
  board?: string;
  /** Usuario/email (Jira) u organización (Azure DevOps). */
  email?: string;
  /** API token (Jira) o PAT (Azure DevOps). Nunca se expone al cliente. */
  token?: string;
}

/** Error de integración: el dispatcher lo captura y cae a datos de ejemplo. */
export class IntegrationError extends Error {}
