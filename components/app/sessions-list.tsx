"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Radio, Users, StickyNote, ExternalLink, Square } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { closeSession } from "@/lib/actions/sessions";

type SessionRow = {
  code: string;
  dynamicName: string;
  ceremonia: string;
  teamName: string | null;
  phase: string;
  participants: number;
  cards: number;
  createdAt: string;
};

const PHASE_LABEL: Record<string, string> = {
  lobby: "Espera",
  brainstorm: "Ideas",
  voting: "Votación",
  discuss: "Discusión",
  closed: "Cerrada",
};

export function SessionsList({ sessions }: { sessions: SessionRow[] }) {
  const [pending, start] = useTransition();

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
        <Radio className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">
          Todavía no iniciaste ninguna sesión en vivo.
        </p>
        <Button asChild variant="outline">
          <Link href="/app/dinamicas">Elegí una dinámica</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {sessions.map((s) => {
        const closed = s.phase === "closed";
        return (
          <Card key={s.code} className="flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{s.dynamicName}</h3>
                <p className="text-xs text-muted-foreground">
                  {s.teamName ? `${s.teamName} · ` : ""}Sala {s.code}
                </p>
              </div>
              <Badge variant={closed ? "outline" : "default"}>
                {PHASE_LABEL[s.phase] ?? s.phase}
              </Badge>
            </div>

            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Users className="h-4 w-4" /> {s.participants}
              </span>
              <span className="inline-flex items-center gap-1">
                <StickyNote className="h-4 w-4" /> {s.cards}
              </span>
            </div>

            <div className="mt-auto flex gap-2">
              <Button asChild size="sm" className="flex-1 gap-1">
                <Link href={`/s/${s.code}`}>
                  <ExternalLink className="h-4 w-4" /> Abrir sala
                </Link>
              </Button>
              {!closed && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  disabled={pending}
                  onClick={() =>
                    start(async () => {
                      await closeSession(s.code);
                      toast.success("Sesión cerrada");
                    })
                  }
                >
                  <Square className="h-4 w-4" /> Cerrar
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
