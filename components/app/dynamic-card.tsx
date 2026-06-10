import Link from "next/link";
import { Clock, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CEREMONIA_LABEL,
  ENERGIA_LABEL,
  type Ceremonia,
} from "@/lib/types";
import { CeremoniaIcon } from "@/lib/icons";
import { CEREMONIA_STYLE } from "@/lib/ceremonia-style";
import type { DynamicDTO } from "@/lib/dto";

export function DynamicCard({ d }: { d: DynamicDTO }) {
  const primary = (d.ceremonias[0] as Ceremonia) ?? "retro";
  const st = CEREMONIA_STYLE[primary];

  return (
    <Link href={`/app/dinamicas/${d._id}`} className="group block h-full">
      <Card
        className={`lift surface relative flex h-full flex-col gap-0 overflow-hidden border-border/70 p-5 shadow-sm ${st.glow}`}
      >
        <div className={`absolute inset-x-0 top-0 h-1 ${st.bar} opacity-80`} />
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {d.ceremonias.map((c) => {
            const cs = CEREMONIA_STYLE[c as Ceremonia];
            return (
              <span
                key={c}
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${cs.badge}`}
              >
                <CeremoniaIcon
                  ceremonia={c as Ceremonia}
                  className="h-3 w-3"
                />
                {CEREMONIA_LABEL[c as keyof typeof CEREMONIA_LABEL]}
              </span>
            );
          })}
          {!d.isSeed && (
            <Badge className="bg-accent text-accent-foreground text-[11px]">
              Propia
            </Badge>
          )}
        </div>

        <h3 className="text-base font-semibold transition group-hover:text-primary">
          {d.nombre}
        </h3>
        <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{d.resumen}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {d.duracionMin} min
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {d.equipoMin}–{d.equipoMax}
          </span>
          <span className="inline-flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" /> {ENERGIA_LABEL[d.energia]}
          </span>
        </div>
      </Card>
    </Link>
  );
}
