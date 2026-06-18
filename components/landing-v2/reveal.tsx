"use client";

import { motion, type Variants } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Bloque que aparece al entrar en viewport: sube y se desvanece.
 * `delay` permite escalonar varios reveals en una misma sección.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "span" | "li";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

const wordContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const wordChild: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE },
  },
};

/**
 * Título tipográfico al estilo specimen: cada palabra entra escalonada,
 * con un leve desenfoque que se resuelve. Las palabras envueltas en
 * `**...**` se pintan con el gradiente de marca.
 */
export function WordReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <motion.h1
      className={className}
      variants={wordContainer}
      initial="hidden"
      animate="show"
    >
      {words.map((raw, i) => {
        const brand = raw.startsWith("**") && raw.endsWith("**");
        const word = brand ? raw.slice(2, -2) : raw;
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em]">
            <motion.span
              variants={wordChild}
              className={
                "inline-block " + (brand ? "text-brand" : "")
              }
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        );
      })}
    </motion.h1>
  );
}
