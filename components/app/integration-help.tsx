import { ExternalLink } from "lucide-react";
import type { IntegrationDTO } from "@/lib/dto";

type Provider = IntegrationDTO["provider"];

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
        {n}
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium leading-6">{title}</p>
        <div className="text-sm text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs">
          {children}
        </div>
      </div>
    </div>
  );
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

function JiraHelp() {
  return (
    <div className="space-y-4">
      <Step n={1} title="URL base">
        La dirección de tu Jira, la misma que ves en el navegador.
        <br />
        Jira Cloud: <code>https://tuempresa.atlassian.net</code>. Server/Data
        Center: la URL interna (ej. <code>https://jira.tuempresa.com</code>).
      </Step>
      <Step n={2} title="Email">
        El email de tu cuenta de Atlassian, con el que entrás a Jira.
      </Step>
      <Step n={3} title="API token (no es tu contraseña)">
        Entrá a{" "}
        <ExtLink href="https://id.atlassian.com/manage-profile/security/api-tokens">
          id.atlassian.com → API tokens
        </ExtLink>{" "}
        → <strong>Create API token</strong> → ponele un nombre (ej. “Ritualis”)
        → <strong>Create</strong>. Copiá el token (sólo se muestra una vez) y
        pegalo en el campo.
        <br />
        En Server/Data Center no hay API tokens: usá un{" "}
        <em>Personal Access Token</em> desde Perfil → Personal Access Tokens.
      </Step>
      <Step n={4} title="Proyecto (project key)">
        La clave corta en MAYÚSCULAS, no el nombre largo. Es el prefijo de cada
        issue: si tus tickets son <code>MOB-101</code>, el project key es{" "}
        <code>MOB</code>. También está en Project settings → Details.
      </Step>
      <Step n={5} title="Board (rapidViewId)">
        El ID numérico del board (de ahí salen los sprints y la velocity). Abrí
        tu board y mirá la URL:
        <br />
        <code>…/software/projects/MOB/boards/42</code> → el board es{" "}
        <code>42</code>.
      </Step>
    </div>
  );
}

function AzureHelp() {
  return (
    <div className="space-y-4">
      <Step n={1} title="URL base (organización)">
        La URL de tu organización de Azure DevOps:{" "}
        <code>https://dev.azure.com/tu-org</code>.
      </Step>
      <Step n={2} title="Organización">
        El nombre de la organización (lo que va después de{" "}
        <code>dev.azure.com/</code>). Ej.: <code>tu-org</code>.
      </Step>
      <Step n={3} title="PAT (Personal Access Token)">
        Entrá a{" "}
        <ExtLink href="https://dev.azure.com">dev.azure.com</ExtLink> → ícono de
        usuario → <strong>Personal access tokens</strong> →{" "}
        <strong>New Token</strong>. Dale permisos de lectura a{" "}
        <strong>Work Items</strong> y <strong>Analytics</strong>, creá y copiá
        el token (sólo se ve una vez).
      </Step>
      <Step n={4} title="Proyecto">
        El nombre del proyecto en Azure DevOps, tal cual aparece en la URL:{" "}
        <code>dev.azure.com/tu-org/<strong>MiProyecto</strong></code>.
      </Step>
      <Step n={5} title="Team / board">
        El nombre del equipo (team) cuyo board querés medir. Lo ves en{" "}
        <strong>Boards → Sprints</strong>, en el selector de equipo arriba a la
        izquierda.
      </Step>
    </div>
  );
}

function GithubHelp() {
  return (
    <div className="space-y-4">
      <Step n={1} title="Necesitás un GitHub Project (v2)">
        Las métricas de sprint no salen de los repos: salen de un{" "}
        <ExtLink href="https://docs.github.com/issues/planning-and-tracking-with-projects">
          GitHub Project
        </ExtLink>{" "}
        con un campo de tipo <strong>Iteration</strong> (los sprints) y un campo
        numérico de puntos (ej. <code>Story Points</code> / <code>Estimate</code>
        ). El campo <code>Status</code> (single-select) se usa para detectar
        “terminado” y “en progreso”.
      </Step>
      <Step n={2} title="API base (opcional)">
        Dejala vacía para github.com. Sólo completala en GitHub Enterprise
        Server: <code>https://tu-host/api</code>.
      </Step>
      <Step n={3} title="PAT (Personal Access Token)">
        Entrá a{" "}
        <ExtLink href="https://github.com/settings/tokens">
          github.com → Settings → Developer settings → Tokens
        </ExtLink>
        . Con un token <em>classic</em>, marcá los scopes <code>read:project</code>{" "}
        y <code>repo</code>. Con uno <em>fine-grained</em>, dale permiso de
        lectura a <strong>Projects</strong> (e Issues/Pull requests). Copiá el
        token (sólo se ve una vez).
      </Step>
      <Step n={4} title="Owner (organización o usuario)">
        Quién es dueño del Project. Si la URL es{" "}
        <code>github.com/orgs/<strong>mi-org</strong>/projects/7</code>, el owner
        es <code>mi-org</code>. Para un Project personal:{" "}
        <code>github.com/users/<strong>mi-usuario</strong>/projects/7</code>.
      </Step>
      <Step n={5} title="Número del Project">
        El número al final de la URL del Project:{" "}
        <code>…/projects/<strong>7</strong></code> → <code>7</code>.
      </Step>
    </div>
  );
}

export function IntegrationHelp({ provider }: { provider: Provider }) {
  if (provider === "sample") {
    return (
      <p className="text-sm text-muted-foreground">
        Los <strong>datos de ejemplo</strong> no necesitan configuración: el
        dashboard se llena con valores de muestra. Elegí Jira, Azure DevOps o
        GitHub para conectar datos reales y ver acá los pasos.
      </p>
    );
  }
  if (provider === "jira") return <JiraHelp />;
  if (provider === "github") return <GithubHelp />;
  return <AzureHelp />;
}
