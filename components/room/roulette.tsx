"use client";

import { Check, Dices, RotateCcw, Shuffle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomHeader } from "./room-header";
import { ActionsPanel } from "./actions-panel";
import { AddPerson } from "./add-person";
import type { OpFn, RoomState } from "./types";

const SPIN_MS = 3000;
const TURNS = 4; // vueltas completas por giro

/** Sala en modo ruleta: una rueda con los participantes para sortear turnos. */
export function Roulette({
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
  const pending = participants.filter(
    (p) => p.online && !done.has(p.id) && p.id !== wheel.currentId,
  );

  // La rotación se deriva del estado del servidor, así todos los clientes ven
  // el mismo resultado: cada giro suma TURNS vueltas y aterriza en el elegido.
  const n = participants.length;
  const seg = n > 0 ? 360 / n : 360;
  const currentIdx = current ? participants.findIndex((p) => p.id === current.id) : -1;
  const rotation =
    currentIdx >= 0
      ? (done.size + 1) * TURNS * 360 + (360 - (currentIdx * seg + seg / 2))
      : 0;

  // Mientras la animación CSS corre, ocultamos el resultado. serverNow llega
  // con cada poll (~1.3s), así el nombre se revela solo al asentarse la rueda
  // y todos los clientes comparan contra el mismo reloj.
  const spinning =
    !!wheel.spunAt &&
    Date.parse(session.serverNow) - Date.parse(wheel.spunAt) < SPIN_MS + 1500;

  const roundDone = pending.length === 0 && (current !== null || done.size > 0);

  return (
    <div className="flex min-h-screen flex-col">
      <RoomHeader state={state} op={op} code={code} badge="Ruleta de turnos" />

      <div className="border-b bg-muted/40 px-4 py-2 text-center text-sm text-muted-foreground">
        {closed
          ? "Sesión cerrada. Quedó el resumen y las acciones."
          : "La ruleta sortea quién habla. Compartí el link para que se sumen invitados."}
      </div>

      <main className="flex flex-1 flex-wrap items-center justify-center gap-10 p-6">
        {/* Rueda */}
        <div className="relative">
          {/* Puntero */}
          <div className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 text-2xl leading-none">
            ▼
          </div>
          <div
            className="h-72 w-72 sm:h-80 sm:w-80"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.8, 0.16, 1)`,
            }}
          >
            <Wheel participants={participants} doneIds={done} />
          </div>
        </div>

        {/* Panel lateral */}
        <div className="w-full max-w-xs space-y-4">
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Turno de
            </p>
            {spinning ? (
              <p className="mt-1 animate-pulse text-2xl font-bold">Girando…</p>
            ) : current ? (
              <p className="mt-1 text-2xl font-bold" style={{ color: current.color }}>
                {current.name}
              </p>
            ) : (
              <p className="mt-1 text-lg text-muted-foreground">
                {roundDone ? "¡Ronda completa! 🎉" : "Girá la ruleta"}
              </p>
            )}
            {!spinning && roundDone && current && (
              <p className="mt-1 text-sm text-muted-foreground">
                Es el último turno de la ronda 🎉
              </p>
            )}
          </div>

          {isFac && !closed && (
            <div className="flex gap-2">
              <Button
                className="flex-1 gap-2"
                disabled={spinning || pending.length === 0}
                onClick={() => op({ op: "spin" })}
              >
                <Dices className="h-4 w-4" />
                {current ? "Siguiente" : "Girar"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                title="Sortear todo el orden de una vez"
                disabled={spinning || pending.length < 2}
                onClick={() => op({ op: "shuffle" })}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                title="Reiniciar la ronda"
                disabled={spinning || (done.size === 0 && !current)}
                onClick={() => op({ op: "wheelReset" })}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}

          {isFac && !closed && <AddPerson op={op} />}

          {/* Lista de participantes */}
          <ul className="space-y-1.5">
            {participants.map((p) => {
              const spoke = done.has(p.id);
              const isCurrent = p.id === wheel.currentId && !spinning;
              const queuePos = wheel.queueIds.indexOf(p.id);
              return (
                <li
                  key={p.id}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${
                    isCurrent ? "border-primary bg-primary/5 font-semibold" : ""
                  } ${spoke ? "opacity-50" : ""}`}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="flex-1 truncate">
                    {p.name}
                    {p.isManual ? (
                      <span className="text-xs text-muted-foreground"> · sin conectar</span>
                    ) : (
                      p.isGuest && (
                        <span className="text-xs text-muted-foreground"> · invitado</span>
                      )
                    )}
                  </span>
                  {!p.online && (
                    <span className="text-xs text-muted-foreground">ausente</span>
                  )}
                  {!spoke && !isCurrent && queuePos >= 0 && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {queuePos + 1}º
                    </span>
                  )}
                  {spoke && <Check className="h-4 w-4 text-primary" />}
                  {isFac && p.isManual && !closed && (
                    <button
                      title="Sacar de la ronda"
                      onClick={() => op({ op: "removePerson", participantId: p.id })}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </main>

      {/* Acciones / parking lot de la daily */}
      <ActionsPanel actions={actions} phase={session.phase} isFac={isFac} op={op} />
    </div>
  );
}

/** Rueda SVG: un gajo por participante, con su color y nombre. */
function Wheel({
  participants,
  doneIds,
}: {
  participants: RoomState["participants"];
  doneIds: Set<string>;
}) {
  const n = participants.length;
  const C = 100;
  const R = 96;

  if (n === 0) return null;

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-md">
      {n === 1 ? (
        <circle cx={C} cy={C} r={R} fill={participants[0].color} />
      ) : (
        participants.map((p, i) => {
          const a0 = (i * 360) / n;
          const a1 = ((i + 1) * 360) / n;
          return (
            <path
              key={p.id}
              d={slicePath(C, C, R, a0, a1)}
              fill={p.color}
              opacity={doneIds.has(p.id) ? 0.25 : 1}
              className="stroke-background"
              strokeWidth={2}
            />
          );
        })
      )}
      {participants.map((p, i) => {
        const mid = ((i + 0.5) * 360) / n;
        const pos = polar(C, C, R * 0.62, mid);
        return (
          <text
            key={p.id}
            x={pos.x}
            y={pos.y}
            transform={`rotate(${mid > 180 ? mid + 90 : mid - 90}, ${pos.x}, ${pos.y})`}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            opacity={doneIds.has(p.id) ? 0.5 : 1}
            className="text-[9px] font-semibold"
          >
            {p.name.length > 12 ? `${p.name.slice(0, 11)}…` : p.name}
          </text>
        );
      })}
      <circle cx={C} cy={C} r={14} className="fill-background" />
    </svg>
  );
}

/** Punto sobre la circunferencia: ángulo en grados, 0° arriba, sentido horario. */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

function slicePath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p0 = polar(cx, cy, r, a0);
  const p1 = polar(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y} Z`;
}
