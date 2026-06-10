"use client";

import { Users, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { RitualisMark } from "@/components/brand/ritualis-mark";
import { Timer } from "./timer";
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
