import mongoose, { Schema, model, models, type Types } from "mongoose";

/* ───────────────────────── User ───────────────────────── */
export type UserRole = "admin" | "member";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
  },
  { timestamps: true },
);

/* ───────────────────────── Project ───────────────────────── */
export interface IProject {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true },
);

/* ───────────────────────── Team ─────────────────────────
   M:N con Project (un equipo puede estar en varios proyectos). */
export interface ITeam {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  projects: Types.ObjectId[];
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true },
);

/* ───────────────────────── Person ───────────────────────
   M:N con Team (una persona puede estar en varios equipos). */
export interface IPerson {
  _id: Types.ObjectId;
  name: string;
  role?: string;
  email?: string;
  teams: Types.ObjectId[];
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PersonSchema = new Schema<IPerson>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true },
);

/* ───────────────────────── Integration (config por proyecto) ────────────
   Toda la configuración de métricas es POR PROYECTO: proveedor, credenciales
   y mapeo al board externo viven juntos acá. Las credenciales quedan
   compartidas a nivel proyecto (quien lo ve usa el token guardado). 1:1 con
   Project. */
export type IntegrationProvider = "sample" | "jira" | "azure" | "github";

export interface IIntegration {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  /** Quién configuró la integración (para auditoría). */
  owner: Types.ObjectId;
  /* ── Conexión con el proveedor primario (por proyecto) ── */
  provider: IntegrationProvider;
  /** baseUrl de Jira, organización de Azure DevOps o API base de GitHub Enterprise. */
  baseUrl?: string;
  /** email (Jira) / organización (Azure DevOps, en baseUrl o acá). No se usa en GitHub. */
  email?: string;
  /** API token (Jira), PAT (Azure DevOps) o PAT (GitHub). No se expone al cliente. */
  token?: string;
  /* ── Mapeo del proyecto dentro de la herramienta ── */
  /** Project key (Jira), nombre de proyecto (Azure DevOps) u owner del Project v2 (GitHub). */
  externalProject?: string;
  /** Board / rapidViewId (Jira), team (Azure DevOps) o número del Project v2 (GitHub). */
  board?: string;
  /* ── Overlay opcional de GitHub (por proyecto), cuando el primario es Jira/Azure ── */
  /** API base de GitHub Enterprise (vacío = github.com). */
  githubBaseUrl?: string;
  /** PAT de GitHub para el overlay. No se expone al cliente. */
  githubToken?: string;
  /** Owner (organización o usuario) del Project v2 de GitHub. */
  githubOwner?: string;
  /** Número del Project v2 de GitHub. */
  githubProjectNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IntegrationSchema = new Schema<IIntegration>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true, unique: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    provider: { type: String, enum: ["sample", "jira", "azure", "github"], default: "sample" },
    baseUrl: { type: String, trim: true },
    email: { type: String, trim: true },
    token: { type: String },
    externalProject: { type: String, trim: true },
    board: { type: String, trim: true },
    githubBaseUrl: { type: String, trim: true },
    githubToken: { type: String },
    githubOwner: { type: String, trim: true },
    githubProjectNumber: { type: String, trim: true },
  },
  { timestamps: true },
);

/* ───────────────────────── Note (por persona) ───────────────────────── */
export interface INote {
  _id: Types.ObjectId;
  person: Types.ObjectId;
  author: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    person: { type: Schema.Types.ObjectId, ref: "Person", required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

/* ───────────────────────── Dynamic (dinámica) ───────────────────────── */
export interface IStep {
  titulo: string;
  detalle: string;
  duracionMin?: number;
}

export interface IDynamic {
  _id: Types.ObjectId;
  nombre: string;
  resumen: string;
  ceremonias: string[];
  objetivos: string[];
  duracionMin: number;
  equipoMin: number;
  equipoMax: number;
  energia: "baja" | "media" | "alta";
  presencial: boolean;
  remoto: boolean;
  materiales: string[];
  pasos: IStep[];
  tips: string[];
  columns?: IColumn[];
  modo?: "tablero" | "ruleta" | "posta";
  isSeed: boolean;
  owner?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IColumn {
  key: string;
  label: string;
  emoji?: string;
}

const StepSchema = new Schema<IStep>(
  {
    titulo: { type: String, required: true },
    detalle: { type: String, required: true },
    duracionMin: { type: Number },
  },
  { _id: false },
);

const ColumnSchema = new Schema<IColumn>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    emoji: { type: String },
  },
  { _id: false },
);

const DynamicSchema = new Schema<IDynamic>(
  {
    nombre: { type: String, required: true, trim: true },
    resumen: { type: String, required: true, trim: true },
    ceremonias: [{ type: String, required: true }],
    objetivos: [{ type: String }],
    duracionMin: { type: Number, required: true },
    equipoMin: { type: Number, default: 2 },
    equipoMax: { type: Number, default: 12 },
    energia: { type: String, enum: ["baja", "media", "alta"], default: "media" },
    presencial: { type: Boolean, default: true },
    remoto: { type: Boolean, default: true },
    materiales: [{ type: String }],
    pasos: [StepSchema],
    tips: [{ type: String }],
    columns: [ColumnSchema],
    modo: { type: String, enum: ["tablero", "ruleta", "posta"] },
    isSeed: { type: Boolean, default: false, index: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true },
);

/* ───────────────────────── Session (sesión en vivo) ───────────────────────── */
export type SessionPhase = "lobby" | "brainstorm" | "voting" | "discuss" | "closed";

export interface ISession {
  _id: Types.ObjectId;
  code: string;
  dynamic?: Types.ObjectId;
  dynamicName: string;
  ceremonia: string;
  team?: Types.ObjectId;
  teamName?: string;
  facilitator: Types.ObjectId;
  columns: IColumn[];
  mode: "tablero" | "ruleta" | "posta";
  phase: SessionPhase;
  votesPerUser: number;
  timerEndsAt?: Date | null;
  timerRemainingSec?: number | null; // si está pausado
  timerRunning: boolean;
  /* Estado de la ronda de turnos (modes "ruleta" y "posta") */
  wheelCurrent?: Types.ObjectId | null;
  wheelSpunAt?: Date | null;
  wheelDone: Types.ObjectId[];
  /** Orden pre-sorteado de próximos turnos (op shuffle); vacío = azar puro. */
  wheelQueue: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    code: { type: String, required: true, unique: true, index: true },
    dynamic: { type: Schema.Types.ObjectId, ref: "Dynamic" },
    dynamicName: { type: String, required: true },
    ceremonia: { type: String, required: true },
    team: { type: Schema.Types.ObjectId, ref: "Team" },
    teamName: { type: String },
    facilitator: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    columns: [ColumnSchema],
    mode: { type: String, enum: ["tablero", "ruleta", "posta"], default: "tablero" },
    phase: {
      type: String,
      enum: ["lobby", "brainstorm", "voting", "discuss", "closed"],
      default: "brainstorm",
    },
    votesPerUser: { type: Number, default: 3 },
    timerEndsAt: { type: Date, default: null },
    timerRemainingSec: { type: Number, default: null },
    timerRunning: { type: Boolean, default: false },
    wheelCurrent: { type: Schema.Types.ObjectId, ref: "Participant", default: null },
    wheelSpunAt: { type: Date, default: null },
    wheelDone: [{ type: Schema.Types.ObjectId, ref: "Participant" }],
    wheelQueue: [{ type: Schema.Types.ObjectId, ref: "Participant" }],
  },
  { timestamps: true },
);

/* ───────────────────────── Participant ───────────────────────── */
export interface IParticipant {
  _id: Types.ObjectId;
  session: Types.ObjectId;
  user?: Types.ObjectId;
  name: string;
  isGuest: boolean;
  isFacilitator: boolean;
  /** Agregado a mano por el facilitador (o precargado desde un equipo): no
   *  pollea, así que cuenta como presente hasta que lo saquen o alguien
   *  reclame su lugar entrando con el mismo nombre. */
  isManual: boolean;
  color: string;
  token: string;
  lastSeen: Date;
  createdAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    session: { type: Schema.Types.ObjectId, ref: "Session", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    isGuest: { type: Boolean, default: true },
    isFacilitator: { type: Boolean, default: false },
    isManual: { type: Boolean, default: false },
    color: { type: String, default: "#2563EB" },
    token: { type: String, required: true, index: true },
    lastSeen: { type: Date, default: () => new Date() },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

/* ───────────────────────── SessionCard ───────────────────────── */
export interface ISessionCard {
  _id: Types.ObjectId;
  session: Types.ObjectId;
  column: string;
  text: string;
  author: Types.ObjectId; // Participant
  authorName: string;
  votes: Types.ObjectId[]; // Participants que votaron
  createdAt: Date;
  updatedAt: Date;
}

const SessionCardSchema = new Schema<ISessionCard>(
  {
    session: { type: Schema.Types.ObjectId, ref: "Session", required: true, index: true },
    column: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "Participant", required: true },
    authorName: { type: String, required: true },
    votes: [{ type: Schema.Types.ObjectId, ref: "Participant" }],
  },
  { timestamps: true },
);

/* ───────────────────────── SessionAction (acción acordada) ───────────────────────── */
export interface ISessionAction {
  _id: Types.ObjectId;
  session: Types.ObjectId;
  text: string;
  done: boolean;
  createdByName: string;
  createdAt: Date;
}

const SessionActionSchema = new Schema<ISessionAction>(
  {
    session: { type: Schema.Types.ObjectId, ref: "Session", required: true, index: true },
    text: { type: String, required: true },
    done: { type: Boolean, default: false },
    createdByName: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

/* ───────────────────────── Exports ───────────────────────── */
export const User = models.User || model<IUser>("User", UserSchema);
export const Project = models.Project || model<IProject>("Project", ProjectSchema);
export const Team = models.Team || model<ITeam>("Team", TeamSchema);
export const Person = models.Person || model<IPerson>("Person", PersonSchema);
export const Integration =
  models.Integration || model<IIntegration>("Integration", IntegrationSchema);
export const Note = models.Note || model<INote>("Note", NoteSchema);
export const Dynamic = models.Dynamic || model<IDynamic>("Dynamic", DynamicSchema);
export const Session = models.Session || model<ISession>("Session", SessionSchema);
export const Participant =
  models.Participant || model<IParticipant>("Participant", ParticipantSchema);
export const SessionCard =
  models.SessionCard || model<ISessionCard>("SessionCard", SessionCardSchema);
export const SessionAction =
  models.SessionAction || model<ISessionAction>("SessionAction", SessionActionSchema);

// Asegura que mongoose esté importado (evita tree-shaking del registro de modelos).
export { mongoose };
