import {
  IntegrationError,
  type IntegrationConfig,
  type MetricsSnapshot,
  type RawSnapshot,
} from "./types";
import { sampleSnapshot } from "./sample";
import { fetchJira } from "./jira";
import { fetchAzure } from "./azure";

/* Dispatcher: dado el config de un equipo, devuelve un snapshot completo.
 * Si el proveedor en vivo falla (o todavía no está mapeado), cae a datos de
 * ejemplo y deja el motivo en `meta.note` para mostrarlo en la UI. */
export async function fetchMetrics(
  cfg: IntegrationConfig,
): Promise<MetricsSnapshot> {
  const generatedAt = new Date().toISOString();

  if (cfg.provider === "sample") {
    return seal(sampleSnapshot(), cfg, "sample", generatedAt);
  }

  try {
    const { raw, note } =
      cfg.provider === "jira" ? await fetchJira(cfg) : await fetchAzure(cfg);
    return seal(raw, cfg, "live", generatedAt, note);
  } catch (err) {
    const reason =
      err instanceof IntegrationError
        ? err.message
        : "No se pudo conectar con el proveedor.";
    return seal(
      sampleSnapshot(),
      cfg,
      "sample",
      generatedAt,
      `${reason} Mostrando datos de ejemplo.`,
    );
  }
}

function seal(
  raw: RawSnapshot,
  cfg: IntegrationConfig,
  source: "live" | "sample",
  generatedAt: string,
  note?: string,
): MetricsSnapshot {
  return {
    ...raw,
    meta: {
      scopeName: cfg.scopeName,
      provider: cfg.provider,
      source,
      note,
      generatedAt,
    },
  };
}
