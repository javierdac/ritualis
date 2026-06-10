import { RitualisMark } from "@/components/brand/ritualis-mark";

export function FullPageMessage({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <RitualisMark className="h-12 w-12 text-primary" />
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {children}
    </div>
  );
}
