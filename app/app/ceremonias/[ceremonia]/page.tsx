import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getDynamics } from "@/lib/data";
import { DynamicCard } from "@/components/app/dynamic-card";
import { CEREMONIA_LABEL, type Ceremonia } from "@/lib/types";
import { CeremoniaIcon } from "@/lib/icons";
import { CEREMONIA_STYLE } from "@/lib/ceremonia-style";

const VALID: Ceremonia[] = ["daily", "planning", "review", "retro", "refinement"];

export default async function CeremoniaPage({
  params,
}: {
  params: Promise<{ ceremonia: string }>;
}) {
  const { ceremonia } = await params;
  if (!VALID.includes(ceremonia as Ceremonia)) notFound();
  const c = ceremonia as Ceremonia;

  const user = await requireUser();
  const dynamics = await getDynamics(user.id, c);
  const st = CEREMONIA_STYLE[c];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/app/ceremonias"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Ceremonias
      </Link>

      <div
        className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${st.gradient} p-6 shadow-sm`}
      >
        <div className={`absolute inset-x-0 top-0 h-1 ${st.bar}`} />
        <div className="flex items-center gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${st.chip}`}
          >
            <CeremoniaIcon ceremonia={c} className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{CEREMONIA_LABEL[c]}</h1>
            <p className="text-muted-foreground">
              {dynamics.length} dinámica{dynamics.length === 1 ? "" : "s"}{" "}
              disponible{dynamics.length === 1 ? "" : "s"} para esta ceremonia.
            </p>
          </div>
        </div>
      </div>

      {dynamics.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
          No hay dinámicas para esta ceremonia todavía.{" "}
          <Link href="/app/dinamicas" className="text-primary hover:underline">
            Creá una
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dynamics.map((d) => (
            <DynamicCard key={d._id} d={d} />
          ))}
        </div>
      )}
    </div>
  );
}
