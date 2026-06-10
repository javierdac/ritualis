import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getDynamics } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CEREMONIA_LABEL, type Ceremonia } from "@/lib/types";
import { CeremoniaIcon } from "@/lib/icons";
import { CEREMONIA_STYLE } from "@/lib/ceremonia-style";

const CEREMONIAS: Ceremonia[] = ["daily", "planning", "review", "retro", "refinement"];

const CEREMONIA_DESC: Record<Ceremonia, string> = {
  daily: "Sincronización corta y diaria. Foco en el flujo y los bloqueos.",
  planning: "Definir el objetivo y el alcance del próximo sprint.",
  review: "Mostrar lo construido y recolectar feedback de stakeholders.",
  retro: "Inspeccionar el proceso y acordar mejoras concretas.",
  refinement: "Refinar, dividir y estimar ítems del backlog.",
};

export default async function CeremoniasPage() {
  const user = await requireUser();
  const all = await getDynamics(user.id);

  const countByCeremonia = (c: Ceremonia) =>
    all.filter((d) => d.ceremonias.includes(c)).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ceremonias</h1>
        <p className="text-muted-foreground">
          Cada ceremonia es independiente y tiene su propio set de dinámicas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CEREMONIAS.map((c) => {
          const st = CEREMONIA_STYLE[c];
          return (
            <Link key={c} href={`/app/ceremonias/${c}`} className="group">
              <Card
                className={`lift relative h-full overflow-hidden border-border/70 p-6 shadow-sm ${st.glow}`}
              >
                <div className={`absolute inset-x-0 top-0 h-1 ${st.bar}`} />
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${st.gradient} blur-2xl`}
                />
                <div className="relative flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${st.chip}`}
                  >
                    <CeremoniaIcon ceremonia={c} className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold">{CEREMONIA_LABEL[c]}</h3>
                      <Badge variant="secondary" className="shrink-0">
                        {countByCeremonia(c)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {CEREMONIA_DESC[c]}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Ver dinámicas
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
