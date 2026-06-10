"use client";

import { Check, Dices, Mic, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomHeader } from "./room-header";
import { ActionsPanel } from "./actions-panel";
import type { OpFn, RoomState } from "./types";

/**
 * Sala en modo posta (popcorn): quien tiene el turno elige a quién pasárselo.
 * El facilitador puede arrancar al azar y pasar la posta por cualquiera.
 */
export function Posta({
  state,
  op,
  code,
}: {
  state: RoomState;
  op: OpFn;
  code: string;
}) {
  const { session, me, participants, actions, wheel } = state;
  const isFac = me?.isFacilitator ?? false;
  const closed = session.phase === "closed";

  const done = new Set(wheel.doneIds);
  const current = participants.find((p) => p.id === wheel.currentId) ?? null;
  const holds = me !== null && me.id === wheel.currentId;
  const canPass = (holds || isFac) && !closed;
  const pending = participants.filter(
    (p) => p.online && !done.has(p.id) && p.id !== wheel.currentId,
  );
  const roundDone = pending.length === 0 && (current !== null || done.size > 0);

  return (
    <div className="flex min-h-screen flex-col">
      <RoomHeader state={state} op={op} code={code} badge="Pasá la posta" />

      <div className="border-b bg-muted/40 px-4 py-2 text-center text-sm text-muted-foreground">
        {closed
          ? "Sesión cerrada. Quedó el resumen y las acciones."
          : holds
            ? "Tenés la posta 🎤 Cuando termines, tocá a quién se la pasás."
            : current
              ? `Habla ${current.name}. Nadie sabe quién sigue: atentos.`
              : "El facilitador arranca la ronda; después la posta la maneja el equipo."}
      </div>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 p-6">
        {/* Quién tiene la posta */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Tiene la posta
          </p>
          {current ? (
            <p className="mt-1 flex items-center justify-center gap-2 text-3xl font-bold">
              <Mic className="h-6 w-6" style={{ color: current.color }} />
              <span style={{ color: current.color }}>{current.name}</span>
            </p>
          ) : (
            <p className="mt-1 text-xl text-muted-foreground">
              {roundDone ? "¡Ronda completa! 🎉" : "Nadie todavía"}
            </p>
          )}
        </div>

        {/* Grilla de participantes */}
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
          {participants.map((p) => {
            const spoke = done.has(p.id);
            const isCurrent = p.id === wheel.currentId;
            const passable =
              canPass && p.online && !spoke && !isCurrent && p.id !== me?.id;
            return (
              <button
                key={p.id}
                disabled={!passable}
                onClick={() => op({ op: "pass", participantId: p.id })}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${
                  isCurrent ? "border-primary bg-primary/5 shadow-sm" : ""
                } ${spoke ? "opacity-40" : ""} ${
                  passable
                    ? "cursor-pointer hover:border-primary hover:bg-primary/5"
                    : "cursor-default"
                }`}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="w-full truncate text-sm font-medium">
                  {p.name}
                  {isCurrent && " 🎤"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {spoke ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3 w-3 text-primary" /> habló
                    </span>
                  ) : !p.online ? (
                    "ausente"
                  ) : isCurrent ? (
                    "hablando"
                  ) : passable ? (
                    "pasarle la posta"
                  ) : (
                    "esperando"
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controles del facilitador */}
        {isFac && !closed && (
          <div className="flex gap-2">
            {!current && pending.length > 0 && (
              <Button className="gap-2" onClick={() => op({ op: "spin" })}>
                <Dices className="h-4 w-4" /> Arrancar al azar
              </Button>
            )}
            <Button
              variant="outline"
              className="gap-2"
              disabled={done.size === 0 && !current}
              onClick={() => op({ op: "wheelReset" })}
            >
              <RotateCcw className="h-4 w-4" /> Reiniciar ronda
            </Button>
          </div>
        )}
      </main>

      {/* Acciones / parking lot de la daily */}
      <ActionsPanel actions={actions} phase={session.phase} isFac={isFac} op={op} />
    </div>
  );
}
