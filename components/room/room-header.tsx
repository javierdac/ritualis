"use client";

import { Users, Copy, Square, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { RitualisMark } from "@/components/brand/ritualis-mark";
import { Timer } from "./timer";
import type { OpFn, RoomState } from "./types";

/** Header común de la sala: marca, título, badge, timer, presencia e invitar. */
export function RoomHeader({
  state,
  op,
  code,
  badge,
  onClose,
  children,
}: {
  state: RoomState;
  op: OpFn;
  code: string;
  badge: string;
  /** Si viene, muestra el botón "Cerrar" (lo pasan ruleta/posta para el facilitador). */
  onClose?: () => void;
  children?: React.ReactNode;
}) {
  const { session, me, participants } = state;
  const isFac = me?.isFacilitator ?? false;
  const online = participants.filter((p) => p.online);
  const router = useRouter();

  function copyLink() {
    const url = `${window.location.origin}/s/${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado");
  }

  // Salir de la sala: el facilitador vuelve a sus sesiones; el invitado, que
  // pudo entrar por link sin acceso a /app, vuelve a la home.
  function leave() {
    router.push(isFac ? "/app/sesiones" : "/");
  }

  return (
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
          {badge}
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
        {onClose && (
          <Button variant="outline" size="sm" className="gap-1" onClick={onClose}>
            <Square className="h-4 w-4" /> Cerrar
          </Button>
        )}
        <Button variant="ghost" size="sm" className="gap-1" onClick={leave}>
          <LogOut className="h-4 w-4" /> Salir
        </Button>
        <ThemeToggle />
      </div>

      {children}
    </header>
  );
}
