"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
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
import { saveTeam, deleteTeam } from "@/lib/actions/teams";
import type { TeamDTO, ProjectDTO } from "@/lib/dto";

export function TeamsManager({
  teams,
  projects,
}: {
  teams: TeamDTO[];
  projects: ProjectDTO[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeamDTO | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selProjects, setSelProjects] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setName("");
    setDescription("");
    setSelProjects([]);
    setOpen(true);
  }
  function openEdit(t: TeamDTO) {
    setEditing(t);
    setName(t.name);
    setDescription(t.description ?? "");
    setSelProjects(t.projects);
    setOpen(true);
  }
  function toggleProject(id: string) {
    setSelProjects((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
  async function save() {
    setSaving(true);
    const res = await saveTeam(editing?._id ?? null, {
      name,
      description,
      projects: selProjects,
    });
    setSaving(false);
    if (res.ok) {
      toast.success(editing ? "Equipo actualizado" : "Equipo creado");
      setOpen(false);
    } else toast.error(res.error ?? "Error");
  }
  async function remove(t: TeamDTO) {
    const res = await deleteTeam(t._id);
    if (res.ok) toast.success("Equipo borrado");
    else toast.error(res.error ?? "Error");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Equipos</h1>
          <p className="text-muted-foreground">
            Un equipo puede pertenecer a varios proyectos.
          </p>
        </div>
        <Button onClick={openNew} className="gap-1">
          <Plus className="h-4 w-4" /> Nuevo equipo
        </Button>
      </div>

      {teams.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <Users className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Todavía no tenés equipos.</p>
          <Button onClick={openNew} variant="outline" className="gap-1">
            <Plus className="h-4 w-4" /> Crear el primero
          </Button>
        </div>
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
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => remove(t)}
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
            <DialogTitle>{editing ? "Editar equipo" : "Nuevo equipo"}</DialogTitle>
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
                      <Badge variant={selProjects.includes(p._id) ? "default" : "outline"}>
                        {p.name}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
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
