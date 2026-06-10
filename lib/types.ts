export type Ceremonia =
  | "retro"
  | "daily"
  | "planning"
  | "review"
  | "refinement";

export type Objetivo =
  | "conocerse"
  | "descontracturar"
  | "mejorar-proceso"
  | "detectar-riesgos"
  | "celebrar"
  | "alinear"
  | "priorizar"
  | "recolectar-feedback";

export type Energia = "baja" | "media" | "alta";

export interface Paso {
  titulo: string;
  detalle: string;
  /** Duración sugerida del paso, en minutos. */
  duracionMin?: number;
}

/** Columna del tablero colaborativo (para sesiones en vivo). */
export interface Columna {
  key: string;
  label: string;
  emoji?: string;
}

export interface Dinamica {
  id: string;
  nombre: string;
  /** Una línea: qué es y para qué sirve. */
  resumen: string;
  ceremonias: Ceremonia[];
  objetivos: Objetivo[];
  /** Duración total estimada en minutos. */
  duracionMin: number;
  equipoMin: number;
  equipoMax: number;
  energia: Energia;
  /** Funciona bien en sesiones presenciales. */
  presencial: boolean;
  /** Funciona bien en remoto / herramientas online. */
  remoto: boolean;
  materiales: string[];
  pasos: Paso[];
  tips?: string[];
  /** Columnas del tablero en vivo. Si no tiene (ni modo ruleta), no se puede correr como sesión. */
  columns?: Columna[];
  /**
   * Modo de la sesión en vivo: "tablero" (columnas + cards, default) o
   * "ruleta" (rueda de turnos con los participantes).
   */
  modo?: "tablero" | "ruleta";
}

export const CEREMONIA_LABEL: Record<Ceremonia, string> = {
  retro: "Retrospectiva",
  daily: "Daily",
  planning: "Planning",
  review: "Review",
  refinement: "Refinement",
};

export const OBJETIVO_LABEL: Record<Objetivo, string> = {
  conocerse: "Conocerse",
  descontracturar: "Descontracturar",
  "mejorar-proceso": "Mejorar el proceso",
  "detectar-riesgos": "Detectar riesgos",
  celebrar: "Celebrar",
  alinear: "Alinear",
  priorizar: "Priorizar",
  "recolectar-feedback": "Recolectar feedback",
};

export const ENERGIA_LABEL: Record<Energia, string> = {
  baja: "Tranqui",
  media: "Media",
  alta: "Activa",
};
