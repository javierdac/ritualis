"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  ThumbsUp,
  Trash2,
  Pencil,
  Check,
  X,
  Play,
  Pause,
  RotateCcw,
  Users,
  Copy,
  Clock,
  ListChecks,
} from "lucide-react";
import { toast } from "sonner";
import { ColumnIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { RitualisMark } from "@/components/brand/ritualis-mark";

type Phase = "lobby" | "brainstorm" | "voting" | "discuss" | "closed";

interface Column {
  key: string;
  label: string;
  emoji?: string;
}
interface RoomState {
  authenticated: boolean;
  session: {
    code: string;
    dynamicName: string;
    ceremonia: string;
    teamName: string | null;
    phase: Phase;
    votesPerUser: number;
    columns: Column[];
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
}

const COL_ACCENT = [
  "border-t-sky-500",
  "border-t-amber-500",
  "border-t-emerald-500",
  "border-t-violet-500",
  "border-t-rose-500",
];

const PHASE_LABEL: Record<Phase, string> = {
  lobby: "Sala de espera",
  brainstorm: "Lluvia de ideas",
  voting: "Votación",
  discuss: "Discusión",
  closed: "Cerrada",
};

const PHASE_ORDER: Phase[] = ["brainstorm", "voting", "discuss", "closed"];

export function Room({ code, defaultName }: { code: string; defaultName?: string }) {
  const [state, setState] = useState<RoomState | null>(null);
  const [notFound, setNotFound] = useState(false);
  const storageKey = `ritualis-room-${code}`;

  const poll = useCallback(async () => {
    const t = localStorage.getItem(storageKey);
    const url = `/api/sessions/${code}${t ? `?t=${t}` : ""}`;
    const res = await fetch(url, { cache: "no-store" });
    if (res.status === 404) {
      setNotFound(true);
      return;
    }
    const data = await res.json();
    setState(data);
  }, [code, storageKey]);

  // Polling del estado de la sala (suscripción a sistema externo).
  // El setState dentro de poll() ocurre tras el await, no es sincrónico.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    poll();
    const id = setInterval(poll, 1300);
    return () => clearInterval(id);
  }, [poll]);

  const op = useCallback(
    async (payload: Record<string, unknown>) => {
      const t = localStorage.getItem(storageKey);
      const res = await fetch(`/api/sessions/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, token: t }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Error");
        return null;
      }
      if (data.session) setState(data);
      return data;
    },
    [code, storageKey],
  );

  async function join(name: string) {
    const res = await fetch(`/api/sessions/${code}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op: "join", name }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "No se pudo entrar");
      return;
    }
    localStorage.setItem(storageKey, data.token);
    await poll();
  }

  if (notFound) {
    return (
      <Centered>
        <p className="text-muted-foreground">Esta sala no existe o fue cerrada.</p>
      </Centered>
    );
  }

  if (!state) {
    return (
      <Centered>
        <p className="text-muted-foreground">Cargando sala…</p>
      </Centered>
    );
  }

  if (!state.authenticated) {
    return (
      <JoinScreen
        dynamicName={state.session.dynamicName}
        defaultName={defaultName}
        onJoin={join}
      />
    );
  }

  return <Board state={state} op={op} code={code} />;
}

/* ───────────── Ingreso ───────────── */
function JoinScreen({
  dynamicName,
  defaultName,
  onJoin,
}: {
  dynamicName: string;
  defaultName?: string;
  onJoin: (name: string) => void;
}) {
  const [name, setName] = useState(defaultName ?? "");
  const [busy, setBusy] = useState(false);
  return (
    <Centered>
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-xl">
        <RitualisMark className="mx-auto mb-3 h-12 w-12 text-primary" />
        <h1 className="text-center text-xl font-bold">{dynamicName}</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Entrá a la sesión en vivo
        </p>
        <div className="mt-5 space-y-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            onKeyDown={(e) => e.key === "Enter" && name.trim() && onJoin(name.trim())}
            autoFocus
          />
          <Button
            className="w-full"
            disabled={!name.trim() || busy}
            onClick={async () => {
              setBusy(true);
              await onJoin(name.trim());
              setBusy(false);
            }}
          >
            Entrar
          </Button>
        </div>
      </div>
    </Centered>
  );
}

/* ───────────── Tablero ───────────── */
function Board({
  state,
  op,
  code,
}: {
  state: RoomState;
  op: (p: Record<string, unknown>) => Promise<RoomState | null>;
  code: string;
}) {
  const { session, me, participants, cards, actions } = state;
  const phase = session.phase;
  const isFac = me?.isFacilitator ?? false;

  const online = participants.filter((p) => p.online);

  function copyLink() {
    const url = `${window.location.origin}/s/${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          <RitualisMark className="h-7 w-7 shrink-0 text-primary" />
          <div className="min-w-0">
            <h1 className="truncate font-semibold leading-tight">{session.dynamicName}</h1>
            <p className="text-xs text-muted-foreground">
              {session.teamName ? `${session.teamName} · ` : ""}Sala {session.code}
            </p>
          </div>

          <Badge variant="secondary" className="ml-1">
            {PHASE_LABEL[phase]}
          </Badge>

          <div className="flex-1" />

          <Timer session={session} isFac={isFac} op={op} />

          {/* Presencia */}
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {online.slice(0, 6).map((p) => (
                <span
                  key={p.id}
                  title={p.name + (p.isFacilitator ? " (facilitador)" : "")}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[11px] font-semibold text-white"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name.slice(0, 2).toUpperCase()}
                </span>
              ))}
            </div>
            {online.length > 6 && (
              <span className="text-xs text-muted-foreground">+{online.length - 6}</span>
            )}
          </div>

          <Button variant="outline" size="sm" className="gap-1" onClick={copyLink}>
            <Copy className="h-4 w-4" /> Invitar
          </Button>
          <ThemeToggle />
        </div>

        {/* Controles de fase (facilitador) */}
        {isFac && (
          <div className="flex flex-wrap items-center gap-2 border-t px-4 py-2">
            <span className="text-xs font-medium text-muted-foreground">Fase:</span>
            {PHASE_ORDER.map((p) => (
              <Button
                key={p}
                size="sm"
                variant={phase === p ? "default" : "outline"}
                onClick={() => op({ op: "setPhase", phase: p })}
              >
                {PHASE_LABEL[p]}
              </Button>
            ))}
          </div>
        )}
      </header>

      {/* Contexto por fase */}
      <div className="border-b bg-muted/40 px-4 py-2 text-center text-sm text-muted-foreground">
        {phase === "brainstorm" && "Agregá tus tarjetas. Todos ven lo que escribís."}
        {phase === "voting" &&
          `Votá lo más importante · te quedan ${me?.votesLeft ?? 0} de ${session.votesPerUser} votos`}
        {phase === "discuss" && "Discutan lo más votado y registren acciones."}
        {phase === "closed" && "Sesión cerrada. Quedó el resumen y las acciones."}
      </div>

      {/* Columnas */}
      <main className="flex-1 overflow-x-auto p-4">
        <div
          className="flex gap-4"
          style={{ minWidth: `${session.columns.length * 17}rem` }}
        >
          {session.columns.map((col, i) => (
            <ColumnView
              key={col.key}
              column={col}
              accent={COL_ACCENT[i % COL_ACCENT.length]}
              cards={cards.filter((c) => c.column === col.key)}
              phase={phase}
              isFac={isFac}
              op={op}
            />
          ))}
        </div>
      </main>

      {/* Acciones */}
      {(phase === "discuss" || phase === "closed" || actions.length > 0) && (
        <ActionsPanel actions={actions} phase={phase} isFac={isFac} op={op} />
      )}
    </div>
  );
}

/* ───────────── Columna ───────────── */
function ColumnView({
  column,
  accent,
  cards,
  phase,
  isFac,
  op,
}: {
  column: Column;
  accent: string;
  cards: RoomState["cards"];
  phase: Phase;
  isFac: boolean;
  op: (p: Record<string, unknown>) => Promise<RoomState | null>;
}) {
  const [text, setText] = useState("");
  const canAdd = phase === "brainstorm" || isFac;
  const sorted =
    phase === "discuss" || phase === "closed"
      ? [...cards].sort((a, b) => b.voteCount - a.voteCount)
      : cards;

  async function add() {
    if (!text.trim()) return;
    await op({ op: "addCard", column: column.key, text: text.trim() });
    setText("");
  }

  return (
    <div className={`flex w-64 shrink-0 flex-col rounded-xl border border-t-4 bg-card/60 ${accent}`}>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <h2 className="flex items-center gap-1.5 font-semibold">
          <ColumnIcon emoji={column.emoji} className="h-4 w-4 opacity-80" />
          {column.label}
        </h2>
        <Badge variant="secondary" className="text-[11px]">
          {cards.length}
        </Badge>
      </div>

      <div className="flex-1 space-y-2 px-2 pb-2">
        {sorted.map((c) => (
          <CardView key={c.id} card={c} phase={phase} isFac={isFac} op={op} />
        ))}
      </div>

      {canAdd && (
        <div className="border-t p-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribí una idea…"
            rows={2}
            className="resize-none text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                add();
              }
            }}
          />
          <Button size="sm" className="mt-2 w-full gap-1" onClick={add} disabled={!text.trim()}>
            <Plus className="h-4 w-4" /> Agregar
          </Button>
        </div>
      )}
    </div>
  );
}

/* ───────────── Tarjeta ───────────── */
function CardView({
  card,
  phase,
  isFac,
  op,
}: {
  card: RoomState["cards"][number];
  phase: Phase;
  isFac: boolean;
  op: (p: Record<string, unknown>) => Promise<RoomState | null>;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(card.text);
  const canEdit = (card.isMine || isFac) && phase !== "closed";
  const canVote = phase === "voting";

  return (
    <div className="group rounded-lg border bg-background p-2.5 shadow-sm">
      {editing ? (
        <div className="space-y-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            className="resize-none text-sm"
            autoFocus
          />
          <div className="flex justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => {
                setText(card.text);
                setEditing(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="h-7 w-7"
              onClick={async () => {
                await op({ op: "editCard", cardId: card.id, text });
                setEditing(false);
              }}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="whitespace-pre-wrap text-sm">{card.text}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">{card.authorName}</span>
            <div className="flex items-center gap-1">
              {(card.voteCount > 0 || canVote) && (
                <button
                  disabled={!canVote}
                  onClick={() => op({ op: "vote", cardId: card.id })}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition ${
                    card.votedByMe
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  } ${!canVote && "cursor-default opacity-90"}`}
                >
                  <ThumbsUp className="h-3 w-3" /> {card.voteCount}
                </button>
              )}
              {canEdit && (
                <div className="flex opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => setEditing(true)}
                    className="rounded p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => op({ op: "deleteCard", cardId: card.id })}
                    className="rounded p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ───────────── Timer ───────────── */
function Timer({
  session,
  isFac,
  op,
}: {
  session: RoomState["session"];
  isFac: boolean;
  op: (p: Record<string, unknown>) => Promise<RoomState | null>;
}) {
  const { timer } = session;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  let remaining = 0;
  if (timer.running && timer.endsAt) {
    remaining = Math.max(0, Math.round((Date.parse(timer.endsAt) - now) / 1000));
  } else if (timer.remainingSec) {
    remaining = timer.remainingSec;
  }
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const active = timer.running || (timer.remainingSec ?? 0) > 0;

  return (
    <div className="flex items-center gap-1.5">
      <Clock className={`h-4 w-4 ${remaining === 0 && timer.running ? "text-destructive" : "text-muted-foreground"}`} />
      <span className="font-mono text-sm tabular-nums">
        {active ? `${mm}:${ss}` : "—"}
      </span>
      {isFac && (
        <div className="flex items-center gap-0.5">
          {!timer.running ? (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() =>
                op({ op: "setTimer", action: "start", minutes: active ? 0 : 5 })
              }
              title={active ? "Reanudar" : "Iniciar 5 min"}
            >
              <Play className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => op({ op: "setTimer", action: "pause" })}
              title="Pausar"
            >
              <Pause className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => op({ op: "setTimer", action: "reset" })}
            title="Reiniciar"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

/* ───────────── Panel de acciones ───────────── */
function ActionsPanel({
  actions,
  phase,
  isFac,
  op,
}: {
  actions: RoomState["actions"];
  phase: Phase;
  isFac: boolean;
  op: (p: Record<string, unknown>) => Promise<RoomState | null>;
}) {
  const [text, setText] = useState("");
  return (
    <div className="border-t bg-card/70 p-4">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-2 flex items-center gap-2 font-semibold">
          <ListChecks className="h-4 w-4 text-primary" /> Acciones acordadas
        </h2>
        <div className="space-y-2">
          {actions.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-2 rounded-lg border bg-background p-2.5"
            >
              <button
                onClick={() => op({ op: "toggleAction", actionId: a.id })}
                className={`flex h-5 w-5 items-center justify-center rounded border ${
                  a.done ? "border-primary bg-primary text-primary-foreground" : ""
                }`}
              >
                {a.done && <Check className="h-3.5 w-3.5" />}
              </button>
              <span className={`flex-1 text-sm ${a.done ? "text-muted-foreground line-through" : ""}`}>
                {a.text}
              </span>
              {isFac && (
                <button
                  onClick={() => op({ op: "deleteAction", actionId: a.id })}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          {actions.length === 0 && (
            <p className="text-sm text-muted-foreground">Todavía no hay acciones.</p>
          )}
        </div>
        {phase !== "closed" && (
          <div className="mt-3 flex gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nueva acción (con responsable y fecha)…"
              onKeyDown={async (e) => {
                if (e.key === "Enter" && text.trim()) {
                  await op({ op: "addAction", text: text.trim() });
                  setText("");
                }
              }}
            />
            <Button
              className="gap-1"
              disabled={!text.trim()}
              onClick={async () => {
                await op({ op: "addAction", text: text.trim() });
                setText("");
              }}
            >
              <Plus className="h-4 w-4" /> Sumar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">{children}</div>
  );
}
