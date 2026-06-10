"use server";

import { randomInt } from "crypto";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/db";
import { Dynamic, Session, Team } from "@/lib/models";
import { getViewer } from "@/lib/session";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin O/0/I/1

async function uniqueCode(): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    let code = "";
    for (let i = 0; i < 6; i++) code += ALPHABET[randomInt(ALPHABET.length)];
    const exists = await Session.exists({ code });
    if (!exists) return code;
  }
  throw new Error("No se pudo generar un código único");
}

export async function startSession(
  dynamicId: string,
  opts?: { teamId?: string },
): Promise<{ ok: boolean; code?: string; error?: string }> {
  const v = await getViewer();
  await dbConnect();

  const d = await Dynamic.findOne(
    v.isAdmin
      ? { _id: dynamicId }
      : { _id: dynamicId, $or: [{ isSeed: true }, { owner: v.id }] },
  ).lean();
  if (!d) return { ok: false, error: "Dinámica no encontrada" };
  const mode = d.modo ?? "tablero";
  if (mode === "tablero" && (!d.columns || d.columns.length === 0)) {
    return { ok: false, error: "Esta dinámica no tiene tablero en vivo" };
  }

  let teamName: string | undefined;
  if (opts?.teamId) {
    const team = await Team.findOne({
      _id: opts.teamId,
      ...(v.isAdmin ? {} : { owner: v.id }),
    }).lean();
    teamName = team?.name;
  }

  const code = await uniqueCode();
  await Session.create({
    code,
    dynamic: d._id,
    dynamicName: d.nombre,
    ceremonia: d.ceremonias[0] ?? "retro",
    team: opts?.teamId || undefined,
    teamName,
    facilitator: v.id,
    columns: mode === "ruleta" ? [] : d.columns,
    mode,
    phase: "brainstorm",
    votesPerUser: 3,
  });

  revalidatePath("/app/sesiones");
  return { ok: true, code };
}

export async function closeSession(code: string): Promise<{ ok: boolean }> {
  const v = await getViewer();
  await dbConnect();
  await Session.updateOne(
    { code, ...(v.isAdmin ? {} : { facilitator: v.id }) },
    { $set: { phase: "closed", timerRunning: false } },
  );
  revalidatePath("/app/sesiones");
  return { ok: true };
}
