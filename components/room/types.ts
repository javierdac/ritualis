export type Phase = "lobby" | "brainstorm" | "voting" | "discuss" | "closed";

export interface Column {
  key: string;
  label: string;
  emoji?: string;
}

export interface RoomState {
  authenticated: boolean;
  session: {
    code: string;
    dynamicName: string;
    ceremonia: string;
    teamName: string | null;
    phase: Phase;
    votesPerUser: number;
    columns: Column[];
    mode: "tablero" | "ruleta";
    timer: { running: boolean; endsAt: string | null; remainingSec: number | null };
    serverNow: string;
  };
  me: {
    id: string;
    name: string;
    isFacilitator: boolean;
    votesUsed: number;
    votesLeft: number;
  } | null;
  participants: {
    id: string;
    name: string;
    color: string;
    isFacilitator: boolean;
    isGuest: boolean;
    online: boolean;
  }[];
  cards: {
    id: string;
    column: string;
    text: string;
    authorId: string;
    authorName: string;
    isMine: boolean;
    voteCount: number;
    votedByMe: boolean;
  }[];
  actions: { id: string; text: string; done: boolean }[];
  wheel: { currentId: string | null; spunAt: string | null; doneIds: string[] };
}

/** Operación contra la API de la sala; devuelve el estado fresco o null si falló. */
export type OpFn = (p: Record<string, unknown>) => Promise<RoomState | null>;

export const COL_ACCENT = [
  "border-t-sky-500",
  "border-t-amber-500",
  "border-t-emerald-500",
  "border-t-violet-500",
  "border-t-rose-500",
];

export const PHASE_LABEL: Record<Phase, string> = {
  lobby: "Sala de espera",
  brainstorm: "Lluvia de ideas",
  voting: "Votación",
  discuss: "Discusión",
  closed: "Cerrada",
};

export const PHASE_ORDER: Phase[] = ["brainstorm", "voting", "discuss", "closed"];
