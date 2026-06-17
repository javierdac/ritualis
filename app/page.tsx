import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Layers,
  Radio,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";
import { auth } from "@/auth";
import { LandingHeader } from "@/components/landing/landing-header";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { SessionPreview } from "@/components/landing/session-preview";
import { DynamicsPreview } from "@/components/landing/dynamics-preview";
import { MetricsPreview } from "@/components/landing/metrics-preview";
import { RealShots } from "@/components/landing/real-shots";
import { RitualisMark } from "@/components/brand/ritualis-mark";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const CEREMONIA_DESC: Record<Ceremonia, string> = {
  daily: "Sincronización corta y diaria. Foco en el flujo y los bloqueos.",
  planning: "Definir el objetivo y el alcance del próximo sprint.",
  review: "Mostrar lo construido y recolectar feedback de stakeholders.",
  retro: "Inspeccionar el proceso y acordar mejoras concretas.",
  refinement: "Refinar, dividir y estimar ítems del backlog.",
};

const FEATURES = [
  {
    icon: Timer,
    title: "Modo facilitador con timer",
    desc: "Guiá cada dinámica paso a paso, con temporizador y consignas claras para no perder el ritmo.",
  },
  {
    icon: Layers,
    title: "Biblioteca de dinámicas",
    desc: "34 dinámicas listas para usar, etiquetadas por ceremonia. Sumá las tuyas y reutilizalas cuando quieras.",
  },
  {
    icon: Radio,
    title: "Sesiones en vivo",
    desc: "Abrí una sala y compartí un código. El equipo entra y participa al instante, sin necesidad de cuenta.",
  },
  {
    icon: Users,
    title: "Proyectos, equipos y personas",
    desc: "Organizá tu mundo: proyectos con sus equipos, personas con sus notas y todo el contexto a mano.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Elegí la ceremonia",
    desc: "Daily, Planning, Review, Retro o Refinement. Cada una con su propio set de dinámicas.",
  },
  {
    n: "02",
    title: "Facilitá con una dinámica",
    desc: "Activá el modo facilitador, seguí el timer y mantené al equipo enfocado.",
  },
  {
    n: "03",
    title: "Invitá en vivo por código",
    desc: "Compartí un enlace y el equipo participa en tiempo real desde cualquier lado.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <LandingHeader isLoggedIn={isLoggedIn} />

      {/* ───────── Hero ───────── */}
      <section className="relative isolate px-4 pt-32 pb-20 sm:px-6 sm:pt-40 sm:pb-28">
        <div className="dotgrid pointer-events-none absolute inset-0 -z-10 opacity-40" />
        <div
          className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[420px] w-[820px] max-w-[120vw] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/25 via-accent/15 to-transparent blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 border border-border/60 px-3 py-1 text-xs font-medium"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Facilitá todas las ceremonias Scrum
          </Badge>

          <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Ritualis convierte cada ceremonia en un{" "}
            <span className="text-brand">ritual que el equipo espera</span>.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
            Una biblioteca de dinámicas, un modo facilitador con temporizador y
            salas en vivo compartibles por código. Daily, Planning, Review,
            Retro y Refinement — todo en un solo lugar.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
              <Link href={isLoggedIn ? "/app" : "/register"}>
                {isLoggedIn ? "Ir al panel" : "Empezar gratis"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <a href="#ceremonias">Ver las ceremonias</a>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Registro abierto · Sin tarjeta · Las salas en vivo no requieren
            cuenta
          </p>
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <div
            className="pointer-events-none absolute -inset-x-8 -top-8 bottom-0 -z-10 rounded-[2rem] bg-gradient-to-b from-primary/10 to-transparent blur-2xl"
            aria-hidden="true"
          />
          <DashboardPreview />
        </div>
      </section>

      {/* ───────── Ceremonias ───────── */}
      <section
        id="ceremonias"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Las 5 ceremonias, cada una con su identidad
          </h2>
          <p className="mt-4 text-muted-foreground">
            Cada ceremonia es independiente y tiene su propio set de dinámicas.
            Entrá, elegí y facilitá.
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-border/70 shadow-lg">
          <Image
            src="/ceremonias-ring.png"
            alt="El ciclo de las 5 ceremonias Scrum que facilita Ritualis"
            width={1672}
            height={941}
            priority
            className="h-auto w-full"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CEREMONIAS.map((c) => {
            const st = CEREMONIA_STYLE[c];
            return (
              <Card
                key={c}
                className={`lift relative h-full overflow-hidden border-border/70 p-6 shadow-sm ${st.glow}`}
              >
                <div className={`absolute inset-x-0 top-0 h-1 ${st.bar}`} />
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${st.gradient} blur-2xl`}
                  aria-hidden="true"
                />
                <div className="relative">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${st.chip}`}
                  >
                    <CeremoniaIcon ceremonia={c} className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    {CEREMONIA_LABEL[c]}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {CEREMONIA_DESC[c]}
                  </p>
                </div>
              </Card>
            );
          })}

          <Card className="lift surface flex h-full flex-col justify-center gap-3 border-dashed border-border/70 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Y una biblioteca compartida de dinámicas que crece con tu equipo.
            </p>
            <Button asChild variant="outline" size="sm" className="mx-auto gap-1.5">
              <Link href={isLoggedIn ? "/app" : "/register"}>
                Explorar dinámicas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* ───────── Features ───────── */}
      <section
        id="features"
        className="scroll-mt-20 border-y border-border/60 bg-muted/30 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Todo lo que necesitás para facilitar
            </h2>
            <p className="mt-4 text-muted-foreground">
              Pensado para Scrum Masters, líderes técnicos y cualquiera que
              guíe una ceremonia.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <Card
                key={f.title}
                className="lift surface flex gap-4 border-border/70 p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Showcase: dinámicas + métricas ───────── */}
      <section className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 sm:py-24">
        {/* Dinámicas */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Badge
              variant="secondary"
              className="mb-4 border border-border/60 px-3 py-1 text-xs font-medium"
            >
              Biblioteca
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              34 dinámicas listas, más las tuyas
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Filtrá por ceremonia, duración, tamaño de equipo o energía.
              Encontrá la dinámica justa en segundos o creá la tuya y compartila
              con el equipo.
            </p>
          </div>
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent blur-2xl"
              aria-hidden="true"
            />
            <DynamicsPreview />
          </div>
        </div>

        {/* Métricas */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative order-last lg:order-first">
            <div
              className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-accent/10 to-transparent blur-2xl"
              aria-hidden="true"
            />
            <MetricsPreview />
          </div>
          <div>
            <Badge
              variant="secondary"
              className="mb-4 border border-border/60 px-3 py-1 text-xs font-medium"
            >
              Métricas
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Tus métricas de Jira, Azure y GitHub en un lugar
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Velocidad, predictibilidad, cycle time y bloqueos con semáforos de
              estado. Conectá tu proveedor y mirá la salud del equipo de un
              vistazo.
            </p>
          </div>
        </div>
      </section>

      {/* ───────── Cómo funciona ───────── */}
      <section
        id="dinamicas"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            De cero a facilitando en tres pasos
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="flex items-center gap-3">
                <span className="font-brand text-3xl tracking-widest text-brand">
                  {s.n}
                </span>
                {i < STEPS.length - 1 && (
                  <div className="hidden h-px flex-1 bg-gradient-to-r from-border to-transparent md:block" />
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div
            className="pointer-events-none absolute -inset-x-6 -top-6 bottom-0 -z-10 rounded-[2rem] bg-gradient-to-b from-accent/10 to-transparent blur-2xl"
            aria-hidden="true"
          />
          <SessionPreview />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Una retro en vivo: el equipo entra por código y colabora en tiempo
            real.
          </p>
        </div>
      </section>

      {/* ───────── Capturas reales ───────── */}
      <RealShots />

      {/* ───────── CTA final ───────── */}
      <section className="px-4 pb-24 sm:px-6">
        <Card className="surface relative mx-auto max-w-4xl overflow-hidden border-border/70 px-6 py-14 text-center shadow-lg">
          <div className="dotgrid pointer-events-none absolute inset-0 opacity-40" />
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-primary/25 to-accent/15 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <RitualisMark className="mx-auto h-12 w-12 text-primary drop-shadow" />
            <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Hacé de tu próxima ceremonia un ritual
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Creá tu cuenta y empezá a facilitar en minutos. Es gratis.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
                <Link href={isLoggedIn ? "/app" : "/register"}>
                  {isLoggedIn ? "Ir al panel" : "Crear cuenta gratis"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {!isLoggedIn && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Link href="/login">Ya tengo cuenta</Link>
                </Button>
              )}
            </div>
          </div>
        </Card>
      </section>

      {/* ───────── Footer ───────── */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <RitualisMark className="h-6 w-6 text-primary" />
            <span className="font-brand tracking-[0.18em] text-foreground">
              RITUALIS
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Dinámicas para todas las ceremonias Scrum
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/login"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
