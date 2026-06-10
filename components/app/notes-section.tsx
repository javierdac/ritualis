"use client";

import { useState } from "react";
import { Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { addNote, deleteNote } from "@/lib/actions/people";
import type { NoteDTO } from "@/lib/dto";

export function NotesSection({
  personId,
  notes,
}: {
  personId: string;
  notes: NoteDTO[];
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function add() {
    if (!text.trim()) return;
    setSending(true);
    const res = await addNote(personId, text);
    setSending(false);
    if (res.ok) {
      setText("");
      toast.success("Nota agregada");
    } else toast.error(res.error ?? "Error");
  }
  async function remove(id: string) {
    const res = await deleteNote(id, personId);
    if (res.ok) toast.success("Nota borrada");
    else toast.error(res.error ?? "Error");
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribí una nota sobre esta persona (fortalezas, acuerdos, seguimiento 1:1…)"
          rows={3}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") add();
          }}
        />
        <div className="flex justify-end">
          <Button onClick={add} disabled={sending || !text.trim()} className="gap-1">
            <Send className="h-4 w-4" /> {sending ? "Guardando…" : "Agregar nota"}
          </Button>
        </div>
      </div>

      {notes.length === 0 ? (
        <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          Sin notas todavía.
        </p>
      ) : (
        <div className="space-y-3">
          {notes.map((n) => (
            <Card key={n._id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="whitespace-pre-wrap text-sm">{n.text}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-destructive"
                  onClick={() => remove(n._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {n.authorName} ·{" "}
                {new Date(n.createdAt).toLocaleString("es-AR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
