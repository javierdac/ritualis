import { Gauge } from "lucide-react";
import { BrowserFrame } from "@/components/landing/browser-frame";

const VELOCITY = [
  { sprint: "S20", value: 34 },
  { sprint: "S21", value: 41 },
  { sprint: "S22", value: 38 },
  { sprint: "S23", value: 45 },
  { sprint: "S24", value: 43 },
  { sprint: "S25", value: 48 },
];

const SUMMARY = [
  { label: "Velocidad", status: "bg-emerald-500", value: "48 pts" },
  { label: "Predictibilidad", status: "bg-emerald-500", value: "92%" },
  { label: "Cycle time", status: "bg-amber-500", value: "4.1 d" },
  { label: "Bloqueos", status: "bg-rose-500", value: "3" },
];

const PROVIDERS = ["Jira", "Azure DevOps", "GitHub"];

/** Mockup decorativo del dashboard de métricas (no es una captura real). */
export function MetricsPreview({ className }: { className?: string }) {
  const max = Math.max(...VELOCITY.map((v) => v.value));

  return (
    <BrowserFrame url="ritualis.app/app/metricas" className={className}>
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <Gauge className="h-4 w-4 text-primary" /> Métricas
          </div>
          <div className="flex gap-1.5">
            {PROVIDERS.map((p, i) => (
              <span
                key={p}
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  i === 0
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Velocity chart */}
          <div className="surface rounded-lg border border-border/60 p-3">
            <div className="text-[11px] font-medium">Velocidad por sprint</div>
            <div className="mt-3 flex h-24 items-end justify-between gap-1.5">
              {VELOCITY.map((v) => (
                <div key={v.sprint} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-primary to-accent"
                    style={{ height: `${Math.round((v.value / max) * 100)}%` }}
                  />
                  <span className="text-[8px] text-muted-foreground">
                    {v.sprint}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="surface rounded-lg border border-border/60 p-3">
            <div className="text-[11px] font-medium">Resumen ejecutivo</div>
            <div className="mt-2.5 space-y-2">
              {SUMMARY.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0 last:pb-0"
                >
                  <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className={`h-2 w-2 rounded-full ${s.status}`} />
                    {s.label}
                  </span>
                  <span className="text-[11px] font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
