import { Clock, Users, Zap } from "lucide-react";
import { BrowserFrame } from "@/components/landing/browser-frame";
import { CeremoniaIcon } from "@/lib/icons";
import { CEREMONIA_STYLE } from "@/lib/ceremonia-style";
import { CEREMONIA_LABEL, type Ceremonia } from "@/lib/types";

const DINAMICAS: {
  ceremonia: Ceremonia;
  nombre: string;
  resumen: string;
  min: number;
  equipo: string;
  energia: string;
}[] = [
  {
    ceremonia: "retro",
    nombre: "Velero",
    resumen: "Viento, anclas e islas para mapear qué impulsa y qué frena al equipo.",
    min: 30,
    equipo: "3–8",
    energia: "Media",
  },
  {
    ceremonia: "daily",
    nombre: "Walk the board",
    resumen: "Recorré el tablero de derecha a izquierda y enfocá el flujo, no a las personas.",
    min: 10,
    equipo: "2–9",
    energia: "Baja",
  },
  {
    ceremonia: "planning",
    nombre: "Magic estimation",
    resumen: "Estimación silenciosa y rápida ordenando ítems por esfuerzo relativo.",
    min: 25,
    equipo: "3–8",
    energia: "Media",
  },
  {
    ceremonia: "refinement",
    nombre: "Example mapping",
    resumen: "Reglas, ejemplos y preguntas para refinar historias antes de estimar.",
    min: 40,
    equipo: "3–6",
    energia: "Alta",
  },
];

/** Mockup decorativo de la biblioteca de dinámicas (no es una captura real). */
export function DynamicsPreview({ className }: { className?: string }) {
  return (
    <BrowserFrame url="ritualis.app/app/dinamicas" className={className}>
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Dinámicas</div>
          <div className="flex gap-1.5">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              Todas
            </span>
            <span className="rounded-full px-2 py-0.5 text-[10px] text-muted-foreground">
              Retro
            </span>
            <span className="rounded-full px-2 py-0.5 text-[10px] text-muted-foreground">
              Daily
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {DINAMICAS.map((d) => {
            const st = CEREMONIA_STYLE[d.ceremonia];
            return (
              <div
                key={d.nombre}
                className="surface relative overflow-hidden rounded-lg border border-border/60 p-3"
              >
                <div className={`absolute inset-x-0 top-0 h-0.5 ${st.bar} opacity-80`} />
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${st.badge}`}
                >
                  <CeremoniaIcon ceremonia={d.ceremonia} className="h-2.5 w-2.5" />
                  {CEREMONIA_LABEL[d.ceremonia]}
                </span>
                <div className="mt-1.5 text-xs font-semibold">{d.nombre}</div>
                <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-muted-foreground">
                  {d.resumen}
                </p>
                <div className="mt-2.5 flex items-center gap-2.5 border-t border-border/50 pt-2 text-[9px] text-muted-foreground">
                  <span className="inline-flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5" /> {d.min} min
                  </span>
                  <span className="inline-flex items-center gap-0.5">
                    <Users className="h-2.5 w-2.5" /> {d.equipo}
                  </span>
                  <span className="inline-flex items-center gap-0.5">
                    <Zap className="h-2.5 w-2.5" /> {d.energia}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BrowserFrame>
  );
}
