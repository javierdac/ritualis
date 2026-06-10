"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, MoreVertical, Pencil, Trash2, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DynamicCard } from "@/components/app/dynamic-card";
import { DynamicEditor } from "@/components/app/dynamic-editor";
import { deleteDynamic, cloneDynamic } from "@/lib/actions/dynamics";
import { CEREMONIA_LABEL, type Ceremonia } from "@/lib/types";
import { CeremoniaIcon } from "@/lib/icons";
import type { DynamicDTO } from "@/lib/dto";

const CEREMONIAS = Object.keys(CEREMONIA_LABEL) as Ceremonia[];
const PAGE = 9;

export function DynamicsManager() {
  const [q, setQ] = useState("");
  const [cer, setCer] = useState<Ceremonia | null>(null);
  const [items, setItems] = useState<DynamicDTO[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [done, setDone] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<DynamicDTO | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const skipRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchBatch = useCallback(
    async (reset: boolean) => {
      const skip = reset ? 0 : skipRef.current;
      const params = new URLSearchParams({ skip: String(skip), limit: String(PAGE) });
      if (cer) params.set("ceremonia", cer);
      if (q) params.set("q", q);
      const res = await fetch(`/api/dynamics?${params}`, { cache: "no-store" });
      const data = await res.json();
      const batch: DynamicDTO[] = data.items ?? [];
      setTotal(data.total ?? 0);
      setItems((prev) => (reset ? batch : [...prev, ...batch]));
      skipRef.current = skip + batch.length;
      setDone(skipRef.current >= (data.total ?? 0));
    },
    [q, cer],
  );

  // Reset + primer lote cuando cambian filtros (con debounce en la búsqueda).
  useEffect(() => {
    let cancelled = false;
    // Mostrar el skeleton mientras se trae el primer lote (fetch de datos).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setDone(false);
    const t = setTimeout(async () => {
      await fetchBatch(true);
      if (!cancelled) setLoading(false);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [fetchBatch, refreshKey]);

  // Infinite scroll: cargar el siguiente lote al llegar al sentinel.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !done && !loading && !loadingMore) {
          setLoadingMore(true);
          fetchBatch(false).finally(() => setLoadingMore(false));
        }
      },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [done, loading, loadingMore, fetchBatch]);

  const refresh = () => setRefreshKey((k) => k + 1);

  function openNew() {
    setEditing(null);
    setEditorOpen(true);
  }
  function openEdit(d: DynamicDTO) {
    setEditing(d);
    setEditorOpen(true);
  }
  async function onDelete(d: DynamicDTO) {
    const res = await deleteDynamic(d._id);
    if (res.ok) {
      toast.success("Dinámica borrada");
      refresh();
    } else toast.error(res.error ?? "No se pudo borrar");
  }
  async function onClone(d: DynamicDTO) {
    const res = await cloneDynamic(d._id);
    if (res.ok) {
      toast.success("Dinámica clonada como propia");
      refresh();
    } else toast.error(res.error ?? "No se pudo clonar");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dinámicas</h1>
          <p className="text-muted-foreground">
            {total ?? "…"} en total · creá las tuyas o clonás una existente.
          </p>
        </div>
        <Button onClick={openNew} className="gap-1">
          <Plus className="h-4 w-4" /> Nueva dinámica
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar…"
          className="max-w-xs"
        />
        <button onClick={() => setCer(null)}>
          <Badge variant={cer === null ? "default" : "outline"}>Todas</Badge>
        </button>
        {CEREMONIAS.map((c) => (
          <button key={c} onClick={() => setCer(c)}>
            <Badge variant={cer === c ? "default" : "outline"}>
              <CeremoniaIcon ceremonia={c} className="h-3.5 w-3.5" />{" "}
              {CEREMONIA_LABEL[c]}
            </Badge>
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonGrid count={PAGE} />
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
          No hay dinámicas con esos filtros.
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((d) => (
              <div key={d._id} className="relative">
                <DynamicCard d={d} />
                <div className="absolute right-2 top-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 bg-background/60 backdrop-blur"
                        onClick={(e) => e.preventDefault()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {d.isSeed ? (
                        <DropdownMenuItem onClick={() => onClone(d)}>
                          <Copy className="mr-2 h-4 w-4" /> Clonar para editar
                        </DropdownMenuItem>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => openEdit(d)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onClone(d)}>
                            <Copy className="mr-2 h-4 w-4" /> Clonar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(d)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Borrar
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {/* Sentinel + indicador de carga incremental */}
          {!done && (
            <div
              ref={sentinelRef}
              className="flex items-center justify-center py-6 text-sm text-muted-foreground"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando más…
            </div>
          )}
        </>
      )}

      <DynamicEditor
        open={editorOpen}
        onOpenChange={(v) => {
          setEditorOpen(v);
          if (!v) refresh();
        }}
        dynamic={editing}
      />
    </div>
  );
}

function SkeletonGrid({ count }: { count: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="space-y-3 p-5">
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-14" />
          </div>
        </Card>
      ))}
    </div>
  );
}
