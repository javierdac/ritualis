import {
  Gauge,
  TrendingUp,
  Target,
  Timer,
  Hourglass,
  Ban,
  Bug,
  TrafficCone,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { MetricStatus, MetricsSnapshot } from "@/lib/integrations/types";

const STATUS_DOT: Record<MetricStatus, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-rose-500",
};

function StatusDot({ status }: { status: MetricStatus }) {
  return (
    <span
      className={cn("inline-block h-3 w-3 rounded-full", STATUS_DOT[status])}
      aria-label={status}
    />
  );
}

/** Barra horizontal proporcional. value/max define el ancho. */
function Bar({
  value,
  max,
  className,
}: {
  value: number;
  max: number;
  className?: string;
}) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
      <div
        className={cn("h-full rounded-full bg-primary", className)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="surface">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" /> {title}
        </CardTitle>
        {hint && <CardDescription>{hint}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function MetricsDashboard({ snapshot }: { snapshot: MetricsSnapshot }) {
  const { summary, velocity, predictability, cycleTime, aging, blockers, quality, retro } =
    snapshot;

  const velMax = Math.max(...velocity.map((v) => v.value), 1);
  const predMax = Math.max(
    ...predictability.points.flatMap((p) => [p.committed, p.completed]),
    1,
  );
  const cycleMax = Math.max(...cycleTime.items.map((i) => i.days), 1);
  const agingMax = Math.max(...aging.items.map((i) => i.days), 1);
  const blockMax = Math.max(...blockers.map((b) => b.count), 1);
  const qualMax = Math.max(...quality.flatMap((q) => [q.qa, q.prod]), 1);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Resumen ejecutivo */}
      <Section
        icon={Gauge}
        title="Resumen ejecutivo"
        hint="Foto rápida del estado del equipo."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Métrica</TableHead>
              <TableHead className="text-center">Sprint actual</TableHead>
              <TableHead className="text-center">Prom. 6 sprints</TableHead>
              <TableHead className="text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary.map((r) => (
              <TableRow key={r.label}>
                <TableCell className="font-medium">{r.label}</TableCell>
                <TableCell className="text-center tabular-nums">{r.current}</TableCell>
                <TableCell className="text-center tabular-nums text-muted-foreground">
                  {r.average}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <StatusDot status={r.status} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      {/* Tendencia de velocity */}
      <Section
        icon={TrendingUp}
        title="Tendencia de velocity"
        hint="Buscá estabilidad, no necesariamente crecimiento."
      >
        <div className="space-y-3">
          {velocity.map((v, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="w-24 shrink-0 truncate text-sm text-muted-foreground"
                title={v.sprint}
              >
                {v.sprint}
              </span>
              <Bar value={v.value} max={velMax} />
              <span className="w-12 text-right text-sm tabular-nums">{v.value}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Predictibilidad */}
      <Section
        icon={Target}
        title="Predictibilidad"
        hint="Terminado / Comprometido — objetivo: arriba del 80%."
      >
        <div className="space-y-4">
          {predictability.points.map((p, i) => {
            const ratio = p.committed > 0 ? p.completed / p.committed : 0;
            const ok = ratio >= predictability.target;
            return (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate text-muted-foreground" title={p.sprint}>
                    {p.sprint}
                  </span>
                  <span
                    className={cn(
                      "font-medium tabular-nums",
                      ok ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
                    )}
                  >
                    {Math.round(ratio * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 text-xs text-muted-foreground">Comprometido</span>
                  <Bar value={p.committed} max={predMax} className="bg-sky-500" />
                  <span className="w-8 text-right text-xs tabular-nums">{p.committed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 text-xs text-muted-foreground">Terminado</span>
                  <Bar value={p.completed} max={predMax} className="bg-emerald-500" />
                  <span className="w-8 text-right text-xs tabular-nums">{p.completed}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Flow: cycle time + aging */}
      <Section
        icon={Timer}
        title="Cycle time por historia"
        hint={`Outliers > 2× el promedio (${cycleTime.avg.toFixed(1)} días).`}
      >
        <div className="space-y-3">
          {cycleTime.items.map((i) => (
            <div key={i.id} className="flex items-center gap-3">
              <span className="w-16 text-sm text-muted-foreground">{i.id}</span>
              <Bar value={i.days} max={cycleMax} className={i.outlier ? "bg-rose-500" : undefined} />
              <span className="flex w-16 items-center justify-end gap-1 text-sm tabular-nums">
                {i.days}d
                {i.outlier && <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        icon={Hourglass}
        title="Aging work"
        hint={`Días en progreso. Investigar si supera ${aging.threshold.toFixed(1)} días.`}
      >
        <div className="space-y-3">
          {aging.items.map((i) => (
            <div key={i.id} className="flex items-center gap-3">
              <span className="w-16 text-sm text-muted-foreground">{i.id}</span>
              <Bar value={i.days} max={agingMax} className={i.outlier ? "bg-rose-500" : undefined} />
              <span className="flex w-16 items-center justify-end gap-1 text-sm tabular-nums">
                {i.days}d
                {i.outlier && <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Bloqueos */}
      <Section
        icon={Ban}
        title="Bloqueos"
        hint="Acá suele aparecer el trabajo real del Scrum Master."
      >
        {blockers.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin bloqueos marcados. 🎉</p>
        ) : (
          <div className="space-y-3">
            {blockers.map((b) => (
              <div key={b.reason} className="flex items-center gap-3">
                <span className="w-40 truncate text-sm text-muted-foreground">{b.reason}</span>
                <Bar value={b.count} max={blockMax} className="bg-orange-500" />
                <span className="w-8 text-right text-sm tabular-nums">{b.count}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Calidad */}
      <Section
        icon={Bug}
        title="Calidad — bugs por sprint"
        hint="Lo importante: que los bugs de producción no crezcan."
      >
        <div className="space-y-4">
          {quality.map((q) => (
            <div key={q.sprint} className="space-y-1.5">
              <span className="text-sm text-muted-foreground">{q.sprint}</span>
              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-muted-foreground">QA</span>
                <Bar value={q.qa} max={qualMax} className="bg-violet-500" />
                <span className="w-8 text-right text-xs tabular-nums">{q.qa}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-muted-foreground">Producción</span>
                <Bar value={q.prod} max={qualMax} className="bg-rose-500" />
                <span className="w-8 text-right text-xs tabular-nums">{q.prod}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Semáforo para la retro */}
      <Section
        icon={TrafficCone}
        title="Semáforo para la retro"
        hint="Mostralo al inicio de cada retrospectiva."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {retro.map((r) => (
            <div
              key={r.area}
              className="flex items-center gap-2.5 rounded-xl border bg-card px-3 py-2.5"
            >
              <StatusDot status={r.status} />
              <span className="text-sm font-medium">{r.area}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
