import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Devuelve el usuario logueado o redirige a /login. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

export interface Viewer {
  id: string;
  role: "admin" | "member";
  isAdmin: boolean;
}

/** Usuario logueado como "viewer" con flag isAdmin (o redirige). */
export async function getViewer(): Promise<Viewer> {
  const user = await requireUser();
  const role = user.role ?? "member";
  return { id: user.id, role, isAdmin: role === "admin" };
}

/** Exige rol admin; si no, redirige al dashboard. */
export async function requireAdmin(): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer.isAdmin) redirect("/app");
  return viewer;
}
