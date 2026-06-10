"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RitualisMark } from "@/components/brand/ritualis-mark";
import { Centered } from "./centered";

export function JoinScreen({
  dynamicName,
  defaultName,
  onJoin,
}: {
  dynamicName: string;
  defaultName?: string;
  onJoin: (name: string) => void;
}) {
  const [name, setName] = useState(defaultName ?? "");
  const [busy, setBusy] = useState(false);
  return (
    <Centered>
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-xl">
        <RitualisMark className="mx-auto mb-3 h-12 w-12 text-primary" />
        <h1 className="text-center text-xl font-bold">{dynamicName}</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Entrá a la sesión en vivo
        </p>
        <div className="mt-5 space-y-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            onKeyDown={(e) => e.key === "Enter" && name.trim() && onJoin(name.trim())}
            autoFocus
          />
          <Button
            className="w-full"
            disabled={!name.trim() || busy}
            onClick={async () => {
              setBusy(true);
              await onJoin(name.trim());
              setBusy(false);
            }}
          >
            Entrar
          </Button>
        </div>
      </div>
    </Centered>
  );
}
