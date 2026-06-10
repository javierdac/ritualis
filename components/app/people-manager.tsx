"use client";

import Link from "next/link";
import { Pencil, Trash2, UserRound, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EntityDialog,
  ManagerEmptyState,
  ManagerHeader,
  useEntityManager,
} from "@/components/app/entity-manager";
import { savePerson, deletePerson } from "@/lib/actions/people";
import type { PersonDTO, TeamDTO } from "@/lib/dto";

export function PeopleManager({
  people,
  teams,
}: {
  people: PersonDTO[];
  teams: TeamDTO[];
}) {
  const m = useEntityManager<
    PersonDTO,
    { name: string; role: string; email: string; teams: string[] }
  >({
    empty: { name: "", role: "", email: "", teams: [] },
    toForm: (p) => ({
      name: p.name,
      role: p.role ?? "",
      email: p.email ?? "",
      teams: p.teams,
    }),
    save: (id, form) => savePerson(id, form),
    remove: (p) => deletePerson(p._id),
    labels: {
      created: "Persona creada",
      updated: "Persona actualizada",
      deleted: "Persona borrada",
    },
  });

  function toggleTeam(id: string) {
    m.patch({
      teams: m.form.teams.includes(id)
        ? m.form.teams.filter((x) => x !== id)
        : [...m.form.teams, id],
    });
  }

  return (
    <div className="space-y-6">
      <ManagerHeader
        title="Personas"
        subtitle="Cargá miembros y asignalos a uno o varios equipos."
        actionLabel="Nueva persona"
        onNew={m.openNew}
      />

      {people.length === 0 ? (
        <ManagerEmptyState
          icon={UserRound}
          message="Todavía no cargaste personas."
          actionLabel="Cargar la primera"
          onNew={m.openNew}
        />
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Equipos</TableHead>
                <TableHead className="text-center">Notas</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {people.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-medium">
                    <Link href={`/app/personas/${p._id}`} className="hover:text-primary hover:underline">
                      {p.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.role || "—"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {p.teamNames.length ? (
                        p.teamNames.map((t) => (
                          <Badge key={t._id} variant="secondary">
                            {t.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/app/personas/${p._id}`}>
                      <Badge variant="outline" className="gap-1">
                        <StickyNote className="h-3 w-3" /> {p.noteCount ?? 0}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => m.openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => m.remove(p)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <EntityDialog
        open={m.open}
        onOpenChange={m.setOpen}
        title={m.editing ? "Editar persona" : "Nueva persona"}
        saving={m.saving}
        onSave={m.save}
      >
        <div className="space-y-2">
          <Label>Nombre</Label>
          <Input value={m.form.name} onChange={(e) => m.patch({ name: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Rol</Label>
            <Input
              value={m.form.role}
              onChange={(e) => m.patch({ role: e.target.value })}
              placeholder="Dev, PO, QA…"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={m.form.email}
              onChange={(e) => m.patch({ email: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Equipos</Label>
          {teams.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Creá un equipo primero para asignarlo.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {teams.map((t) => (
                <button key={t._id} type="button" onClick={() => toggleTeam(t._id)}>
                  <Badge variant={m.form.teams.includes(t._id) ? "default" : "outline"}>
                    {t.name}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>
      </EntityDialog>
    </div>
  );
}
