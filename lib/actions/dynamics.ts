"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Dynamic } from "@/lib/models";
import { requireUser } from "@/lib/session";
import type { CrudResult } from "./projects";

const stepSchema = z.object({
  titulo: z.string().min(1),
  detalle: z.string().min(1),
  duracionMin: z.number().optional(),
});

const schema = z.object({
  nombre: z.string().min(2, "Nombre muy corto"),
  resumen: z.string().min(5, "Resumen muy corto"),
  ceremonias: z.array(z.string()).min(1, "Elegí al menos una ceremonia"),
  objetivos: z.array(z.string()).default([]),
  duracionMin: z.number().min(1),
  equipoMin: z.number().min(1),
  equipoMax: z.number().min(1),
  energia: z.enum(["baja", "media", "alta"]),
  presencial: z.boolean(),
  remoto: z.boolean(),
  materiales: z.array(z.string()).default([]),
  pasos: z.array(stepSchema).min(1, "Agregá al menos un paso"),
  tips: z.array(z.string()).default([]),
});

export type DynamicInput = z.infer<typeof schema>;

export async function saveDynamic(
  id: string | null,
  data: DynamicInput,
): Promise<CrudResult> {
  const user = await requireUser();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }
  await dbConnect();
  if (id) {
    // Solo puede editar dinámicas propias (no las seed).
    const existing = await Dynamic.findById(id).lean();
    if (!existing) return { ok: false, error: "No existe" };
    if (existing.isSeed || String(existing.owner) !== user.id) {
      return { ok: false, error: "No podés editar esta dinámica" };
    }
    await Dynamic.updateOne({ _id: id }, { $set: parsed.data });
  } else {
    await Dynamic.create({ ...parsed.data, isSeed: false, owner: user.id });
  }
  revalidatePath("/app/dinamicas");
  revalidatePath("/app/ceremonias");
  return { ok: true };
}

export async function deleteDynamic(id: string): Promise<CrudResult> {
  const user = await requireUser();
  await dbConnect();
  const existing = await Dynamic.findById(id).lean();
  if (!existing) return { ok: false, error: "No existe" };
  if (existing.isSeed || String(existing.owner) !== user.id) {
    return { ok: false, error: "No podés borrar esta dinámica" };
  }
  await Dynamic.deleteOne({ _id: id });
  revalidatePath("/app/dinamicas");
  revalidatePath("/app/ceremonias");
  return { ok: true };
}

/** Clona una dinámica seed como propia para poder editarla. */
export async function cloneDynamic(id: string): Promise<CrudResult & { id?: string }> {
  const user = await requireUser();
  await dbConnect();
  const src = await Dynamic.findById(id).lean();
  if (!src) return { ok: false, error: "No existe" };
  const { _id, isSeed, owner, createdAt, updatedAt, ...rest } = src as Record<
    string,
    unknown
  >;
  void _id;
  void isSeed;
  void owner;
  void createdAt;
  void updatedAt;
  const created = await Dynamic.create({
    ...rest,
    nombre: `${(rest as { nombre: string }).nombre} (copia)`,
    isSeed: false,
    owner: user.id,
  });
  revalidatePath("/app/dinamicas");
  return { ok: true, id: created._id.toString() };
}
