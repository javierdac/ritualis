import Link from "next/link";
import { BarChart3, Info } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getProjectOptions, getProjectMetrics, getIntegration } from "@/lib/data";
import { MetricsDashboard } from "@/components/app/metrics-dashboard";
import { MetricsToolbar } from "@/components/app/metrics-toolbar";

const SOURCE_LABEL = { sample: "Datos de ejemplo", live: "En vivo" } as const;
const PROVIDER_LABEL = {
  sample: "ejemplo",
  jira: "Jira",
  azure: "Azure DevOps",
  github: "GitHub",
} as const;

export default async function MetricasPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const user = await requireUser();
  const isAdmin = user.role === "admin";
  const projects = await getProjectOptions(user.id, isAdmin);

  if (projects.length === 0) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Métricas</h1>
          <p className="text-muted-foreground">
            Indicadores de delivery, flujo y calidad por proyecto.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <BarChart3 className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Creá un proyecto para ver sus métricas.</p>
          <Link
            href="/app/proyectos"
            className="rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Ir a Proyectos
          </Link>
        </div>
      </div>
    );
  }

  const { project } = await searchParams;
  const selectedProjectId =
    project && projects.some((p) => p._id === project) ? project : projects[0]._id;

  const [snapshot, integration] = await Promise.all([
    getProjectMetrics(user.id, selectedProjectId, isAdmin),
    getIntegration(user.id, selectedProjectId),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Métricas</h1>
          <p className="text-muted-foreground">
            Indicadores de delivery, flujo y calidad por proyecto.
          </p>
        </div>
        <MetricsToolbar
          key={selectedProjectId}
          projects={projects}
          selectedProjectId={selectedProjectId}
          integration={integration}
        />
      </div>

      {snapshot && (
        <>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-2.5 py-1 font-medium">
              {SOURCE_LABEL[snapshot.meta.source]} · {PROVIDER_LABEL[snapshot.meta.provider]}
            </span>
            <span>
              Actualizado{" "}
              {new Date(snapshot.meta.generatedAt).toLocaleString("es-AR", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>

          {snapshot.meta.note && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{snapshot.meta.note}</span>
            </div>
          )}

          <MetricsDashboard snapshot={snapshot} />
        </>
      )}
    </div>
  );
}
