import { randomInt, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import {
  Session,
  Participant,
  SessionCard,
  SessionAction,
  type ISession,
  type IParticipant,
} from "@/lib/models";
import { auth } from "@/auth";

const ONLINE_MS = 12_000;
const COLORS = [
  "#2563EB", "#F97316", "#10B981", "#8B5CF6", "#EC4899",
  "#F59E0B", "#06B6D4", "#EF4444", "#84CC16", "#14B8A6",
];

type SessionDoc = ISession & { _id: { toString(): string } };
type ParticipantDoc = IParticipant & { _id: { toString(): string } };

/* Esquemas de entrada por operación */
const objectId = z.string().regex(/^[0-9a-f]{24}$/i, "ID inválido");

const OPS = {
  join: z.object({ name: z.string().trim().max(60).optional() }),
  addCard: z.object({
    column: z.string().min(1),
    text: z.string().trim().min(1).max(500),
  }),
  editCard: z.object({ cardId: objectId, text: z.string().trim().min(1).max(500) }),
  deleteCard: z.object({ cardId: objectId }),
  vote: z.object({ cardId: objectId }),
  setPhase: z.object({
    phase: z.enum(["lobby", "brainstorm", "voting", "discuss", "closed"]),
  }),
  setTimer: z.object({
    action: z.enum(["start", "pause", "reset"]),
    minutes: z.number().min(0).max(480).optional(),
  }),
  addAction: z.object({ text: z.string().trim().min(1).max(300) }),
  toggleAction: z.object({ actionId: objectId }),
  deleteAction: z.object({ actionId: objectId }),
};

function badRequest(error: z.ZodError) {
  return NextResponse.json(
    { error: error.issues[0]?.message ?? "Datos inválidos" },
    { status: 400 },
  );
}

async function buildState(session: SessionDoc, me: ParticipantDoc | null) {
  const now = Date.now();
  const [participants, cards, actions] = await Promise.all([
    Participant.find({ session: session._id }).sort({ createdAt: 1 }).lean(),
    SessionCard.find({ session: session._id }).sort({ createdAt: 1 }).lean(),
    SessionAction.find({ session: session._id }).sort({ createdAt: 1 }).lean(),
  ]);

  const meId = me?._id.toString();
  const votesUsed = meId
    ? cards.filter((c) => c.votes.some((v: { toString(): string }) => v.toString() === meId)).length
    : 0;

  return {
    authenticated: !!me,
    session: {
      code: session.code,
      dynamicName: session.dynamicName,
      ceremonia: session.ceremonia,
      teamName: session.teamName ?? null,
      phase: session.phase,
      votesPerUser: session.votesPerUser,
      columns: session.columns,
      mode: session.mode ?? "tablero",
      timer: {
        running: session.timerRunning,
        endsAt: session.timerEndsAt ? new Date(session.timerEndsAt).toISOString() : null,
        remainingSec: session.timerRemainingSec ?? null,
      },
      serverNow: new Date(now).toISOString(),
    },
    me: me
      ? {
          id: meId,
          name: me.name,
          isFacilitator: me.isFacilitator,
          votesUsed,
          votesLeft: Math.max(0, session.votesPerUser - votesUsed),
        }
      : null,
    participants: participants.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      color: p.color,
      isFacilitator: p.isFacilitator,
      isGuest: p.isGuest,
      online: now - new Date(p.lastSeen).getTime() < ONLINE_MS,
    })),
    cards: cards.map((c) => ({
      id: c._id.toString(),
      column: c.column,
      text: c.text,
      authorId: c.author.toString(),
      authorName: c.authorName,
      isMine: meId ? c.author.toString() === meId : false,
      voteCount: c.votes.length,
      votedByMe: meId ? c.votes.some((v: { toString(): string }) => v.toString() === meId) : false,
    })),
    actions: actions.map((a) => ({
      id: a._id.toString(),
      text: a.text,
      done: a.done,
    })),
    wheel: {
      currentId: session.wheelCurrent?.toString() ?? null,
      spunAt: session.wheelSpunAt ? new Date(session.wheelSpunAt).toISOString() : null,
      doneIds: (session.wheelDone ?? []).map((id) => id.toString()),
    },
  };
}

async function findParticipant(sessionId: unknown, token: string | null) {
  if (!token) return null;
  return Participant.findOne({ session: sessionId, token }).lean();
}

/* ───────────── GET: estado de la sala ───────────── */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const token = new URL(req.url).searchParams.get("t");
  await dbConnect();

  const session = (await Session.findOne({ code }).lean()) as SessionDoc | null;
  if (!session) {
    return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
  }

  const me = (await findParticipant(session._id, token)) as ParticipantDoc | null;
  if (me) {
    await Participant.updateOne({ _id: me._id }, { $set: { lastSeen: new Date() } });
  } else {
    // Sin sesión válida: el cliente muestra la pantalla de ingreso.
    return NextResponse.json({
      authenticated: false,
      session: { code: session.code, dynamicName: session.dynamicName },
    });
  }

  return NextResponse.json(await buildState(session, me));
}

/* ───────────── POST: operaciones ───────────── */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const body = await req.json().catch(() => ({}));
  const { op } = body as { op?: string };
  await dbConnect();

  const session = (await Session.findOne({ code }).lean()) as SessionDoc | null;
  if (!session) {
    return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
  }

  /* JOIN — no requiere token previo */
  if (op === "join") {
    const parsed = OPS.join.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error);
    const authSession = await auth();
    const userId = authSession?.user?.id;
    const count = await Participant.countDocuments({ session: session._id });

    // Usuario logueado: reusa su participante si ya existe.
    if (userId) {
      const existing = await Participant.findOne({ session: session._id, user: userId });
      if (existing) {
        return NextResponse.json({
          token: existing.token,
          participantId: existing._id.toString(),
          name: existing.name,
        });
      }
      const name = parsed.data.name || authSession.user.name || "Anónimo";
      const token = randomUUID();
      const isFacilitator = session.facilitator.toString() === userId;
      const created = await Participant.create({
        session: session._id,
        user: userId,
        name,
        isGuest: false,
        isFacilitator,
        color: COLORS[count % COLORS.length],
        token,
      });
      return NextResponse.json({
        token,
        participantId: created._id.toString(),
        name,
      });
    }

    // Invitado: requiere nombre.
    const name = parsed.data.name;
    if (!name) {
      return NextResponse.json({ error: "Necesitás un nombre" }, { status: 400 });
    }
    const token = randomUUID();
    const created = await Participant.create({
      session: session._id,
      name,
      isGuest: true,
      isFacilitator: false,
      color: COLORS[count % COLORS.length],
      token,
    });
    return NextResponse.json({
      token,
      participantId: created._id.toString(),
      name,
    });
  }

  /* Resto: requiere token de participante */
  const token = (body.token as string) ?? null;
  const me = (await findParticipant(session._id, token)) as ParticipantDoc | null;
  if (!me) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  await Participant.updateOne({ _id: me._id }, { $set: { lastSeen: new Date() } });

  const isFac = me.isFacilitator;
  const phase = session.phase;

  switch (op) {
    case "addCard": {
      if (phase !== "brainstorm" && !isFac) break;
      const p = OPS.addCard.safeParse(body);
      if (!p.success) return badRequest(p.error);
      const { column, text } = p.data;
      if (!session.columns.some((c) => c.key === column)) break;
      await SessionCard.create({
        session: session._id,
        column,
        text,
        author: me._id,
        authorName: me.name,
        votes: [],
      });
      break;
    }
    case "editCard": {
      const p = OPS.editCard.safeParse(body);
      if (!p.success) return badRequest(p.error);
      const card = await SessionCard.findOne({ _id: p.data.cardId, session: session._id });
      if (!card) break;
      if (card.author.toString() !== me._id.toString() && !isFac) break;
      card.text = p.data.text;
      await card.save();
      break;
    }
    case "deleteCard": {
      const p = OPS.deleteCard.safeParse(body);
      if (!p.success) return badRequest(p.error);
      const card = await SessionCard.findOne({ _id: p.data.cardId, session: session._id });
      if (!card) break;
      if (card.author.toString() !== me._id.toString() && !isFac) break;
      await card.deleteOne();
      break;
    }
    case "vote": {
      if (phase !== "voting") break;
      const p = OPS.vote.safeParse(body);
      if (!p.success) return badRequest(p.error);
      const cardFilter = { _id: p.data.cardId, session: session._id };
      // Si ya había votado esta tarjeta, quitar el voto (atómico).
      const removed = await SessionCard.updateOne(
        { ...cardFilter, votes: me._id },
        { $pull: { votes: me._id } },
      );
      if (removed.modifiedCount === 0) {
        // Agregar primero y verificar el cupo después: si requests concurrentes
        // superaron votesPerUser, se revierte. Evita el check-then-write no atómico.
        const added = await SessionCard.updateOne(cardFilter, {
          $addToSet: { votes: me._id },
        });
        if (added.modifiedCount > 0) {
          const used = await SessionCard.countDocuments({
            session: session._id,
            votes: me._id,
          });
          if (used > session.votesPerUser) {
            await SessionCard.updateOne(cardFilter, { $pull: { votes: me._id } });
          }
        }
      }
      break;
    }
    case "setPhase": {
      if (!isFac) break;
      const p = OPS.setPhase.safeParse(body);
      if (!p.success) return badRequest(p.error);
      await Session.updateOne({ _id: session._id }, { $set: { phase: p.data.phase } });
      session.phase = p.data.phase;
      break;
    }
    case "setTimer": {
      if (!isFac) break;
      const p = OPS.setTimer.safeParse(body);
      if (!p.success) return badRequest(p.error);
      const { action } = p.data;
      if (action === "start") {
        const minutes = p.data.minutes ?? 0;
        if (minutes > 0) {
          const endsAt = new Date(Date.now() + minutes * 60_000);
          await Session.updateOne(
            { _id: session._id },
            { $set: { timerEndsAt: endsAt, timerRunning: true, timerRemainingSec: null } },
          );
        } else if (session.timerRemainingSec && session.timerRemainingSec > 0) {
          const endsAt = new Date(Date.now() + session.timerRemainingSec * 1000);
          await Session.updateOne(
            { _id: session._id },
            { $set: { timerEndsAt: endsAt, timerRunning: true, timerRemainingSec: null } },
          );
        }
      } else if (action === "pause") {
        const remaining = session.timerEndsAt
          ? Math.max(0, Math.round((new Date(session.timerEndsAt).getTime() - Date.now()) / 1000))
          : 0;
        await Session.updateOne(
          { _id: session._id },
          { $set: { timerRunning: false, timerRemainingSec: remaining, timerEndsAt: null } },
        );
      } else if (action === "reset") {
        await Session.updateOne(
          { _id: session._id },
          { $set: { timerRunning: false, timerRemainingSec: null, timerEndsAt: null } },
        );
      }
      break;
    }
    case "spin": {
      if (!isFac || session.mode !== "ruleta" || phase === "closed") break;
      const parts = (await Participant.find({ session: session._id })
        .sort({ createdAt: 1 })
        .lean()) as ParticipantDoc[];
      const now = Date.now();
      const excluded = new Set((session.wheelDone ?? []).map((id) => id.toString()));
      if (session.wheelCurrent) excluded.add(session.wheelCurrent.toString());
      // Solo participantes presentes: girar hacia alguien que se fue frustra la ronda.
      const candidates = parts.filter(
        (p) =>
          !excluded.has(p._id.toString()) &&
          now - new Date(p.lastSeen).getTime() < ONLINE_MS,
      );
      if (candidates.length === 0) break;
      const chosen = candidates[randomInt(candidates.length)];
      await Session.updateOne(
        { _id: session._id },
        {
          $set: { wheelCurrent: chosen._id, wheelSpunAt: new Date() },
          ...(session.wheelCurrent
            ? { $addToSet: { wheelDone: session.wheelCurrent } }
            : {}),
        },
      );
      break;
    }
    case "wheelReset": {
      if (!isFac || session.mode !== "ruleta") break;
      await Session.updateOne(
        { _id: session._id },
        { $set: { wheelCurrent: null, wheelSpunAt: null, wheelDone: [] } },
      );
      break;
    }
    case "addAction": {
      const p = OPS.addAction.safeParse(body);
      if (!p.success) return badRequest(p.error);
      await SessionAction.create({
        session: session._id,
        text: p.data.text,
        createdByName: me.name,
      });
      break;
    }
    case "toggleAction": {
      const p = OPS.toggleAction.safeParse(body);
      if (!p.success) return badRequest(p.error);
      const a = await SessionAction.findOne({ _id: p.data.actionId, session: session._id });
      if (a) {
        a.done = !a.done;
        await a.save();
      }
      break;
    }
    case "deleteAction": {
      if (!isFac) break;
      const p = OPS.deleteAction.safeParse(body);
      if (!p.success) return badRequest(p.error);
      await SessionAction.deleteOne({ _id: p.data.actionId, session: session._id });
      break;
    }
    default:
      return NextResponse.json({ error: "Operación inválida" }, { status: 400 });
  }

  const fresh = (await Session.findById(session._id).lean()) as SessionDoc;
  return NextResponse.json(await buildState(fresh, me));
}
