import { dbConnect } from "@/lib/db";
import {
  User,
  Project,
  Team,
  Person,
  Connection,
  Integration,
  Note,
  Dynamic,
  Session,
  Participant,
  SessionCard,
} from "@/lib/models";
import { serialize } from "@/lib/serialize";
import type {
  ProjectDTO,
  TeamDTO,
  PersonDTO,
  NoteDTO,
  DynamicDTO,
  IntegrationDTO,
} from "@/lib/dto";
import type { Ceremonia } from "@/lib/types";
import { fetchMetrics } from "@/lib/integrations/provider";
import type { MetricsSnapshot } from "@/lib/integrations/types";

/* Scope por dueño (los admin ven todo). */
function scope(ownerId: string, isAdmin: boolean): Record<string, unknown> {
  return isAdmin ? {} : { owner: ownerId };
}
function matchScope(ownerId: string, isAdmin: boolean): Record<string, unknown> {
  return isAdmin ? {} : { owner: toId(ownerId) };
}

/* ───────────── Proyectos ───────────── */
export async function getProjects(
  ownerId: string,
  isAdmin = false,
): Promise<ProjectDTO[]> {
  await dbConnect();
  const projects = await Project.find(scope(ownerId, isAdmin))
    .sort({ createdAt: -1 })
    .lean();
  const teamCounts = await Team.aggregate([
    { $match: matchScope(ownerId, isAdmin) },
    { $unwind: "$projects" },
    { $group: { _id: "$projects", count: { $sum: 1 } } },
  ]);
  const map = new Map(teamCounts.map((t) => [String(t._id), t.count]));
  return projects.map((p) => ({
    ...serialize(p),
    teamCount: map.get(String(p._id)) ?? 0,
  })) as ProjectDTO[];
}

/* ───────────── Equipos ───────────── */
export async function getTeams(
  ownerId: string,
  isAdmin = false,
): Promise<TeamDTO[]> {
  await dbConnect();
  const teams = await Team.find(scope(ownerId, isAdmin))
    .sort({ createdAt: -1 })
    .populate("projects", "name")
    .lean();
  const memberAgg = await Person.aggregate([
    { $match: matchScope(ownerId, isAdmin) },
    { $unwind: "$teams" },
    { $group: { _id: "$teams", members: { $push: "$_id" } } },
  ]);
  const map = new Map(
    memberAgg.map((t) => [String(t._id), t.members.map(String) as string[]]),
  );
  return teams.map((t) => {
    const s = serialize(t) as unknown as {
      _id: string;
      name: string;
      description?: string;
      projects: { _id: string; name: string }[];
      createdAt: string;
    };
    const members = map.get(s._id) ?? [];
    return {
      _id: s._id,
      name: s.name,
      description: s.description,
      projects: s.projects.map((p) => p._id),
      projectNames: s.projects,
      members,
      memberCount: members.length,
      createdAt: s.createdAt,
    } satisfies TeamDTO;
  });
}

/* ───────────── Personas ───────────── */
export async function getPeople(
  ownerId: string,
  isAdmin = false,
): Promise<PersonDTO[]> {
  await dbConnect();
  const people = await Person.find(scope(ownerId, isAdmin))
    .sort({ createdAt: -1 })
    .populate("teams", "name")
    .lean();
  const noteCounts = await Note.aggregate([
    { $group: { _id: "$person", count: { $sum: 1 } } },
  ]);
  const map = new Map(noteCounts.map((n) => [String(n._id), n.count]));
  return people.map((p) => {
    const s = serialize(p) as unknown as {
      _id: string;
      name: string;
      role?: string;
      email?: string;
      teams: { _id: string; name: string }[];
      createdAt: string;
    };
    return {
      _id: s._id,
      name: s.name,
      role: s.role,
      email: s.email,
      teams: s.teams.map((t) => t._id),
      teamNames: s.teams,
      noteCount: map.get(s._id) ?? 0,
      createdAt: s.createdAt,
    } satisfies PersonDTO;
  });
}

export async function getPerson(
  ownerId: string,
  personId: string,
  isAdmin = false,
): Promise<PersonDTO | null> {
  await dbConnect();
  const p = await Person.findOne({ _id: personId, ...scope(ownerId, isAdmin) })
    .populate("teams", "name")
    .lean();
  if (!p) return null;
  const s = serialize(p) as unknown as {
    _id: string;
    name: string;
    role?: string;
    email?: string;
    teams: { _id: string; name: string }[];
    createdAt: string;
  };
  return {
    _id: s._id,
    name: s.name,
    role: s.role,
    email: s.email,
    teams: s.teams.map((t) => t._id),
    teamNames: s.teams,
    createdAt: s.createdAt,
  };
}

export async function getNotes(personId: string): Promise<NoteDTO[]> {
  await dbConnect();
  const notes = await Note.find({ person: personId })
    .sort({ createdAt: -1 })
    .populate("author", "name")
    .lean();
  return notes.map((n) => {
    const s = serialize(n) as unknown as {
      _id: string;
      text: string;
      author: { name: string } | null;
      createdAt: string;
    };
    return {
      _id: s._id,
      text: s.text,
      authorName: s.author?.name ?? "—",
      createdAt: s.createdAt,
    };
  });
}

/* ───────────── Métricas / Integraciones ───────────── */

/** Proyectos a los que el usuario puede mirar métricas (id + nombre). */
export async function getProjectOptions(
  ownerId: string,
  isAdmin = false,
): Promise<{ _id: string; name: string }[]> {
  await dbConnect();
  const projects = await Project.find(scope(ownerId, isAdmin))
    .sort({ name: 1 })
    .select("name")
    .lean();
  return projects.map((p) => ({ _id: String(p._id), name: p.name as string }));
}

/** Config de integración para el formulario: conexión del usuario (por
 *  usuario) + mapeo del proyecto. Nunca expone el token. */
export async function getIntegration(
  ownerId: string,
  projectId: string,
): Promise<IntegrationDTO> {
  await dbConnect();
  const [conn, mapping] = await Promise.all([
    Connection.findOne({ owner: ownerId }).lean(),
    Integration.findOne({ project: projectId, owner: ownerId }).lean(),
  ]);
  return {
    provider: (conn?.provider as IntegrationDTO["provider"]) ?? "sample",
    baseUrl: conn?.baseUrl,
    email: conn?.email,
    hasToken: Boolean(conn?.token),
    project: mapping?.externalProject,
    board: mapping?.board,
    githubBaseUrl: conn?.githubBaseUrl,
    hasGithubToken: Boolean(conn?.githubToken),
    githubOwner: mapping?.githubOwner,
    githubProjectNumber: mapping?.githubProjectNumber,
  };
}

/** Snapshot de métricas del proyecto, combinando la conexión del usuario con
 *  el mapeo del proyecto. */
export async function getProjectMetrics(
  ownerId: string,
  projectId: string,
  isAdmin = false,
): Promise<MetricsSnapshot | null> {
  await dbConnect();
  const project = await Project.findOne({ _id: projectId, ...scope(ownerId, isAdmin) })
    .select("name")
    .lean();
  if (!project) return null;
  // Las credenciales son del usuario que mira; el mapeo es del proyecto.
  const [conn, mapping] = await Promise.all([
    Connection.findOne({ owner: ownerId }).lean(),
    Integration.findOne({ project: projectId, owner: ownerId }).lean(),
  ]);
  // Overlay de GitHub: sólo si hay PAT (por usuario) y mapeo (por proyecto).
  const github =
    conn?.githubToken && mapping?.githubOwner && mapping?.githubProjectNumber
      ? {
          baseUrl: conn.githubBaseUrl,
          project: mapping.githubOwner,
          board: mapping.githubProjectNumber,
          token: conn.githubToken,
        }
      : undefined;

  return fetchMetrics({
    provider: (conn?.provider as MetricsSnapshot["meta"]["provider"]) ?? "sample",
    scopeName: project.name as string,
    baseUrl: conn?.baseUrl,
    email: conn?.email,
    token: conn?.token,
    project: mapping?.externalProject,
    board: mapping?.board,
    github,
  });
}

/* ───────────── Dinámicas ───────────── */
export async function getDynamics(
  ownerId: string,
  ceremonia?: Ceremonia,
  isAdmin = false,
): Promise<DynamicDTO[]> {
  await dbConnect();
  const filter: Record<string, unknown> = isAdmin
    ? {}
    : { $or: [{ isSeed: true }, { owner: ownerId }] };
  if (ceremonia) filter.ceremonias = ceremonia;
  const dynamics = await Dynamic.find(filter).sort({ nombre: 1 }).lean();
  return serialize(dynamics) as DynamicDTO[];
}

export async function getDynamic(
  ownerId: string,
  id: string,
  isAdmin = false,
): Promise<DynamicDTO | null> {
  await dbConnect();
  const d = await Dynamic.findOne(
    isAdmin ? { _id: id } : { _id: id, $or: [{ isSeed: true }, { owner: ownerId }] },
  ).lean();
  return d ? (serialize(d) as DynamicDTO) : null;
}

/* ───────────── Sesiones en vivo ───────────── */
export async function getSessions(ownerId: string, isAdmin = false) {
  await dbConnect();
  const sessions = await Session.find(isAdmin ? {} : { facilitator: ownerId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  const ids = sessions.map((s) => s._id);
  const [partCounts, cardCounts] = await Promise.all([
    Participant.aggregate([
      { $match: { session: { $in: ids } } },
      { $group: { _id: "$session", count: { $sum: 1 } } },
    ]),
    SessionCard.aggregate([
      { $match: { session: { $in: ids } } },
      { $group: { _id: "$session", count: { $sum: 1 } } },
    ]),
  ]);
  const pMap = new Map(partCounts.map((p) => [String(p._id), p.count]));
  const cMap = new Map(cardCounts.map((c) => [String(c._id), c.count]));
  return sessions.map((s) => ({
    code: s.code,
    dynamicName: s.dynamicName,
    ceremonia: s.ceremonia,
    teamName: s.teamName ?? null,
    phase: s.phase,
    participants: pMap.get(String(s._id)) ?? 0,
    cards: cMap.get(String(s._id)) ?? 0,
    createdAt: (s.createdAt as Date).toISOString(),
  }));
}

/* ───────────── Usuarios (solo admin) ───────────── */
export async function getUsers() {
  await dbConnect();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  return users.map((u) => ({
    _id: String(u._id),
    name: u.name,
    email: u.email,
    role: (u.role ?? "member") as "admin" | "member",
    createdAt: (u.createdAt as Date).toISOString(),
  }));
}

export async function getCounts(ownerId: string, isAdmin = false) {
  await dbConnect();
  const [projects, teams, people, dynamics] = await Promise.all([
    Project.countDocuments(scope(ownerId, isAdmin)),
    Team.countDocuments(scope(ownerId, isAdmin)),
    Person.countDocuments(scope(ownerId, isAdmin)),
    Dynamic.countDocuments(
      isAdmin ? {} : { $or: [{ isSeed: true }, { owner: ownerId }] },
    ),
  ]);
  return { projects, teams, people, dynamics };
}

/* Helper: castea string a ObjectId para los aggregates. */
import { mongoose } from "@/lib/models";
function toId(id: string) {
  return new mongoose.Types.ObjectId(id);
}
