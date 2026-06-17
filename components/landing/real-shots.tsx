import Image from "next/image";
import { BrowserFrame } from "@/components/landing/browser-frame";

const SHOTS = [
  {
    file: "/shots/dashboard.png",
    url: "ritualis.app/app",
    alt: "Panel de Ritualis con proyectos, equipos, personas y las ceremonias.",
    caption: "El panel: tus métricas de un vistazo y acceso a cada ceremonia.",
    featured: true,
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

/** Galería de capturas reales del producto. */
export function RealShots() {
  const [featured, ...rest] = SHOTS;

  return (
    <section
      id="capturas"
      className="scroll-mt-20 border-t border-border/60 bg-muted/30 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Así se ve Ritualis
          </h2>
          <p className="mt-4 text-muted-foreground">
            Capturas reales del producto, no maquetas.
          </p>
        </div>

        <figure className="mx-auto mt-12 max-w-4xl">
          <BrowserFrame url={featured.url}>
            <Image
              src={featured.file}
              alt={featured.alt}
              width={1440}
              height={900}
              priority
              className="h-auto w-full"
            />
          </BrowserFrame>
          <figcaption className="mt-3 text-center text-sm text-muted-foreground">
            {featured.caption}
          </figcaption>
        </figure>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {rest.map((s) => (
            <figure key={s.file}>
              <BrowserFrame url={s.url}>
                <Image
                  src={s.file}
                  alt={s.alt}
                  width={1440}
                  height={900}
                  className="h-auto w-full"
                />
              </BrowserFrame>
              <figcaption className="mt-3 text-center text-sm text-muted-foreground">
                {s.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
