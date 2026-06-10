import { cn } from "@/lib/utils";

/**
 * Isotipo de Ritualis: anillo de 5 segmentos (las 5 ceremonias Scrum)
 * con hueco pentagonal central. Hereda el color vía currentColor.
 */
export function RitualisMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("h-8 w-8", className)}
    >
      <g
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={6}
        strokeLinejoin="round"
      >
        <path d="M 54.75 26.45 L 54.75 6.26 A 44 44 0 0 1 90.13 31.97 L 70.93 38.21 Z" />
        <path d="M 73.86 47.24 L 93.07 41 A 44 44 0 0 1 79.55 82.6 L 67.68 66.26 Z" />
        <path d="M 60 71.84 L 71.87 88.18 A 44 44 0 0 1 28.13 88.18 L 40 71.84 Z" />
        <path d="M 32.32 66.26 L 20.45 82.6 A 44 44 0 0 1 6.93 41 L 26.14 47.24 Z" />
        <path d="M 29.07 38.21 L 9.87 31.97 A 44 44 0 0 1 45.25 6.26 L 45.25 26.45 Z" />
      </g>
    </svg>
  );
}
