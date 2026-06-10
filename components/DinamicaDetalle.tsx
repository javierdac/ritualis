"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import type { DynamicDTO } from "@/lib/dto";
import {
  CEREMONIA_LABEL,
  ENERGIA_LABEL,
  OBJETIVO_LABEL,
  type Ceremonia,
} from "@/lib/types";
import { CeremoniaIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StartSessionButton } from "@/components/app/start-session-button";

function fmt(seconds: number) {
  const m = Math.floor(Math.abs(seconds) / 60);
  const s = Math.abs(seconds) % 60;
  const sign = seconds < 0 ? "-" : "";
  return `${sign}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function DinamicaDetalle({ d }: { d: DynamicDTO }) {
  const [facilitando, setFacilitando] = useState(false);
  const [paso, setPaso] = useState(0);
  const [restante, setRestante] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pasoActual = d.pasos[paso];
  const dur = (pasoActual?.duracionMin ?? 0) * 60;

  const cargarPaso = useCallback(
    (i: number) => {
      const p = d.pasos[i];
      setRestante((p?.duracionMin ?? 0) * 60);
    },
    [d.pasos],
  );

  useEffect(() => {
    if (!corriendo) return;
    intervalRef.current = setInterval(() => setRestante((r) => r - 1), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [corriendo]);

  useEffect(() => {
    if (corriendo && restante === 0 && dur > 0) {
      try {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = new Ctx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 660;
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } catch {
        /* sin audio, no pasa nada */
      }
    }
  }, [restante, corriendo, dur]);

  const iniciar = () => {
    setFacilitando(true);
    setPaso(0);
    cargarPaso(0);
    setCorriendo(true);
  };

  const irA = (i: number) => {
    const clamped = Math.max(0, Math.min(d.pasos.length - 1, i));
    setPaso(clamped);
    cargarPaso(clamped);
    setCorriendo(true);
  };

  const salir = () => {
    setFacilitando(false);
    setCorriendo(false);
  };

  const progreso = dur > 0 ? Math.max(0, Math.min(100, (restante / dur) * 100)) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/app/dinamicas"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a dinámicas
      </Link>

      <header>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {d.ceremonias.map((c) => (
            <Badge key={c} variant="secondary">
              <CeremoniaIcon
                ceremonia={c as Ceremonia}
                className="h-3.5 w-3.5"
              />{" "}
              {CEREMONIA_LABEL[c as keyof typeof CEREMONIA_LABEL]}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{d.nombre}</h1>
        <p className="mt-2 text-muted-foreground">{d.resumen}</p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>⏱️ {d.duracionMin} min</span>
          <span>
            👥 {d.equipoMin}–{d.equipoMax} personas
          </span>
          <span>⚡ Energía {ENERGIA_LABEL[d.energia].toLowerCase()}</span>
          {d.presencial && <span>🏢 Presencial</span>}
          {d.remoto && <span>💻 Remoto</span>}
        </div>

        {d.objetivos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {d.objetivos.map((o) => (
              <Badge key={o} variant="outline" className="text-primary">
                {OBJETIVO_LABEL[o as keyof typeof OBJETIVO_LABEL] ?? o}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {!facilitando ? (
        <>
          {d.materiales.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Materiales
              </h2>
              <div className="flex flex-wrap gap-2">
                {d.materiales.map((m) => (
                  <span
                    key={m}
                    className="rounded-lg bg-muted px-3 py-1.5 text-sm"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Paso a paso
            </h2>
            <ol className="space-y-3">
              {d.pasos.map((p, i) => (
                <li key={i}>
                  <Card className="flex flex-row gap-4 p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h3 className="font-semibold">{p.titulo}</h3>
                        {p.duracionMin ? (
                          <span className="text-xs text-muted-foreground">
                            · {p.duracionMin} min
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {p.detalle}
                      </p>
                    </div>
                  </Card>
                </li>
              ))}
            </ol>
          </section>

          {d.tips.length > 0 && (
            <Card className="border-primary/30 bg-primary/5 p-5">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                💡 Tips de facilitación
              </h2>
              <ul className="list-disc space-y-1.5 pl-5 text-sm">
                {d.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </Card>
          )}

          <div className="space-y-3">
            {d.columns && d.columns.length > 0 && (
              <StartSessionButton dynamicId={d._id} />
            )}
            <Button
              onClick={iniciar}
              size="lg"
              variant={d.columns && d.columns.length > 0 ? "outline" : "default"}
              className="w-full gap-2"
            >
              <Play className="h-5 w-5" /> Modo facilitador (solo timer)
            </Button>
          </div>
        </>
      ) : (
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Paso {paso + 1} de {d.pasos.length}
            </span>
            <Button variant="ghost" size="sm" onClick={salir} className="gap-1">
              <X className="h-4 w-4" /> Salir
            </Button>
          </div>

          <div className="mb-6 text-center">
            <div
              className={`text-7xl font-bold tabular-nums tracking-tight ${
                restante < 0 ? "text-accent" : ""
              }`}
            >
              {dur > 0 ? fmt(restante) : "—"}
            </div>
            {dur > 0 && (
              <div className="mx-auto mt-4 h-2 max-w-md overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            )}
            {restante < 0 && (
              <p className="mt-2 text-sm text-accent">
                Tiempo cumplido · seguís en juego
              </p>
            )}
          </div>

          <div className="mb-6 rounded-xl bg-muted/60 p-5">
            <div className="flex flex-wrap items-baseline gap-2">
              <h2 className="text-xl font-semibold">{pasoActual.titulo}</h2>
              {pasoActual.duracionMin ? (
                <span className="text-sm text-muted-foreground">
                  · {pasoActual.duracionMin} min sugeridos
                </span>
              ) : null}
            </div>
            <p className="mt-2">{pasoActual.detalle}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => irA(paso - 1)}
              disabled={paso === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>
            <Button onClick={() => setCorriendo((c) => !c)} className="gap-1">
              {corriendo ? (
                <>
                  <Pause className="h-4 w-4" /> Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Reanudar
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => cargarPaso(paso)} className="gap-1">
              <RotateCcw className="h-4 w-4" /> Reiniciar
            </Button>
            {paso < d.pasos.length - 1 ? (
              <Button variant="outline" onClick={() => irA(paso + 1)} className="gap-1">
                Siguiente <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={salir} className="gap-1">
                <Check className="h-4 w-4" /> Terminar
              </Button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {d.pasos.map((p, i) => (
              <button
                key={i}
                onClick={() => irA(i)}
                title={p.titulo}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === paso
                    ? "scale-125 bg-primary"
                    : i < paso
                      ? "bg-primary/40"
                      : "bg-muted"
                }`}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
