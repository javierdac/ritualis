import { requireUser } from "@/lib/session";
import { getSessions } from "@/lib/data";
import { SessionsList } from "@/components/app/sessions-list";

export default async function SesionesPage() {
  const user = await requireUser();
  const sessions = await getSessions(user.id, user.role === "admin");
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sesiones en vivo</h1>
        <p className="text-muted-foreground">
          Tus salas colaborativas. Reabrí una en curso o cerrala cuando termine.
        </p>
      </div>
      <SessionsList sessions={sessions} />
    </div>
  );
}
