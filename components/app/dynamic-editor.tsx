"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CEREMONIA_LABEL,
  OBJETIVO_LABEL,
  type Ceremonia,
  type Objetivo,
  type Energia,
} from "@/lib/types";
import type { DynamicDTO } from "@/lib/dto";
import { saveDynamic, type DynamicInput } from "@/lib/actions/dynamics";

const CEREMONIAS = Object.keys(CEREMONIA_LABEL) as Ceremonia[];
const OBJETIVOS = Object.keys(OBJETIVO_LABEL) as Objetivo[];

type Step = { titulo: string; detalle: string; duracionMin?: number };

function emptyState(): DynamicInput {
  return {
    nombre: "",
    resumen: "",
    ceremonias: [],
    objetivos: [],
    duracionMin: 30,
    equipoMin: 2,
    equipoMax: 12,
    energia: "media",
    presencial: true,
    remoto: true,
    materiales: [],
    pasos: [{ titulo: "", detalle: "", duracionMin: 5 }],
    tips: [],
  };
}

export function DynamicEditor({
  open,
  onOpenChange,
  dynamic,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  dynamic?: DynamicDTO | null;
}) {
  const [form, setForm] = useState<DynamicInput>(() =>
    dynamic ? toInput(dynamic) : emptyState(),
  );
  const [saving, setSaving] = useState(false);

  // Resetea el form cuando cambia la dinámica/al abrir.
  const [lastId, setLastId] = useState<string | undefined>(dynamic?._id);
  if (open && dynamic?._id !== lastId) {
    setLastId(dynamic?._id);
    setForm(dynamic ? toInput(dynamic) : emptyState());
  }

  const toggle = <T extends string>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const set = <K extends keyof DynamicInput>(k: K, v: DynamicInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    setSaving(true);
    const cleaned: DynamicInput = {
      ...form,
      materiales: form.materiales.map((m) => m.trim()).filter(Boolean),
      tips: form.tips.map((t) => t.trim()).filter(Boolean),
      pasos: form.pasos
        .map((p) => ({ ...p, titulo: p.titulo.trim(), detalle: p.detalle.trim() }))
        .filter((p) => p.titulo && p.detalle),
    };
    const res = await saveDynamic(dynamic?._id ?? null, cleaned);
    setSaving(false);
    if (res.ok) {
      toast.success(dynamic ? "Dinámica actualizada" : "Dinámica creada");
      onOpenChange(false);
    } else {
      toast.error(res.error ?? "No se pudo guardar");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dynamic ? "Editar dinámica" : "Nueva dinámica"}</DialogTitle>
          <DialogDescription>
            Definí los datos, las ceremonias donde aplica y el paso a paso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input
              value={form.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              placeholder="Ej: Mad, Sad, Glad"
            />
          </div>

          <div className="space-y-2">
            <Label>Resumen</Label>
            <Textarea
              value={form.resumen}
              onChange={(e) => set("resumen", e.target.value)}
              placeholder="Una línea: qué es y para qué sirve."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Ceremonias</Label>
            <div className="flex flex-wrap gap-2">
              {CEREMONIAS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set("ceremonias", toggle(form.ceremonias as Ceremonia[], c))}
                >
                  <Badge variant={form.ceremonias.includes(c) ? "default" : "outline"}>
                    {CEREMONIA_LABEL[c]}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Objetivos</Label>
            <div className="flex flex-wrap gap-2">
              {OBJETIVOS.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => set("objetivos", toggle(form.objetivos as Objetivo[], o))}
                >
                  <Badge variant={form.objetivos.includes(o) ? "default" : "outline"}>
                    {OBJETIVO_LABEL[o]}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label>Duración (min)</Label>
              <Input
                type="number"
                value={form.duracionMin}
                onChange={(e) => set("duracionMin", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Equipo mín.</Label>
              <Input
                type="number"
                value={form.equipoMin}
                onChange={(e) => set("equipoMin", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Equipo máx.</Label>
              <Input
                type="number"
                value={form.equipoMax}
                onChange={(e) => set("equipoMax", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Energía</Label>
              <Select
                value={form.energia}
                onValueChange={(v) => set("energia", v as Energia)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Tranqui</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Activa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.presencial}
                onChange={(e) => set("presencial", e.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              Presencial
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.remoto}
                onChange={(e) => set("remoto", e.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              Remoto
            </label>
          </div>

          {/* Materiales */}
          <ListEditor
            label="Materiales"
            items={form.materiales}
            onChange={(items) => set("materiales", items)}
            placeholder="Ej: Post-its"
          />

          {/* Pasos */}
          <div className="space-y-2">
            <Label>Pasos</Label>
            <div className="space-y-3">
              {form.pasos.map((p, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Paso {i + 1}</span>
                    <div className="flex-1" />
                    <Input
                      type="number"
                      value={p.duracionMin ?? ""}
                      onChange={(e) => {
                        const v = e.target.value ? Number(e.target.value) : undefined;
                        const pasos = [...form.pasos];
                        pasos[i] = { ...pasos[i], duracionMin: v };
                        set("pasos", pasos);
                      }}
                      className="h-8 w-20"
                      placeholder="min"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() =>
                        set(
                          "pasos",
                          form.pasos.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={p.titulo}
                    onChange={(e) => {
                      const pasos = [...form.pasos];
                      pasos[i] = { ...pasos[i], titulo: e.target.value };
                      set("pasos", pasos);
                    }}
                    placeholder="Título del paso"
                    className="mb-2"
                  />
                  <Textarea
                    value={p.detalle}
                    onChange={(e) => {
                      const pasos = [...form.pasos];
                      pasos[i] = { ...pasos[i], detalle: e.target.value };
                      set("pasos", pasos);
                    }}
                    placeholder="Qué hace el equipo en este paso"
                    rows={2}
                  />
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() =>
                set("pasos", [...form.pasos, { titulo: "", detalle: "", duracionMin: 5 }] as Step[])
              }
            >
              <Plus className="h-4 w-4" /> Agregar paso
            </Button>
          </div>

          {/* Tips */}
          <ListEditor
            label="Tips de facilitación"
            items={form.tips}
            onChange={(items) => set("tips", items)}
            placeholder="Ej: Limitá cada explicación a 1 minuto"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando…" : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={it}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={() => onChange([...items, ""])}
      >
        <Plus className="h-4 w-4" /> Agregar
      </Button>
    </div>
  );
}

function toInput(d: DynamicDTO): DynamicInput {
  return {
    nombre: d.nombre,
    resumen: d.resumen,
    ceremonias: d.ceremonias,
    objetivos: d.objetivos,
    duracionMin: d.duracionMin,
    equipoMin: d.equipoMin,
    equipoMax: d.equipoMax,
    energia: d.energia,
    presencial: d.presencial,
    remoto: d.remoto,
    materiales: d.materiales,
    pasos: d.pasos.map((p) => ({ ...p })),
    tips: d.tips,
  };
}
