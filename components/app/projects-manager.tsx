"use client";

import { Pencil, Trash2, FolderKanban } from "lucide-react";
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
import { saveProject, deleteProject } from "@/lib/actions/projects";
import type { ProjectDTO } from "@/lib/dto";

export function ProjectsManager({ projects }: { projects: ProjectDTO[] }) {
  const m = useEntityManager<ProjectDTO, { name: string; description: string }>({
    empty: { name: "", description: "" },
    toForm: (p) => ({ name: p.name, description: p.description ?? "" }),
    save: (id, form) => saveProject(id, form),
    remove: (p) => deleteProject(p._id),
    labels: {
      created: "Proyecto creado",
      updated: "Proyecto actualizado",
      deleted: "Proyecto borrado",
    },
  });

  return (
    <div className="space-y-6">
      <ManagerHeader
        title="Proyectos"
        subtitle="Tus productos o iniciativas."
        actionLabel="Nuevo proyecto"
        onNew={m.openNew}
      />

      {projects.length === 0 ? (
        <ManagerEmptyState
          icon={FolderKanban}
          message="Todavía no tenés proyectos."
          actionLabel="Crear el primero"
          onNew={m.openNew}
        />
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-center">Equipos</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.description || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{p.teamCount ?? 0}</Badge>
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
        title={m.editing ? "Editar proyecto" : "Nuevo proyecto"}
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
            rows={3}
          />
        </div>
      </EntityDialog>
    </div>
  );
}
