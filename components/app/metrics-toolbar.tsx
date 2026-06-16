"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Settings2, RefreshCw, HelpCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { saveIntegration, refreshMetrics } from "@/lib/actions/integrations";
import { IntegrationHelp } from "@/components/app/integration-help";
import type { IntegrationDTO } from "@/lib/dto";

type Provider = IntegrationDTO["provider"];

const PROVIDER_LABEL: Record<Provider, string> = {
  sample: "Datos de ejemplo",
  jira: "Jira",
  azure: "Azure DevOps",
  github: "GitHub (Projects v2)",
};

export function MetricsToolbar({
  projects,
  selectedProjectId,
  integration,
}: {
  projects: { _id: string; name: string }[];
  selectedProjectId: string;
  integration: IntegrationDTO;
}) {
  const router = useRouter();
  const [navPending, startNav] = useTransition();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"config" | "help">("config");
  const [saving, setSaving] = useState(false);

  function openChange(v: boolean) {
    setOpen(v);
    if (!v) setView("config"); // siempre volver a la config al cerrar
  }
  const [form, setForm] = useState({
    provider: integration.provider,
    baseUrl: integration.baseUrl ?? "",
    email: integration.email ?? "",
    token: "",
    project: integration.project ?? "",
    board: integration.board ?? "",
    githubBaseUrl: integration.githubBaseUrl ?? "",
    githubToken: "",
    githubOwner: integration.githubOwner ?? "",
    githubProjectNumber: integration.githubProjectNumber ?? "",
  });
  // Overlay de GitHub: activo si ya hay mapeo o token guardado.
  const [ghOn, setGhOn] = useState(
    Boolean(integration.hasGithubToken || integration.githubOwner),
  );

  function patch(p: Partial<typeof form>) {
    setForm((f) => ({ ...f, ...p }));
  }

  function selectProject(id: string) {
    startNav(() => router.push(`/app/metricas?project=${id}`));
  }

  function refresh() {
    startNav(async () => {
      await refreshMetrics();
      router.refresh();
    });
  }

  async function save() {
    setSaving(true);
    // El overlay sólo aplica con primario Jira/Azure; apagado o no aplicable →
    // limpiamos el mapeo del proyecto (el token guardado por usuario se conserva).
    const overlay = ghOn && (form.provider === "jira" || form.provider === "azure");
    const payload = {
      ...form,
      githubOwner: overlay ? form.githubOwner : "",
      githubProjectNumber: overlay ? form.githubProjectNumber : "",
    };
    const res = await saveIntegration(selectedProjectId, payload);
    setSaving(false);
    if (res.ok) {
      toast.success("Integración guardada");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(res.error ?? "Error");
    }
  }

  const isJira = form.provider === "jira";
  const isAzure = form.provider === "azure";
  const isGithub = form.provider === "github";
  const live = form.provider !== "sample";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={selectedProjectId} onValueChange={selectProject} disabled={navPending}>
        <SelectTrigger className="h-9 min-w-44">
          <SelectValue placeholder="Elegí un proyecto" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((p) => (
            <SelectItem key={p._id} value={p._id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" className="h-9 gap-1" onClick={refresh} disabled={navPending}>
        <RefreshCw className="h-4 w-4" /> Refrescar
      </Button>

      <Button variant="outline" className="h-9 gap-1" onClick={() => setOpen(true)}>
        <Settings2 className="h-4 w-4" /> Configurar
      </Button>

      <Dialog open={open} onOpenChange={openChange}>
        <DialogContent>
          {view === "help" ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setView("config")}
                    className="rounded-md p-1 hover:bg-muted"
                    aria-label="Volver"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  Cómo obtener los datos · {PROVIDER_LABEL[form.provider]}
                </DialogTitle>
                <DialogDescription>
                  Guía paso a paso para completar la configuración.
                </DialogDescription>
              </DialogHeader>

              <div className="max-h-[60vh] overflow-y-auto py-2 pr-1">
                <IntegrationHelp provider={form.provider} />
              </div>

              <DialogFooter>
                <Button onClick={() => setView("config")}>Volver a la configuración</Button>
              </DialogFooter>
            </>
          ) : (
            <>
          <DialogHeader>
            <DialogTitle>Integración del proyecto</DialogTitle>
            <DialogDescription>
              La conexión (URL y token) es tuya y se reutiliza en todos tus
              proyectos. El proyecto/board en la herramienta es propio de este
              proyecto.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Origen de datos</Label>
                <button
                  type="button"
                  onClick={() => setView("help")}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <HelpCircle className="h-3.5 w-3.5" /> ¿De dónde saco estos datos?
                </button>
              </div>
              <Select
                value={form.provider}
                onValueChange={(v) => patch({ provider: v as Provider })}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PROVIDER_LABEL) as Provider[]).map((p) => (
                    <SelectItem key={p} value={p}>
                      {PROVIDER_LABEL[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {live && (
              <>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="mb-3 text-xs font-medium text-muted-foreground">
                    Tu conexión (por usuario)
                  </p>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>
                        {isAzure
                          ? "Organización (URL base)"
                          : isGithub
                            ? "API base (opcional · sólo Enterprise)"
                            : "URL base"}
                      </Label>
                      <Input
                        value={form.baseUrl}
                        onChange={(e) => patch({ baseUrl: e.target.value })}
                        placeholder={
                          isJira
                            ? "https://tuempresa.atlassian.net"
                            : isGithub
                              ? "https://api.github.com"
                              : "https://dev.azure.com/tu-org"
                        }
                      />
                    </div>
                    {!isGithub && (
                      <div className="space-y-2">
                        <Label>{isAzure ? "Organización" : "Email"}</Label>
                        <Input
                          value={form.email}
                          onChange={(e) => patch({ email: e.target.value })}
                          placeholder={isJira ? "vos@empresa.com" : "tu-org"}
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>{isJira ? "API token" : "PAT"}</Label>
                      <Input
                        type="password"
                        value={form.token}
                        onChange={(e) => patch({ token: e.target.value })}
                        placeholder={
                          integration.hasToken
                            ? "•••••••• (dejá vacío para no cambiar)"
                            : "Pegá tu token"
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>{isGithub ? "Owner (org o usuario)" : "Proyecto"}</Label>
                    <Input
                      value={form.project}
                      onChange={(e) => patch({ project: e.target.value })}
                      placeholder={isJira ? "PROJ" : isGithub ? "mi-org" : "Mi proyecto"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      {isJira
                        ? "Board (rapidViewId)"
                        : isGithub
                          ? "Número del Project"
                          : "Team / board"}
                    </Label>
                    <Input
                      value={form.board}
                      onChange={(e) => patch({ board: e.target.value })}
                      placeholder={isJira ? "123" : isGithub ? "7" : "Mi equipo"}
                    />
                  </div>
                </div>

                {(isJira || isAzure) && (
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Sumar GitHub (overlay)</p>
                        <p className="text-xs text-muted-foreground">
                          Superpone Cycle/Lead Time y Aging desde un GitHub
                          Project. {PROVIDER_LABEL[form.provider]} sigue siendo el
                          ancla de Velocity/Predictibilidad.
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={ghOn}
                        onClick={() => setGhOn((v) => !v)}
                        className={`relative ml-3 h-5 w-9 shrink-0 rounded-full transition-colors ${
                          ghOn ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all ${
                            ghOn ? "left-[18px]" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    {ghOn && (
                      <div className="mt-3 space-y-3">
                        <div className="space-y-2">
                          <Label>PAT de GitHub</Label>
                          <Input
                            type="password"
                            value={form.githubToken}
                            onChange={(e) => patch({ githubToken: e.target.value })}
                            placeholder={
                              integration.hasGithubToken
                                ? "•••••••• (dejá vacío para no cambiar)"
                                : "Pegá tu PAT (scope read:project)"
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Owner (org o usuario)</Label>
                            <Input
                              value={form.githubOwner}
                              onChange={(e) => patch({ githubOwner: e.target.value })}
                              placeholder="mi-org"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Número del Project</Label>
                            <Input
                              value={form.githubProjectNumber}
                              onChange={(e) => patch({ githubProjectNumber: e.target.value })}
                              placeholder="7"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>API base (opcional · sólo Enterprise)</Label>
                          <Input
                            value={form.githubBaseUrl}
                            onChange={(e) => patch({ githubBaseUrl: e.target.value })}
                            placeholder="https://api.github.com"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
