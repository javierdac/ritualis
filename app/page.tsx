import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { auth } from "@/auth";
import { LandingHeader } from "@/components/landing/landing-header";
import { BrowserFrame } from "@/components/landing/browser-frame";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { DynamicsPreview } from "@/components/landing/dynamics-preview";
import { MetricsPreview } from "@/components/landing/metrics-preview";
import { SessionPreview } from "@/components/landing/session-preview";
import { RitualisMark } from "@/components/brand/ritualis-mark";
import { Button } from "@/components/ui/button";
import { SmoothScroll } from "@/components/landing-v2/smooth-scroll";
import { Reveal, WordReveal } from "@/components/landing-v2/reveal";
import { Parallax } from "@/components/landing-v2/parallax";
import { Marquee } from "@/components/landing-v2/marquee";
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

const STATS = [
  { n: "34", label: "dinámicas listas para facilitar" },
  { n: "5", label: "ceremonias, cada una con identidad propia" },
  { n: "0", label: "cuentas necesarias para entrar a una sala en vivo" },
];

const SHOTS = [
  {
    file: "/shots/dashboard.png",
    url: "ritualis.app/app",
    alt: "Panel de Ritualis con proyectos, equipos, personas y las ceremonias.",
    caption: "El panel: tus métricas de un vistazo y acceso a cada ceremonia.",
  },
  {
    file: "/shots/dinamicas.png",
    url: "ritualis.app/app/dinamicas",
    alt: "Biblioteca de dinámicas filtrable por ceremonia.",
    caption: "Biblioteca de dinámicas, filtrable por ceremonia.",
  },
  {
    file: "/shots/metricas.png",
    url: "ritualis.app/app/metricas",
    alt: "Dashboard de métricas con velocity, predictibilidad y cycle time.",
    caption: "Métricas de delivery con semáforos de estado.",
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
  const cta = isLoggedIn ? "/app" : "/register";

  return (
    <SmoothScroll>
      <div className="relative min-h-screen overflow-x-hidden">
        <LandingHeader isLoggedIn={isLoggedIn} />

        {/* ───────── Hero editorial ───────── */}
        <section className="relative px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Columna de texto */}
            <div>
              <Reveal as="div" className="mb-6">
                <span className="font-brand text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Facilitación de ceremonias Scrum
                </span>
              </Reveal>

              <WordReveal
                text="Cada ceremonia, un **ritual** que el equipo espera."
                className="text-balance text-4xl font-bold leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl"
              />

              <Reveal delay={0.15}>
                <p className="mt-8 max-w-xl text-pretty text-lg text-muted-foreground">
                  Una biblioteca de dinámicas, modo facilitador con
                  temporizador y salas en vivo compartibles por código. Daily,
                  Planning, Review, Retro y Refinement — en un solo lugar.
                </p>
              </Reveal>

              <Reveal
                delay={0.25}
                className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
                  <Link href={cta}>
                    {isLoggedIn ? "Ir al panel" : "Empezar gratis"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Sin tarjeta · Las salas en vivo no requieren cuenta
                </p>
              </Reveal>
            </div>

            {/* Columna de imagen (arte del hero) */}
            <Reveal delay={0.2}>
              <Parallax distance={40}>
                <div className="relative">
                  <div
                    className="pointer-events-none absolute inset-0 -z-10 scale-90 rounded-full bg-gradient-to-br from-primary/20 via-accent/12 to-transparent blur-3xl"
                    aria-hidden="true"
                  />
                  <Image
                    src="/hero-pentagon.png"
                    alt="Composición abstracta del ciclo de las cinco ceremonias de Ritualis"
                    width={982}
                    height={1240}
                    priority
                    className="mx-auto h-auto w-full max-w-[34rem] drop-shadow-2xl"
                    sizes="(max-width: 1024px) 100vw, 34rem"
                  />
                </div>
              </Parallax>
            </Reveal>
          </div>

          <div className="mx-auto mt-20 max-w-5xl">
            <Parallax distance={50}>
              <DashboardPreview />
            </Parallax>
          </div>
        </section>

        {/* ───────── Marquesina ───────── */}
        <Marquee
          items={["Daily", "Planning", "Review", "Retro", "Refinement"]}
        />

        {/* ───────── Manifiesto en números ───────── */}
        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-36">
          <div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <div className="border-t border-border pt-6">
                  <div className="font-brand text-6xl tracking-tight text-brand sm:text-7xl">
                    {s.n}
                  </div>
                  <p className="mt-3 max-w-[18ch] text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ───────── Ceremonias: lista tipográfica ───────── */}
        <section
          id="ceremonias"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-20"
        >
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <Reveal>
              <h2 className="max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                Las cinco, cada una con su identidad.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="lg:justify-self-end">
              <Parallax distance={28}>
                <Image
                  src="/ceremonias-ring.png"
                  alt="El ciclo de las 5 ceremonias Scrum que facilita Ritualis"
                  width={1672}
                  height={941}
                  className="h-auto w-full max-w-md rounded-2xl border border-border/70 shadow-lg"
                  sizes="(max-width: 1024px) 100vw, 28rem"
                />
              </Parallax>
            </Reveal>
          </div>

          <div className="mt-14 divide-y divide-border border-y border-border">
            {CEREMONIAS.map((c, i) => {
              const st = CEREMONIA_STYLE[c];
              return (
                <Reveal key={c} delay={i * 0.06}>
                  <div className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-7 transition-colors sm:gap-8">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${st.chip}`}
                    >
                      <CeremoniaIcon ceremonia={c} className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        {CEREMONIA_LABEL[c]}
                      </h3>
                      <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                        {CEREMONIA_DESC[c]}
                      </p>
                    </div>
                    <ArrowUpRight className="h-6 w-6 text-muted-foreground/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ───────── Showcase: dinámicas ───────── */}
        <section
          id="features"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-32"
        >
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <span className="font-brand text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Biblioteca
              </span>
              <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                34 dinámicas listas, más las tuyas.
              </h2>
              <p className="mt-5 max-w-md text-pretty text-muted-foreground">
                Filtrá por ceremonia, duración, tamaño de equipo o energía.
                Encontrá la dinámica justa en segundos o creá la tuya y
                compartila con el equipo.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <Parallax distance={36}>
                <DynamicsPreview />
              </Parallax>
            </Reveal>
          </div>

          {/* Métricas */}
          <div className="mt-28 grid items-center gap-12 lg:grid-cols-2">
            <Reveal className="order-last lg:order-first">
              <Parallax distance={36}>
                <MetricsPreview />
              </Parallax>
            </Reveal>
            <Reveal delay={0.12}>
              <span className="font-brand text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Métricas
              </span>
              <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                Jira, Azure y GitHub en un lugar.
              </h2>
              <p className="mt-5 max-w-md text-pretty text-muted-foreground">
                Velocidad, predictibilidad, cycle time y bloqueos con semáforos
                de estado. Conectá tu proveedor y mirá la salud del equipo de un
                vistazo.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ───────── Cómo funciona ───────── */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-32">
          <Reveal>
            <h2 className="max-w-2xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              De cero a facilitando en tres pasos.
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <span className="font-brand text-5xl tracking-widest text-brand">
                  {s.n}
                </span>
                <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-20">
            <Parallax distance={40} className="mx-auto max-w-3xl">
              <SessionPreview />
            </Parallax>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Una retro en vivo: el equipo entra por código y colabora en
              tiempo real.
            </p>
          </Reveal>
        </section>

        {/* ───────── Capturas reales ───────── */}
        <section
          id="capturas"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-32"
        >
          <Reveal>
            <span className="font-brand text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Capturas reales, no maquetas
            </span>
            <h2 className="mt-4 max-w-2xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Así se ve Ritualis.
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-14">
            <Parallax distance={42}>
              <figure>
                <BrowserFrame url={SHOTS[0].url}>
                  <Image
                    src={SHOTS[0].file}
                    alt={SHOTS[0].alt}
                    width={1440}
                    height={900}
                    className="h-auto w-full"
                  />
                </BrowserFrame>
                <figcaption className="mt-3 text-sm text-muted-foreground">
                  {SHOTS[0].caption}
                </figcaption>
              </figure>
            </Parallax>
          </Reveal>

          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            {SHOTS.slice(1).map((s, i) => (
              <Reveal key={s.file} delay={i * 0.12}>
                <Parallax distance={30}>
                  <figure>
                    <BrowserFrame url={s.url}>
                      <Image
                        src={s.file}
                        alt={s.alt}
                        width={1440}
                        height={900}
                        className="h-auto w-full"
                      />
                    </BrowserFrame>
                    <figcaption className="mt-3 text-sm text-muted-foreground">
                      {s.caption}
                    </figcaption>
                  </figure>
                </Parallax>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ───────── CTA tipográfica ───────── */}
        <section className="px-4 py-28 sm:px-6 sm:py-40">
          <div className="mx-auto max-w-5xl text-center">
            <Reveal>
              <RitualisMark className="mx-auto h-14 w-14 text-primary" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mx-auto mt-8 max-w-4xl text-balance text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
                Hacé de tu próxima ceremonia un{" "}
                <span className="text-brand">ritual</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
                  <Link href={cta}>
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
            </Reveal>
          </div>
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
    </SmoothScroll>
  );
}
