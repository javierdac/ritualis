"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Connection, Integration, Project } from "@/lib/models";
import { getViewer } from "@/lib/session";
import type { CrudResult } from "./projects";

const schema = z.object({
  /* Conexión por usuario. */
  provider: z.enum(["sample", "jira", "azure"]),
  baseUrl: z.string().trim().optional(),
  email: z.string().trim().optional(),
  /** Token nuevo. Vacío = no tocar el guardado. */
  token: z.string().optional(),
  /* Mapeo del proyecto (valores en la herramienta externa). */
  project: z.string().trim().optional(),
  board: z.string().trim().optional(),
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
  const { provider, baseUrl, email, token, project, board } = parsed.data;

  if (provider !== "sample" && !baseUrl) {
    return { ok: false, error: "Falta la URL / organización de la conexión." };
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

  // Conexión: por usuario. El token sólo se sobrescribe si mandan uno nuevo.
  const conn: Record<string, unknown> = { provider, baseUrl, email };
  if (token && token.trim()) conn.token = token.trim();
  await Connection.updateOne(
    { owner: v.id },
    { $set: conn, $setOnInsert: { owner: v.id } },
    { upsert: true },
  );

  // Mapeo: por proyecto. El form manda el project key externo en `project`.
  await Integration.updateOne(
    { project: projectId },
    {
      $set: { externalProject: project, board },
      $setOnInsert: { project: projectId, owner: v.id },
    },
    { upsert: true },
  );

  revalidatePath("/app/metricas");
  return { ok: true };
}

/** Invalida el caché de métricas para forzar un refetch al proveedor. */
export async function refreshMetrics(): Promise<void> {
  revalidatePath("/app/metricas");
}
