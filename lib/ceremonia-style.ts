import type { Ceremonia } from "./types";

/**
 * Identidad de color por ceremonia. Clases completas (no dinámicas) para que
 * Tailwind las detecte en build.
 */
export const CEREMONIA_STYLE: Record<
  Ceremonia,
  {
    chip: string; // chip de ícono (fondo + texto)
    badge: string; // badge chico
    gradient: string; // gradiente para hero/encabezado
    bar: string; // barra/acento sólido
    glow: string; // sombra de color en hover
  }
> = {
  daily: {
    chip: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    badge:
      "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    gradient: "from-amber-500/25 via-amber-500/5 to-transparent",
    bar: "bg-amber-500",
    glow: "hover:shadow-amber-500/15",
  },
  planning: {
    chip: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    badge: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    gradient: "from-sky-500/25 via-sky-500/5 to-transparent",
    bar: "bg-sky-500",
    glow: "hover:shadow-sky-500/15",
  },
  review: {
    chip: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    badge:
      "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
    gradient: "from-violet-500/25 via-violet-500/5 to-transparent",
    bar: "bg-violet-500",
    glow: "hover:shadow-violet-500/15",
  },
  retro: {
    chip: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    badge:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    gradient: "from-emerald-500/25 via-emerald-500/5 to-transparent",
    bar: "bg-emerald-500",
    glow: "hover:shadow-emerald-500/15",
  },
  refinement: {
    chip: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    badge: "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    gradient: "from-rose-500/25 via-rose-500/5 to-transparent",
    bar: "bg-rose-500",
    glow: "hover:shadow-rose-500/15",
  },
};
