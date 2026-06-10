"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Radio } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startSession } from "@/lib/actions/sessions";

export function StartSessionButton({ dynamicId }: { dynamicId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <Button
      size="lg"
      className="w-full gap-2"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await startSession(dynamicId);
          if (res.ok && res.code) {
            router.push(`/s/${res.code}`);
          } else {
            toast.error(res.error ?? "No se pudo crear la sala");
          }
        })
      }
    >
      <Radio className="h-5 w-5" />
      {pending ? "Creando sala…" : "Iniciar sesión en vivo"}
    </Button>
  );
}
