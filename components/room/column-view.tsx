"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ColumnIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CardView } from "./card-view";
import type { Column, OpFn, Phase, RoomState } from "./types";

export function ColumnView({
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
  op: OpFn;
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
