"use client";

import { Button } from "@/components/ui/button";
import { RoomHeader } from "./room-header";
import { ColumnView } from "./column-view";
import { ActionsPanel } from "./actions-panel";
import { COL_ACCENT, PHASE_LABEL, PHASE_ORDER, type OpFn, type RoomState } from "./types";

export function Board({
  state,
  op,
  code,
}: {
  state: RoomState;
  op: OpFn;
  code: string;
}) {
  const { session, me, cards, actions } = state;
  const phase = session.phase;
  const isFac = me?.isFacilitator ?? false;

  return (
    <div className="flex min-h-screen flex-col">
      <RoomHeader state={state} op={op} code={code} badge={PHASE_LABEL[phase]}>
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
      </RoomHeader>

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
