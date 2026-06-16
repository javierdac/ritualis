/* Tipos compartidos del dashboard de métricas.
 *
 * La idea: cualquier proveedor (Jira, Azure DevOps, datos de ejemplo…)
 * produce un mismo `MetricsSnapshot`. La UI sólo conoce este tipo, así que
 * agregar un proveedor nuevo no toca la presentación. */

export type MetricStatus = "green" | "yellow" | "red";
export type IntegrationProvider = "sample" | "jira" | "azure" | "github";

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

/** Qué secciones del snapshot vinieron en vivo (vs. datos de ejemplo). Lo usa
 *  el merge del overlay para decidir qué superponer. */
export interface SectionLiveness {
  quality?: boolean;
  blockers?: boolean;
  flow?: boolean;
}

/** Lo que devuelve un proveedor en vivo: el snapshot + una nota opcional
 *  (p. ej. qué secciones siguen usando datos de ejemplo) + qué secciones son
 *  reales (para fusionar con un overlay). */
export interface ProviderResult {
  raw: RawSnapshot;
  note?: string;
  live?: SectionLiveness;
}

/** Config de un overlay de GitHub que se superpone a un primario Jira/Azure. */
export interface GithubOverlayConfig {
  baseUrl?: string;
  /** Owner (organización o usuario) del Project v2. */
  project?: string;
  /** Número del Project v2. */
  board?: string;
  /** PAT de GitHub. Nunca se expone al cliente. */
  token?: string;
}

/** Config de conexión de un equipo con su herramienta de gestión. */
export interface IntegrationConfig {
  provider: IntegrationProvider;
  /** Nombre del proyecto del reporte. */
  scopeName: string;
  baseUrl?: string;
  /** Project key (Jira), nombre de proyecto (Azure DevOps) u owner del Project v2 (GitHub). */
  project?: string;
  /** Board / rapidViewId (Jira), team (Azure DevOps) o número del Project v2 (GitHub). */
  board?: string;
  /** Usuario/email (Jira) u organización (Azure DevOps). No se usa en GitHub. */
  email?: string;
  /** API token (Jira), PAT (Azure DevOps) o PAT (GitHub). Nunca se expone al cliente. */
  token?: string;
  /** Overlay opcional de GitHub sobre un primario Jira/Azure (flujo + calidad). */
  github?: GithubOverlayConfig;
}

/** Error de integración: el dispatcher lo captura y cae a datos de ejemplo. */
export class IntegrationError extends Error {}
