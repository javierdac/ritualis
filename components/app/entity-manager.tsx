"use client";

import { useState } from "react";
import { Plus, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CrudResult } from "@/lib/actions/projects";

/**
 * Estado y lógica comunes a los CRUD con dialog (proyectos, equipos,
 * personas, usuarios): abrir nuevo/editar, formulario, guardado y borrado
 * con toasts.
 */
export function useEntityManager<T extends { _id: string }, F>(opts: {
  empty: F;
  toForm: (item: T) => F;
  save: (id: string | null, form: F) => Promise<CrudResult>;
  remove: (item: T) => Promise<CrudResult>;
  labels: { created: string; updated: string; deleted: string };
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<F>(opts.empty);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setForm(opts.empty);
    setOpen(true);
  }
  function openEdit(item: T) {
    setEditing(item);
    setForm(opts.toForm(item));
    setOpen(true);
  }
  function patch(partial: Partial<F>) {
    setForm((f) => ({ ...f, ...partial }));
  }
  async function save() {
    setSaving(true);
    const res = await opts.save(editing?._id ?? null, form);
    setSaving(false);
    if (res.ok) {
      toast.success(editing ? opts.labels.updated : opts.labels.created);
      setOpen(false);
    } else toast.error(res.error ?? "Error");
  }
  async function remove(item: T) {
    const res = await opts.remove(item);
    if (res.ok) toast.success(opts.labels.deleted);
    else toast.error(res.error ?? "Error");
  }

  return { open, setOpen, editing, form, patch, saving, openNew, openEdit, save, remove };
}

export function ManagerHeader({
  title,
  subtitle,
  actionLabel,
  onNew,
}: {
  title: string;
  subtitle: string;
  actionLabel: string;
  onNew: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <Button onClick={onNew} className="gap-1">
        <Plus className="h-4 w-4" /> {actionLabel}
      </Button>
    </div>
  );
}

export function ManagerEmptyState({
  icon: Icon,
  message,
  actionLabel,
  onNew,
}: {
  icon: LucideIcon;
  message: string;
  actionLabel: string;
  onNew: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
      <Icon className="h-10 w-10 text-muted-foreground" />
      <p className="text-muted-foreground">{message}</p>
      <Button onClick={onNew} variant="outline" className="gap-1">
        <Plus className="h-4 w-4" /> {actionLabel}
      </Button>
    </div>
  );
}

export function EntityDialog({
  open,
  onOpenChange,
  title,
  description,
  saving,
  onSave,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  saving: boolean;
  onSave: () => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4 py-2">{children}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Guardando…" : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
