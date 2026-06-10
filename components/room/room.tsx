"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Centered } from "./centered";
import { JoinScreen } from "./join-screen";
import { Board } from "./board";
import type { RoomState } from "./types";

export function Room({ code, defaultName }: { code: string; defaultName?: string }) {
  const [state, setState] = useState<RoomState | null>(null);
  const [notFound, setNotFound] = useState(false);
  const storageKey = `ritualis-room-${code}`;
  const pollFailures = useRef(0);

  const poll = useCallback(async () => {
    try {
      const t = localStorage.getItem(storageKey);
      const url = `/api/sessions/${code}${t ? `?t=${t}` : ""}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      setState(data);
      pollFailures.current = 0;
    } catch {
      // Un blip de red aislado es esperable; avisamos recién al tercer
      // fallo consecutivo para no spamear.
      pollFailures.current += 1;
      if (pollFailures.current === 3) {
        toast.error("Se perdió la conexión con la sala. Reintentando…");
      }
    }
  }, [code, storageKey]);

  // Polling del estado de la sala (suscripción a sistema externo).
  useEffect(() => {
    const tick = () => void poll();
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1300);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [poll]);

  const op = useCallback(
    async (payload: Record<string, unknown>) => {
      const t = localStorage.getItem(storageKey);
      const res = await fetch(`/api/sessions/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, token: t }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Error");
        return null;
      }
      if (data.session) setState(data);
      return data;
    },
    [code, storageKey],
  );

  async function join(name: string) {
    const res = await fetch(`/api/sessions/${code}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op: "join", name }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "No se pudo entrar");
      return;
    }
    localStorage.setItem(storageKey, data.token);
    await poll();
  }

  if (notFound) {
    return (
      <Centered>
        <p className="text-muted-foreground">Esta sala no existe o fue cerrada.</p>
      </Centered>
    );
  }

  if (!state) {
    return (
      <Centered>
        <p className="text-muted-foreground">Cargando sala…</p>
      </Centered>
    );
  }

  if (!state.authenticated) {
    return (
      <JoinScreen
        dynamicName={state.session.dynamicName}
        defaultName={defaultName}
        onJoin={join}
      />
    );
  }

  return <Board state={state} op={op} code={code} />;
}
