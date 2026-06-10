"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Project, Team } from "@/lib/models";
import { requireUser } from "@/lib/session";

export type CrudResult = { ok: boolean; error?: string };

const schema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  description: z.string().optional(),
});

export async function saveProject(
  id: string | null,
  data: { name: string; description?: string },
): Promise<CrudResult> {
  const user = await requireUser();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }
  await dbConnect();
  if (id) {
    await Project.updateOne({ _id: id, owner: user.id }, { $set: parsed.data });
  } else {
    await Project.create({ ...parsed.data, owner: user.id });
  }
  revalidatePath("/app/proyectos");
  revalidatePath("/app");
  return { ok: true };
}

export async function deleteProject(id: string): Promise<CrudResult> {
  const user = await requireUser();
  await dbConnect();
  await Project.deleteOne({ _id: id, owner: user.id });
  // Quita el proyecto de los equipos que lo referencian.
  await Team.updateMany(
    { owner: user.id, projects: id },
    { $pull: { projects: id } },
  );
  revalidatePath("/app/proyectos");
  revalidatePath("/app/equipos");
  revalidatePath("/app");
  return { ok: true };
}
