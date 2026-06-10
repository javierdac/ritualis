"use client";

import { Pencil, Trash2, Shield, User as UserIcon } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EntityDialog,
  ManagerHeader,
  useEntityManager,
} from "@/components/app/entity-manager";
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
  const m = useEntityManager<
    UserRow,
    { name: string; email: string; password: string; role: "admin" | "member" }
  >({
    empty: { name: "", email: "", password: "", role: "member" },
    toForm: (u) => ({ name: u.name, email: u.email, password: "", role: u.role }),
    save: (id, form) => saveUser(id, form),
    remove: (u) => deleteUser(u._id),
    labels: {
      created: "Usuario creado",
      updated: "Usuario actualizado",
      deleted: "Usuario borrado",
    },
  });

  return (
    <div className="space-y-6">
      <ManagerHeader
        title="Usuarios"
        subtitle="Cuentas que pueden iniciar sesión. Asigná rol Admin o Miembro."
        actionLabel="Nuevo usuario"
        onNew={m.openNew}
      />

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
                    <Button variant="ghost" size="icon" onClick={() => m.openEdit(u)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      disabled={u._id === currentUserId}
                      onClick={() => m.remove(u)}
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

      <EntityDialog
        open={m.open}
        onOpenChange={m.setOpen}
        title={m.editing ? "Editar usuario" : "Nuevo usuario"}
        description={
          m.editing
            ? "Cambiá el nombre, el rol o reseteá la contraseña."
            : "Creá una cuenta de login con su rol."
        }
        saving={m.saving}
        onSave={m.save}
      >
        <div className="space-y-2">
          <Label>Nombre</Label>
          <Input value={m.form.name} onChange={(e) => m.patch({ name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={m.form.email}
            onChange={(e) => m.patch({ email: e.target.value })}
            disabled={!!m.editing}
            placeholder={m.editing ? undefined : "persona@empresa.com"}
          />
          {m.editing && (
            <p className="text-xs text-muted-foreground">
              El email no se puede cambiar.
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>{m.editing ? "Nueva contraseña (opcional)" : "Contraseña"}</Label>
          <Input
            type="password"
            value={m.form.password}
            onChange={(e) => m.patch({ password: e.target.value })}
            placeholder={m.editing ? "Dejar vacío para no cambiar" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label>Rol</Label>
          <Select
            value={m.form.role}
            onValueChange={(v) => m.patch({ role: v as "admin" | "member" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Miembro</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </EntityDialog>
    </div>
  );
}
