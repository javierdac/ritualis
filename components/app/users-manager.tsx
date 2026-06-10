"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Shield, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { saveUser, deleteUser } from "@/lib/actions/users";

type UserRow = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  createdAt: string;
};

export function UsersManager({
  users,
  currentUserId,
}: {
  users: UserRow[];
  currentUserId: string;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("member");
    setOpen(true);
  }
  function openEdit(u: UserRow) {
    setEditing(u);
    setName(u.name);
    setEmail(u.email);
    setPassword("");
    setRole(u.role);
    setOpen(true);
  }
  async function save() {
    setSaving(true);
    const res = await saveUser(editing?._id ?? null, { name, email, password, role });
    setSaving(false);
    if (res.ok) {
      toast.success(editing ? "Usuario actualizado" : "Usuario creado");
      setOpen(false);
    } else toast.error(res.error ?? "Error");
  }
  async function remove(u: UserRow) {
    const res = await deleteUser(u._id);
    if (res.ok) toast.success("Usuario borrado");
    else toast.error(res.error ?? "Error");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            Cuentas que pueden iniciar sesión. Asigná rol Admin o Miembro.
          </p>
        </div>
        <Button onClick={openNew} className="gap-1">
          <Plus className="h-4 w-4" /> Nuevo usuario
        </Button>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell className="font-medium">
                  {u.name}
                  {u._id === currentUserId && (
                    <span className="ml-2 text-xs text-muted-foreground">(vos)</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  {u.role === "admin" ? (
                    <Badge className="gap-1 bg-primary/15 text-primary">
                      <Shield className="h-3 w-3" /> Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <UserIcon className="h-3 w-3" /> Miembro
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(u)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      disabled={u._id === currentUserId}
                      onClick={() => remove(u)}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Cambiá el nombre, el rol o reseteá la contraseña."
                : "Creá una cuenta de login con su rol."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!editing}
                placeholder={editing ? undefined : "persona@empresa.com"}
              />
              {editing && (
                <p className="text-xs text-muted-foreground">
                  El email no se puede cambiar.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{editing ? "Nueva contraseña (opcional)" : "Contraseña"}</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={editing ? "Dejar vacío para no cambiar" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select value={role} onValueChange={(v) => setRole(v as "admin" | "member")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Miembro</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
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
