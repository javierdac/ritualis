"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Team, Person } from "@/lib/models";
import { requireUser } from "@/lib/session";
import type { CrudResult } from "./projects";

const schema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  description: z.string().optional(),
  projects: z.array(z.string()).default([]),
});

export async function saveTeam(
  id: string | null,
  data: { name: string; description?: string; projects: string[] },
): Promise<CrudResult> {
  const user = await requireUser();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }
  await dbConnect();
  if (id) {
    await Team.updateOne({ _id: id, owner: user.id }, { $set: parsed.data });
  } else {
    await Team.create({ ...parsed.data, owner: user.id });
  }
  revalidatePath("/app/equipos");
  revalidatePath("/app");
  return { ok: true };
}

export async function deleteTeam(id: string): Promise<CrudResult> {
  const user = await requireUser();
  await dbConnect();
  await Team.deleteOne({ _id: id, owner: user.id });
  // Quita el equipo de las personas que lo referencian.
  await Person.updateMany(
    { owner: user.id, teams: id },
    { $pull: { teams: id } },
  );
  revalidatePath("/app/equipos");
  revalidatePath("/app/personas");
  revalidatePath("/app");
  return { ok: true };
}
