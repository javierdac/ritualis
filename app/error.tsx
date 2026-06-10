"use client"; // Los error boundaries deben ser client components.

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FullPageMessage } from "@/components/full-page-message";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <FullPageMessage
      title="Algo salió mal"
      message="Ocurrió un error inesperado. Podés reintentar; si sigue pasando, volvé al inicio."
    >
      <div className="flex gap-2">
        <Button onClick={() => unstable_retry()}>Reintentar</Button>
        <Button variant="outline" asChild>
          <Link href="/">Ir al inicio</Link>
        </Button>
      </div>
    </FullPageMessage>
  );
}
