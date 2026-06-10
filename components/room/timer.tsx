"use client";

import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OpFn, RoomState } from "./types";

export function Timer({
  session,
  isFac,
  op,
}: {
  session: RoomState["session"];
  isFac: boolean;
  op: OpFn;
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
