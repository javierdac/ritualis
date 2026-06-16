import {
  IntegrationError,
  type IntegrationConfig,
  type MetricsSnapshot,
  type ProviderResult,
  type RawSnapshot,
  type RetroLight,
  type SummaryRow,
} from "./types";
import { sampleSnapshot } from "./sample";
import { fetchJira } from "./jira";
import { fetchAzure } from "./azure";
import { fetchGithub } from "./github";

/* Dispatcher: dado el config de un equipo, devuelve un snapshot completo.
 *
 * 1) Resuelve el proveedor PRIMARIO (Jira / Azure / GitHub / ejemplo). Si el
 *    proveedor en vivo falla, cae a datos de ejemplo y deja el motivo en la nota.
 * 2) Si hay un OVERLAY de GitHub configurado sobre un primario Jira/Azure,
 *    fusiona sus secciones de flujo (Cycle/Lead Time, Aging) y —cuando el
 *    primario no las tiene en vivo— calidad. El primario sigue siendo el ancla
 *    de Velocity/Predictibilidad. */
export async function fetchMetrics(
  cfg: IntegrationConfig,
): Promise<MetricsSnapshot> {
  const generatedAt = new Date().toISOString();
  const primary = await runPrimary(cfg);

  const overlayEnabled =
    cfg.github?.token && (cfg.provider === "jira" || cfg.provider === "azure");

  if (overlayEnabled) {
    try {
      const gh = await fetchGithub(
        {
          provider: "github",
          scopeName: cfg.scopeName,
          baseUrl: cfg.github!.baseUrl,
          project: cfg.github!.project,
          board: cfg.github!.board,
          token: cfg.github!.token,
        },
        { overlay: true },
      );
      const merged = mergeOverlay(primary, gh);
      return seal(merged.raw, cfg, primary.source, generatedAt, merged.note);
    } catch (err) {
      const reason =
        err instanceof IntegrationError ? err.message : "No se pudo conectar con GitHub.";
      return seal(
        primary.raw,
        cfg,
        primary.source,
        generatedAt,
        joinNotes(primary.note, `Overlay de GitHub no disponible: ${reason}`),
      );
    }
  }

  return seal(primary.raw, cfg, primary.source, generatedAt, primary.note);
}

type PrimaryResult = ProviderResult & { source: "live" | "sample" };

/** Resuelve el snapshot del proveedor primario (con fallback a ejemplo). */
async function runPrimary(cfg: IntegrationConfig): Promise<PrimaryResult> {
  if (cfg.provider === "sample") {
    return { raw: sampleSnapshot(), source: "sample" };
  }
  try {
    const r =
      cfg.provider === "jira"
        ? await fetchJira(cfg)
        : cfg.provider === "github"
          ? await fetchGithub(cfg)
          : await fetchAzure(cfg);
    return { ...r, source: "live" };
  } catch (err) {
    const reason =
      err instanceof IntegrationError ? err.message : "No se pudo conectar con el proveedor.";
    return {
      raw: sampleSnapshot(),
      source: "sample",
      note: `${reason} Mostrando datos de ejemplo.`,
    };
  }
}

/** Fusiona un overlay de GitHub sobre el snapshot primario.
 *
 * - Flujo (Cycle/Lead Time, Aging): GitHub manda cuando lo tiene en vivo.
 * - Calidad: sólo rellena si el primario NO la tiene en vivo (las etiquetas de
 *   sprint de GitHub no coinciden con las del primario, así que no pisamos una
 *   calidad real para no romper la consistencia con la velocity). */
function mergeOverlay(primary: PrimaryResult, gh: ProviderResult): { raw: RawSnapshot; note?: string } {
  const raw: RawSnapshot = {
    ...primary.raw,
    summary: [...primary.raw.summary],
    retro: primary.raw.retro.map((r) => ({ ...r })),
  };
  const applied: string[] = [];

  if (gh.live?.flow) {
    raw.cycleTime = gh.raw.cycleTime;
    raw.aging = gh.raw.aging;
    raw.summary = replaceRows(raw.summary, ["Cycle Time", "Lead Time"], gh.raw.summary);
    raw.retro = replaceLights(raw.retro, ["Flujo"], gh.raw.retro);
    applied.push("Cycle/Lead Time", "Aging");
  }

  if (gh.live?.quality && !primary.live?.quality) {
    raw.quality = gh.raw.quality;
    raw.summary = replaceRows(raw.summary, ["Bugs Producción"], gh.raw.summary);
    raw.retro = replaceLights(raw.retro, ["Calidad"], gh.raw.retro);
    applied.push("Calidad");
  }

  const overlayNote = applied.length
    ? `Overlay desde GitHub: ${applied.join(", ")}.`
    : "Overlay de GitHub activo, pero sin datos nuevos para superponer.";
  return { raw, note: joinNotes(primary.note, overlayNote) };
}

/** Reemplaza filas del resumen (por label) con las del overlay, si existen. */
function replaceRows(target: SummaryRow[], labels: string[], from: SummaryRow[]): SummaryRow[] {
  return target.map((row) => {
    if (!labels.includes(row.label)) return row;
    return from.find((r) => r.label === row.label) ?? row;
  });
}

/** Reemplaza semáforos de retro (por área) con los del overlay, si existen. */
function replaceLights(target: RetroLight[], areas: string[], from: RetroLight[]): RetroLight[] {
  return target.map((light) => {
    if (!areas.includes(light.area)) return light;
    return from.find((l) => l.area === light.area) ?? light;
  });
}

function joinNotes(...notes: (string | undefined)[]): string | undefined {
  const parts = notes.filter((n): n is string => Boolean(n));
  return parts.length ? parts.join(" ") : undefined;
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
