import type { RawSnapshot } from "./types";

/* Datos de ejemplo del "Dashboard Integration Team".
 * Reproducen el documento de referencia para que el dashboard se vea completo
 * sin necesidad de conectar Jira/Azure todavía. */

const CYCLE_ITEMS = [
  { id: "US-101", days: 2 },
  { id: "US-102", days: 3 },
  { id: "US-103", days: 5 },
  { id: "US-104", days: 12 },
];

const AGING_ITEMS = [
  { id: "US-201", days: 9 },
  { id: "US-202", days: 11 },
  { id: "US-203", days: 3 },
];

export function sampleSnapshot(): RawSnapshot {
  const cycleAvg =
    CYCLE_ITEMS.reduce((s, i) => s + i.days, 0) / CYCLE_ITEMS.length;
  const outlierThreshold = cycleAvg * 2; // regla del documento: 2x el promedio.

  return {
    summary: [
      { label: "Predictibilidad", current: "92%", average: "88%", status: "green" },
      { label: "Velocity", current: "38 pts", average: "36 pts", status: "green" },
      { label: "Cycle Time", current: "4.2 días", average: "5.1 días", status: "green" },
      { label: "Lead Time", current: "12 días", average: "15 días", status: "green" },
      { label: "Bugs Producción", current: "2", average: "3", status: "green" },
      { label: "Bloqueos", current: "5", average: "3", status: "yellow" },
    ],
    velocity: [
      { sprint: "S1", value: 35 },
      { sprint: "S2", value: 38 },
      { sprint: "S3", value: 33 },
      { sprint: "S4", value: 40 },
      { sprint: "S5", value: 37 },
    ],
    predictability: {
      target: 0.8,
      points: [
        { sprint: "S1", committed: 40, completed: 38 },
        { sprint: "S2", committed: 42, completed: 39 },
        { sprint: "S3", committed: 35, completed: 35 },
        { sprint: "S4", committed: 38, completed: 34 },
      ],
    },
    cycleTime: {
      avg: cycleAvg,
      items: CYCLE_ITEMS.map((i) => ({ ...i, outlier: i.days > outlierThreshold })),
    },
    aging: {
      threshold: outlierThreshold,
      items: AGING_ITEMS.map((i) => ({ ...i, outlier: i.days > outlierThreshold })),
    },
    blockers: [
      { reason: "Dependencia externa", count: 5 },
      { reason: "QA", count: 2 },
      { reason: "Ambiente", count: 4 },
      { reason: "Negocio", count: 1 },
    ],
    quality: [
      { sprint: "S1", qa: 5, prod: 1 },
      { sprint: "S2", qa: 7, prod: 0 },
      { sprint: "S3", qa: 4, prod: 2 },
      { sprint: "S4", qa: 3, prod: 0 },
    ],
    retro: [
      { area: "Delivery", status: "green" },
      { area: "Calidad", status: "green" },
      { area: "Flujo", status: "yellow" },
      { area: "Dependencias", status: "red" },
      { area: "Capacidad", status: "green" },
    ],
  };
}
