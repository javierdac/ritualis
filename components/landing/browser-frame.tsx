import { cn } from "@/lib/utils";

/**
 * Marco tipo ventana de navegador para envolver los mockups de la landing.
 * Es puramente decorativo (no es una captura real); se ve nítido en cualquier
 * tamaño y respeta el tema claro/oscuro.
 */
export function BrowserFrame({
  url,
  className,
  children,
}: {
  url: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/70 bg-card shadow-2xl shadow-primary/5 ring-1 ring-black/5 dark:ring-white/5",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/50 px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <div className="mx-auto flex w-1/2 max-w-xs items-center justify-center rounded-md bg-background/70 px-3 py-1 text-[11px] text-muted-foreground">
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}
