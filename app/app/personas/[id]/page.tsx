import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getPerson, getNotes } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NotesSection } from "@/components/app/notes-section";

export default async function PersonaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const person = await getPerson(user.id, id, user.role === "admin");
  if (!person) notFound();
  const notes = await getNotes(id);

  const initials = person.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/app/personas"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Personas
      </Link>

      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="bg-primary/15 text-lg text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{person.name}</h1>
          <p className="text-muted-foreground">
            {person.role || "Sin rol"} {person.email && `· ${person.email}`}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {person.teamNames.map((t) => (
              <Badge key={t._id} variant="secondary">
                {t.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Notas</h2>
        <NotesSection personId={person._id} notes={notes} />
      </div>
    </div>
  );
}
