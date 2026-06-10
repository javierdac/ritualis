"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models";
import { requireAdmin } from "@/lib/session";
import type { CrudResult } from "./projects";

const createSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  role: z.enum(["admin", "member"]),
});

const updateSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  role: z.enum(["admin", "member"]),
  password: z.string().min(6, "Mínimo 6 caracteres").optional().or(z.literal("")),
});

export async function saveUser(
  id: string | null,
  data: { name: string; email?: string; password?: string; role: "admin" | "member" },
): Promise<CrudResult> {
  await requireAdmin();
  await dbConnect();

  if (id) {
    const parsed = updateSchema.safeParse(data);
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };
    const update: Record<string, unknown> = {
      name: parsed.data.name,
      role: parsed.data.role,
    };
    if (parsed.data.password) {
      update.passwordHash = await bcrypt.hash(parsed.data.password, 10);
    }
    await User.updateOne({ _id: id }, { $set: update });
  } else {
    const parsed = createSchema.safeParse(data);
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };
    const exists = await User.findOne({ email: parsed.data.email });
    if (exists) return { ok: false, error: "Ya existe una cuenta con ese email" };
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role,
    });
  }
  revalidatePath("/app/usuarios");
  return { ok: true };
}

export async function deleteUser(id: string): Promise<CrudResult> {
  const admin = await requireAdmin();
  if (admin.id === id) {
    return { ok: false, error: "No podés borrar tu propia cuenta" };
  }
  await dbConnect();
  await User.deleteOne({ _id: id });
  revalidatePath("/app/usuarios");
  return { ok: true };
}
