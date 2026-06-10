import { RitualisMark } from "@/components/brand/ritualis-mark";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="dotgrid pointer-events-none fixed inset-0 opacity-50" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <RitualisMark className="mb-4 h-14 w-14 text-primary drop-shadow-lg" />
          <h1 className="font-brand text-3xl tracking-[0.18em] text-foreground">
            RITUALIS
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dinámicas para todas las ceremonias Scrum
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
