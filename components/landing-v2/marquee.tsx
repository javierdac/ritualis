"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Marquesina tipográfica infinita (estilo specimen). Repite las palabras
 * y las desplaza en loop continuo. Se frena con `prefers-reduced-motion`.
 */
export function Marquee({
  items,
  duration = 28,
}: {
  items: string[];
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const row = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-border/60 py-6">
      <motion.div
        className="flex w-max items-center gap-10 whitespace-nowrap"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {row.map((word, i) => (
          <span
            key={i}
            className="font-brand text-4xl uppercase tracking-[0.12em] text-muted-foreground/70 sm:text-6xl"
          >
            {word}
            <span className="mx-10 text-accent">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
