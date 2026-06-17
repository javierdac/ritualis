import { Radio } from "lucide-react";
import { BrowserFrame } from "@/components/landing/browser-frame";

const COLUMNS = [
  {
    title: "😄 Salió bien",
    accent: "bg-emerald-500",
    tint: "bg-emerald-500/5",
    notes: ["Releases sin rollback", "Pairing en el bug de pagos"],
  },
  {
    title: "😕 A mejorar",
    accent: "bg-amber-500",
    tint: "bg-amber-500/5",
    notes: ["Dailies muy largos", "QA llega tarde al sprint"],
  },
  {
    title: "🚀 Probar",
    accent: "bg-sky-500",
    tint: "bg-sky-500/5",
    notes: ["WIP limit de 3", "Demo grabada"],
  },
];

const PEOPLE = [
  { initials: "JD", color: "bg-violet-500" },
  { initials: "MR", color: "bg-emerald-500" },
  { initials: "AL", color: "bg-amber-500" },
  { initials: "SC", color: "bg-sky-500" },
];

/** Mockup decorativo de una sala de sesión en vivo (no es una captura real). */
export function SessionPreview({ className }: { className?: string }) {
  return (
    <BrowserFrame url="ritualis.app/s/4F2K" className={className}>
      <div className="p-4 sm:p-5">
        {/* Header de sala */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
              <Radio className="h-3 w-3 animate-pulse" />
              En vivo
            </span>
            <span className="text-sm font-semibold">Retro · Sprint 24</span>
          </div>
          <div className="flex -space-x-2">
            {PEOPLE.map((p) => (
              <span
                key={p.initials}
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-card text-[9px] font-semibold text-white ${p.color}`}
              >
                {p.initials}
              </span>
            ))}
          </div>
        </div>

        {/* Tablero */}
        <div className="grid grid-cols-3 gap-2.5">
          {COLUMNS.map((col) => (
            <div
              key={col.title}
              className={`rounded-lg border border-border/60 ${col.tint} p-2`}
            >
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium">
                <span className={`h-2 w-2 rounded-full ${col.accent}`} />
                {col.title}
              </div>
              <div className="space-y-1.5">
                {col.notes.map((note) => (
                  <div
                    key={note}
                    className="rounded-md border border-border/50 bg-card px-2 py-1.5 text-[10px] leading-snug shadow-sm"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}
