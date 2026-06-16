"use client";

import { Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { saveTeam, deleteTeam } from "@/lib/actions/teams";
import type { TeamDTO, ProjectDTO, PersonDTO } from "@/lib/dto";

export function TeamsManager({
  teams,
  projects,
  people,
}: {
  teams: TeamDTO[];
  projects: ProjectDTO[];
  people: PersonDTO[];
}) {
  const m = useEntityManager<
    TeamDTO,
    { name: string; description: string; projects: string[]; members: string[] }
  >({
    empty: { name: "", description: "", projects: [], members: [] },
    toForm: (t) => ({
      name: t.name,
      description: t.description ?? "",
      projects: t.projects,
      members: t.members,
    }),
    save: (id, form) => saveTeam(id, form),
    remove: (t) => deleteTeam(t._id),
    labels: {
      created: "Equipo creado",
      updated: "Equipo actualizado",
      deleted: "Equipo borrado",
    },
  });

  function toggleProject(id: string) {
    m.patch({
      projects: m.form.projects.includes(id)
        ? m.form.projects.filter((x) => x !== id)
        : [...m.form.projects, id],
    });
  }

  function toggleMember(id: string) {
    m.patch({
      members: m.form.members.includes(id)
        ? m.form.members.filter((x) => x !== id)
        : [...m.form.members, id],
    });
  }

  return (
    <div className="space-y-6">
      <ManagerHeader
        title="Equipos"
        subtitle="Un equipo puede pertenecer a varios proyectos."
        actionLabel="Nuevo equipo"
        onNew={m.openNew}
      />

      {teams.length === 0 ? (
        <ManagerEmptyState
          icon={Users}
          message="Todavía no tenés equipos."
          actionLabel="Crear el primero"
          onNew={m.openNew}
        />
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Proyectos</TableHead>
                <TableHead className="text-center">Personas</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((t) => (
                <TableRow key={t._id}>
                  <TableCell className="font-medium">
                    {t.name}
                    {t.description && (
                      <p className="text-xs font-normal text-muted-foreground">
                        {t.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {t.projectNames.length ? (
                        t.projectNames.map((p) => (
                          <Badge key={p._id} variant="secondary">
                            {p.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{t.memberCount ?? 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => m.openEdit(t)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => m.remove(t)}
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
        title={m.editing ? "Editar equipo" : "Nuevo equipo"}
        saving={m.saving}
        onSave={m.save}
      >
        <div className="space-y-2">
          <Label>Nombre</Label>
          <Input value={m.form.name} onChange={(e) => m.patch({ name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Descripción</Label>
          <Textarea
            value={m.form.description}
            onChange={(e) => m.patch({ description: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Proyectos</Label>
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Creá un proyecto primero para asignarlo.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {projects.map((p) => (
                <button key={p._id} type="button" onClick={() => toggleProject(p._id)}>
                  <Badge variant={m.form.projects.includes(p._id) ? "default" : "outline"}>
                    {p.name}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>Personas</Label>
          {people.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Cargá una persona primero para asignarla.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {people.map((p) => (
                <button key={p._id} type="button" onClick={() => toggleMember(p._id)}>
                  <Badge variant={m.form.members.includes(p._id) ? "default" : "outline"}>
                    {p.name}
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
