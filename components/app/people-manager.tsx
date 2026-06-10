"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, UserRound, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { savePerson, deletePerson } from "@/lib/actions/people";
import type { PersonDTO, TeamDTO } from "@/lib/dto";

export function PeopleManager({
  people,
  teams,
}: {
  people: PersonDTO[];
  teams: TeamDTO[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PersonDTO | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [selTeams, setSelTeams] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setName("");
    setRole("");
    setEmail("");
    setSelTeams([]);
    setOpen(true);
  }
  function openEdit(p: PersonDTO) {
    setEditing(p);
    setName(p.name);
    setRole(p.role ?? "");
    setEmail(p.email ?? "");
    setSelTeams(p.teams);
    setOpen(true);
  }
  function toggleTeam(id: string) {
    setSelTeams((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
  async function save() {
    setSaving(true);
    const res = await savePerson(editing?._id ?? null, {
      name,
      role,
      email,
      teams: selTeams,
    });
    setSaving(false);
    if (res.ok) {
      toast.success(editing ? "Persona actualizada" : "Persona creada");
      setOpen(false);
    } else toast.error(res.error ?? "Error");
  }
  async function remove(p: PersonDTO) {
    const res = await deletePerson(p._id);
    if (res.ok) toast.success("Persona borrada");
    else toast.error(res.error ?? "Error");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Personas</h1>
          <p className="text-muted-foreground">
            Cargá miembros y asignalos a uno o varios equipos.
          </p>
        </div>
        <Button onClick={openNew} className="gap-1">
          <Plus className="h-4 w-4" /> Nueva persona
        </Button>
      </div>

      {people.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <UserRound className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Todavía no cargaste personas.</p>
          <Button onClick={openNew} variant="outline" className="gap-1">
            <Plus className="h-4 w-4" /> Cargar la primera
          </Button>
        </div>
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
            <DialogTitle>{editing ? "Editar persona" : "Nueva persona"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rol</Label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Dev, PO, QA…"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                      <Badge variant={selTeams.includes(t._id) ? "default" : "outline"}>
                        {t.name}
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
