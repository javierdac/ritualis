"use client";

import { useState } from "react";
import { Plus, Trash2, Check, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { OpFn, Phase, RoomState } from "./types";

export function ActionsPanel({
  actions,
  phase,
  isFac,
  op,
}: {
  actions: RoomState["actions"];
  phase: Phase;
  isFac: boolean;
  op: OpFn;
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
