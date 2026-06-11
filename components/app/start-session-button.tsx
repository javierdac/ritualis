"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Radio, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { startSession } from "@/lib/actions/sessions";

export function StartSessionButton({
  dynamicId,
  teams = [],
}: {
  dynamicId: string;
  teams?: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [teamId, setTeamId] = useState<string>("");

  return (
    <div className="space-y-2">
      {teams.length > 0 && (
        <Select value={teamId} onValueChange={setTeamId}>
          <SelectTrigger className="w-full">
            <Users className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Equipo (opcional): precarga la ronda" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin equipo</SelectItem>
            {teams.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Button
        size="lg"
        className="w-full gap-2"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await startSession(
              dynamicId,
              teamId && teamId !== "none" ? { teamId } : undefined,
            );
            if (res.ok && res.code) {
              router.push(`/s/${res.code}`);
            } else {
              toast.error(res.error ?? "No se pudo crear la sala");
            }
          })
        }
      >
        <Radio className="h-5 w-5" />
        {pending ? "Creando sala…" : "Iniciar sesión en vivo"}
      </Button>
    </div>
  );
}
