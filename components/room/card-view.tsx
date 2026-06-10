"use client";

import { useState } from "react";
import { ThumbsUp, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { OpFn, Phase, RoomState } from "./types";

export function CardView({
  card,
  phase,
  isFac,
  op,
}: {
  card: RoomState["cards"][number];
  phase: Phase;
  isFac: boolean;
  op: OpFn;
}) {
  const [editing, setEditing] = useState(false);
  // El texto se snapshotea al entrar en edición: el polling puede traer un
  // card.text más nuevo mientras el form está cerrado.
  const [text, setText] = useState("");
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
              onClick={() => setEditing(false)}
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
                    onClick={() => {
                      setText(card.text);
                      setEditing(true);
                    }}
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
