"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Integration, Project } from "@/lib/models";
import { getViewer } from "@/lib/session";
import type { CrudResult } from "./projects";

const schema = z.object({
  /* Conexión por usuario. */
  provider: z.enum(["sample", "jira", "azure", "github"]),
  baseUrl: z.string().trim().optional(),
  email: z.string().trim().optional(),
  /** Token nuevo. Vacío = no tocar el guardado. */
  token: z.string().optional(),
  /* Mapeo del proyecto (valores en la herramienta externa). */
  project: z.string().trim().optional(),
  board: z.string().trim().optional(),
  /* Overlay de GitHub (opcional, sobre un primario Jira/Azure). */
  githubBaseUrl: z.string().trim().optional(),
  githubToken: z.string().optional(),
  githubOwner: z.string().trim().optional(),
  githubProjectNumber: z.string().trim().optional(),
});

export type IntegrationForm = z.infer<typeof schema>;

export async function saveIntegration(
  projectId: string,
  data: IntegrationForm,
): Promise<CrudResult> {
  const v = await getViewer();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }
  const {
    provider,
    baseUrl,
    email,
    token,
    project,
    board,
    githubBaseUrl,
    githubToken,
    githubOwner,
    githubProjectNumber,
  } = parsed.data;

  // GitHub usa github.com por defecto: la baseUrl sólo hace falta para Enterprise.
  if (provider !== "sample" && provider !== "github" && !baseUrl) {
    return { ok: false, error: "Falta la URL / organización de la conexión." };
  }
  if (provider === "github" && !project) {
    return { ok: false, error: "Falta el owner (organización o usuario) del Project." };
  }

  await dbConnect();

  // El proyecto tiene que ser visible para quien configura.
  const proj = await Project.findOne({
    _id: projectId,
    ...(v.isAdmin ? {} : { owner: v.id }),
  })
    .select("_id")
    .lean();
  if (!proj) return { ok: false, error: "Proyecto no encontrado" };

  // Toda la config es por proyecto: conexión + mapeo en un solo documento.
  // El form manda el project key externo en `project`. Los tokens sólo se
  // sobrescriben si mandan uno nuevo (vacío = no tocar el guardado).
  const set: Record<string, unknown> = {
    provider,
    baseUrl,
    email,
    githubBaseUrl,
    externalProject: project,
    board,
    githubOwner,
    githubProjectNumber,
  };
  if (token && token.trim()) set.token = token.trim();
  if (githubToken && githubToken.trim()) set.githubToken = githubToken.trim();
  await Integration.updateOne(
    { project: projectId },
    { $set: set, $setOnInsert: { project: projectId, owner: v.id } },
    { upsert: true },
  );

  revalidatePath("/app/metricas");
  return { ok: true };
}

/** Invalida el caché de métricas para forzar un refetch al proveedor. */
export async function refreshMetrics(): Promise<void> {
  revalidatePath("/app/metricas");
}
