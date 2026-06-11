"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { OpFn } from "./types";

/** Input del facilitador para sumar a alguien sin dispositivo a la ronda. */
export function AddPerson({ op }: { op: OpFn }) {
  const [name, setName] = useState("");

  async function add() {
    if (!name.trim()) return;
    const res = await op({ op: "addPerson", name: name.trim() });
    if (res) setName("");
  }

  return (
    <div className="flex gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Sumar a alguien sin compu…"
        className="h-9"
        onKeyDown={(e) => {
          if (e.key === "Enter") add();
        }}
      />
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0"
        disabled={!name.trim()}
        onClick={add}
        title="Agregar a la ronda"
      >
        <UserPlus className="h-4 w-4" />
      </Button>
    </div>
  );
}
