import type { MapSectorId } from "@/lib/map-sectors";

/** Punto del plano 2D original (viewBox 780x980). La geometría 3D sale de estas mismas coordenadas. */
export type Pt = [number, number];

export const PLAN_SCALE = 0.1; // 1 unidad del plano = 0.1 unidades del mundo 3D
const PLAN_CENTER: Pt = [400, 480];

/** Altura del suelo de cada piso (índice = `MapLevel.index`). */
export const LEVEL_HEIGHT = [0, 4, 8, 12] as const;

export function planToWorld([x, y]: Pt): [number, number] {
  return [(x - PLAN_CENTER[0]) * PLAN_SCALE, (y - PLAN_CENTER[1]) * PLAN_SCALE];
}

const rect = (x: number, y: number, w: number, h: number): Pt[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

export interface SectorShape {
  points: Pt[];
  level: number;
  /** Alto del volumen sobre el suelo del piso. */
  height: number;
}

const BOX_H = 0.5;
const STANDING_H = 0.14;

export const SECTOR_SHAPES: Record<MapSectorId, SectorShape> = {
  golden: { level: 1, height: BOX_H, points: [[345, 50], [730, 50], [730, 350], [650, 350], [650, 165], [345, 165]] },
  "box-1": { level: 2, height: BOX_H, points: rect(70, 350, 128, 60) },
  "box-2": { level: 2, height: BOX_H, points: rect(70, 416, 128, 60) },
  "box-3": { level: 2, height: BOX_H, points: rect(70, 482, 128, 60) },
  "box-4": { level: 2, height: BOX_H, points: rect(70, 548, 128, 60) },
  "box-5": { level: 2, height: BOX_H, points: rect(70, 614, 128, 60) },
  "vip-n3-standing": { level: 2, height: STANDING_H, points: [[70, 680], [220, 680], [245, 705], [245, 905], [70, 905]] },
  "ultra-box-1": { level: 3, height: BOX_H, points: rect(637, 350, 93, 92) },
  "ultra-box-2": { level: 3, height: BOX_H, points: rect(637, 450, 93, 92) },
  "ultra-box-3": { level: 3, height: BOX_H, points: rect(637, 550, 93, 92) },
  "ultra-standing": { level: 3, height: STANDING_H, points: [[637, 646], [730, 646], [730, 905], [557, 905], [557, 803], [637, 803]] },
  backstage: { level: 3, height: BOX_H, points: rect(245, 803, 312, 102) },
};

/** Suelo de cada piso. El nivel 0 es la pista; el resto son entrepisos que la rodean. */
export const LEVEL_FLOORS: Pt[][] = [
  [[198, 350], [470, 350], [525, 405], [525, 705], [245, 705], [198, 658]],
  rect(60, 50, 670, 300),
  rect(70, 350, 175, 555),
  [[637, 350], [730, 350], [730, 905], [245, 905], [245, 705], [637, 705]],
];

/** Elementos del local que no se reservan. */
export const PROPS = {
  barraCanada: { level: 1, points: [[150, 50], [340, 50], [340, 165], [95, 165]] as Pt[], height: 1.1 },
  barraUltra: { level: 3, points: rect(685, 745, 40, 150), height: 1.1 },
  cabina: { level: 3, points: rect(245, 705, 265, 95), height: 1.2 },
};

export interface StairRun {
  /** Zona del plano que ocupa la escalera. */
  box: { x: number; y: number; w: number; h: number };
  from: number;
  to: number;
  /** Sentido en que sube: -1 hacia arriba del plano (y decrece), 1 hacia abajo. */
  dir: -1 | 1;
}

export const STAIRS: StairRun[] = [
  { box: { x: 200, y: 350, w: 50, h: 42 }, from: 0, to: 1, dir: -1 },
  { box: { x: 70, y: 292, w: 130, h: 58 }, from: 1, to: 2, dir: 1 },
];

/** Centro (en el plano) de cada piso, para apuntar la cámara. */
export function levelCenter(level: number): Pt {
  const pts = LEVEL_FLOORS[level];
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
}
