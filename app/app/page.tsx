import Link from "next/link";
import {
  FolderKanban,
  Users,
  UserRound,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { requireUser } from "@/lib/session";
import { getCounts } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { CEREMONIA_LABEL, type Ceremonia } from "@/lib/types";
import { CeremoniaIcon } from "@/lib/icons";
import { CEREMONIA_STYLE } from "@/lib/ceremonia-style";

const CEREMONIAS: Ceremonia[] = ["daily", "planning", "review", "retro", "refinement"];

const CEREMONIA_DESC: Record<Ceremonia, string> = {
  daily: "Sincronización diaria del equipo.",
  planning: "Planificación del próximo sprint.",
  review: "Demo y feedback de lo construido.",
  retro: "Inspeccionar y mejorar el proceso.",
  refinement: "Refinar y estimar el backlog.",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const isAdmin = user.role === "admin";
  const counts = await getCounts(user.id, isAdmin);

  const stats = [
    {
      label: "Proyectos",
      value: counts.projects,
      href: "/app/proyectos",
      icon: FolderKanban,
      chip: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    },
    {
      label: "Equipos",
      value: counts.teams,
      href: "/app/equipos",
      icon: Users,
      chip: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    },
    {
      label: "Personas",
      value: counts.people,
      href: "/app/personas",
      icon: UserRound,
      chip: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Dinámicas",
      value: counts.dynamics,
      href: "/app/dinamicas",
      icon: Sparkles,
      chip: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 via-card to-accent/10 p-8 shadow-sm">
        <div className="dotgrid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative">
          <p className="text-sm font-medium text-primary">Bienvenido a Ritualis</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Hola, {user.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-2 max-w-lg text-muted-foreground">
            Facilitá cualquier ceremonia Scrum con dinámicas a medida, timer y
            seguimiento de tu equipo.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/app/ceremonias"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition hover:scale-[1.03] active:scale-95"
            >
              Empezar una ceremonia <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/app/dinamicas"
              className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-background"
            >
              <Sparkles className="h-4 w-4" /> Ver dinámicas
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="lift surface h-full border-border/70 p-5">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.chip}`}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-3xl font-bold tabular-nums leading-none">
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Ceremonias */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ceremonias</h2>
          <Link
            href="/app/ceremonias"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CEREMONIAS.map((c) => {
            const st = CEREMONIA_STYLE[c];
            return (
              <Link key={c} href={`/app/ceremonias/${c}`} className="group">
                <Card
                  className={`lift relative h-full overflow-hidden border-border/70 p-5 shadow-sm ${st.glow}`}
                >
                  <div
                    className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${st.gradient} blur-2xl`}
                  />
                  <div className="relative">
                    <div
                      className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${st.chip}`}
                    >
                      <CeremoniaIcon ceremonia={c} className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{CEREMONIA_LABEL[c]}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {CEREMONIA_DESC[c]}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
