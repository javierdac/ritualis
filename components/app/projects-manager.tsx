"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, FolderKanban } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { saveProject, deleteProject } from "@/lib/actions/projects";
import type { ProjectDTO } from "@/lib/dto";

export function ProjectsManager({ projects }: { projects: ProjectDTO[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectDTO | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setName("");
    setDescription("");
    setOpen(true);
  }
  function openEdit(p: ProjectDTO) {
    setEditing(p);
    setName(p.name);
    setDescription(p.description ?? "");
    setOpen(true);
  }
  async function save() {
    setSaving(true);
    const res = await saveProject(editing?._id ?? null, { name, description });
    setSaving(false);
    if (res.ok) {
      toast.success(editing ? "Proyecto actualizado" : "Proyecto creado");
      setOpen(false);
    } else toast.error(res.error ?? "Error");
  }
  async function remove(p: ProjectDTO) {
    const res = await deleteProject(p._id);
    if (res.ok) toast.success("Proyecto borrado");
    else toast.error(res.error ?? "Error");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-muted-foreground">Tus productos o iniciativas.</p>
        </div>
        <Button onClick={openNew} className="gap-1">
          <Plus className="h-4 w-4" /> Nuevo proyecto
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState onNew={openNew} />
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
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => remove(p)}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar proyecto" : "Nuevo proyecto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
      <FolderKanban className="h-10 w-10 text-muted-foreground" />
      <p className="text-muted-foreground">Todavía no tenés proyectos.</p>
      <Button onClick={onNew} variant="outline" className="gap-1">
        <Plus className="h-4 w-4" /> Crear el primero
      </Button>
    </div>
  );
}
