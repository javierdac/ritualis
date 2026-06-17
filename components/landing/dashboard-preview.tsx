import { FolderKanban, Users, UserRound } from "lucide-react";
import { BrowserFrame } from "@/components/landing/browser-frame";
import { RitualisMark } from "@/components/brand/ritualis-mark";
import { CeremoniaIcon } from "@/lib/icons";
import { CEREMONIA_STYLE } from "@/lib/ceremonia-style";
import { CEREMONIA_LABEL, type Ceremonia } from "@/lib/types";

const CEREMONIAS: Ceremonia[] = [
  "daily",
  "planning",
  "review",
  "retro",
  "refinement",
];

const STATS = [
  { label: "Proyectos", value: "6", icon: FolderKanban },
  { label: "Equipos", value: "11", icon: Users },
  { label: "Personas", value: "48", icon: UserRound },
];

/** Mockup decorativo del panel de Ritualis (no es una captura real). */
export function DashboardPreview({ className }: { className?: string }) {
  return (
    <BrowserFrame url="ritualis.app/app" className={className}>
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-44 shrink-0 flex-col gap-1 border-r border-border/60 bg-sidebar/60 p-3 sm:flex">
          <div className="mb-3 flex items-center gap-2 px-1">
            <RitualisMark className="h-5 w-5 text-primary" />
            <span className="font-brand text-sm tracking-[0.18em]">
              RITUALIS
            </span>
          </div>
          <div className="rounded-md bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary">
            Panel
          </div>
          {["Ceremonias", "Dinámicas", "Proyectos", "Equipos", "Personas"].map(
            (item) => (
              <div
                key={item}
                className="px-2.5 py-1.5 text-xs text-muted-foreground"
              >
                {item}
              </div>
            ),
          )}
        </aside>

        {/* Main */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="text-sm font-semibold sm:text-base">
                Hola, Javier 👋
              </div>
              <div className="text-[11px] text-muted-foreground">
                Tus ceremonias de esta semana
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="surface rounded-lg border border-border/60 p-2.5"
              >
                <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <div className="mt-1.5 text-lg font-bold leading-none sm:text-xl">
                  {s.value}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Ceremony chips */}
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {CEREMONIAS.map((c) => {
              const st = CEREMONIA_STYLE[c];
              return (
                <div
                  key={c}
                  className="surface relative overflow-hidden rounded-lg border border-border/60 p-2.5"
                >
                  <div className={`absolute inset-x-0 top-0 h-0.5 ${st.bar}`} />
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${st.chip}`}
                  >
                    <CeremoniaIcon ceremonia={c} className="h-3.5 w-3.5" />
                  </div>
                  <div className="mt-1.5 text-xs font-medium">
                    {CEREMONIA_LABEL[c]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
