"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError } from "next-auth";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models";
import { signIn, signOut } from "@/auth";

const registerSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export type ActionState = { error?: string } | undefined;

export async function registerUser(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { name, email, password } = parsed.data;
  await dbConnect();

  const exists = await User.findOne({ email });
  if (exists) {
    return { error: "Ya existe una cuenta con ese email" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ name, email, passwordHash });

  try {
    await signIn("credentials", { email, password, redirectTo: "/app" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Cuenta creada, pero falló el login automático" };
    }
    throw error; // redirect() lanza internamente: hay que dejarlo pasar.
  }
  return undefined;
}

export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}

export async function loginUser(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { email, password, redirectTo: "/app" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email o contraseña incorrectos" };
    }
    throw error;
  }
  return undefined;
}
