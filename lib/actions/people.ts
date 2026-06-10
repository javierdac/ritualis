"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Person, Note } from "@/lib/models";
import { requireUser } from "@/lib/session";
import type { CrudResult } from "./projects";

const schema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  role: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  teams: z.array(z.string()).default([]),
});

export async function savePerson(
  id: string | null,
  data: { name: string; role?: string; email?: string; teams: string[] },
): Promise<CrudResult> {
  const user = await requireUser();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }
  await dbConnect();
  const payload = { ...parsed.data, email: parsed.data.email || undefined };
  if (id) {
    await Person.updateOne({ _id: id, owner: user.id }, { $set: payload });
  } else {
    await Person.create({ ...payload, owner: user.id });
  }
  revalidatePath("/app/personas");
  revalidatePath("/app");
  return { ok: true };
}

export async function deletePerson(id: string): Promise<CrudResult> {
  const user = await requireUser();
  await dbConnect();
  await Person.deleteOne({ _id: id, owner: user.id });
  await Note.deleteMany({ person: id });
  revalidatePath("/app/personas");
  revalidatePath("/app");
  return { ok: true };
}

/* ───────────── Notas por persona ───────────── */
export async function addNote(
  personId: string,
  text: string,
): Promise<CrudResult> {
  const user = await requireUser();
  if (text.trim().length < 1) return { ok: false, error: "Nota vacía" };
  await dbConnect();
  // Verifica que la persona sea del usuario.
  const person = await Person.findOne({ _id: personId, owner: user.id }).lean();
  if (!person) return { ok: false, error: "Persona no encontrada" };
  await Note.create({ person: personId, author: user.id, text: text.trim() });
  revalidatePath(`/app/personas/${personId}`);
  return { ok: true };
}

export async function deleteNote(
  noteId: string,
  personId: string,
): Promise<CrudResult> {
  const user = await requireUser();
  await dbConnect();
  await Note.deleteOne({ _id: noteId, author: user.id });
  revalidatePath(`/app/personas/${personId}`);
  return { ok: true };
}
