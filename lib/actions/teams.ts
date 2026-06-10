"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Team, Person } from "@/lib/models";
import { getViewer } from "@/lib/session";
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
  const v = await getViewer();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }
  await dbConnect();
  const own = v.isAdmin ? {} : { owner: v.id };
  if (id) {
    await Team.updateOne({ _id: id, ...own }, { $set: parsed.data });
  } else {
    await Team.create({ ...parsed.data, owner: v.id });
  }
  revalidatePath("/app/equipos");
  revalidatePath("/app");
  return { ok: true };
}

export async function deleteTeam(id: string): Promise<CrudResult> {
  const v = await getViewer();
  await dbConnect();
  await Team.deleteOne({ _id: id, ...(v.isAdmin ? {} : { owner: v.id }) });
  // Quita el equipo de las personas que lo referencian.
  await Person.updateMany(
    { ...(v.isAdmin ? {} : { owner: v.id }), teams: id },
    { $pull: { teams: id } },
  );
  revalidatePath("/app/equipos");
  revalidatePath("/app/personas");
  revalidatePath("/app");
  return { ok: true };
}
