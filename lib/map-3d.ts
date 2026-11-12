import type { MapSectorId } from "@/lib/map-sectors";

/** Punto del plano 2D original (viewBox 780x980). La geometría 3D sale de estas mismas coordenadas. */
export type Pt = [number, number];

export const PLAN_SCALE = 0.1; // 1 unidad del plano = 0.1 unidades del mundo 3D
const PLAN_CENTER: Pt = [400, 480];

/** Rectángulo del plano que ocupa el local: las paredes de ladrillo se ajustan a este borde. */
export const LOCAL_BOUNDS = { x0: 55, x1: 745, y0: 45, y1: 915 };
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
  // Se expande hacia el lado del azul (el plano original llegaba hasta x=245)
  backstage: { level: 3, height: BOX_H, points: rect(220, 803, 337, 102) },
};

export interface Sofa {
  /** Rectángulo que ocupa el sillón. */
  points: Pt[];
  /** Lado del respaldo, o sea donde está la pared: n = arriba del plano, s = abajo, e = derecha, w = izquierda. */
  back: "n" | "s" | "e" | "w";
}

const sofa = (x: number, y: number, w: number, h: number, back: Sofa["back"]): Sofa => ({ points: rect(x, y, w, h), back });

/** Sillones sobre cada sector, siempre con el respaldo contra la pared. */
export const SOFAS: Partial<Record<MapSectorId, Sofa[]>> = {
  golden: [sofa(360, 62, 42, 32, "n"), sofa(412, 62, 42, 32, "n"), sofa(691, 185, 38, 32, "e"), sofa(691, 245, 38, 32, "e"), sofa(691, 305, 38, 32, "e")],
  // Pegados a la pared izquierda del local
  "box-1": [sofa(72, 365, 36, 30, "w")],
  "box-2": [sofa(72, 431, 36, 30, "w")],
  "box-3": [sofa(72, 497, 36, 30, "w")],
  "box-4": [sofa(72, 563, 36, 30, "w")],
  "box-5": [sofa(72, 629, 36, 30, "w")],
  "ultra-box-1": [sofa(694, 376, 30, 40, "e")],
  "ultra-box-2": [sofa(694, 476, 30, 40, "e")],
  "ultra-box-3": [sofa(694, 576, 30, 40, "e")],
};

const BACKREST = 9; // grosor del respaldo, en unidades del plano

/** Divide un sillón en el asiento y su respaldo. */
export function sofaParts({ points, back }: Sofa): { seat: Pt[]; backrest: Pt[] } {
  const [x, y] = points[0];
  const [x2, y2] = points[2];
  const w = x2 - x;
  const h = y2 - y;
  switch (back) {
    case "n": return { backrest: rect(x, y, w, BACKREST), seat: rect(x, y + BACKREST, w, h - BACKREST) };
    case "s": return { backrest: rect(x, y2 - BACKREST, w, BACKREST), seat: rect(x, y, w, h - BACKREST) };
    case "w": return { backrest: rect(x, y, BACKREST, h), seat: rect(x + BACKREST, y, w - BACKREST, h) };
    case "e": return { backrest: rect(x2 - BACKREST, y, BACKREST, h), seat: rect(x, y, w - BACKREST, h) };
  }
}

/** Mesa baja frente al sillón, del lado opuesto al respaldo (la mesa negra con la cristalería, como en el local). */
export function tableFor({ points, back }: Sofa): Pt[] {
  const [x, y] = points[0];
  const [x2, y2] = points[2];
  const gap = 8;
  const depth = 26;
  switch (back) {
    case "w": return rect(x2 + gap, y + 4, depth, y2 - y - 8);
    case "e": return rect(x - gap - depth, y + 4, depth, y2 - y - 8);
    case "n": return rect(x + 4, y2 + gap, x2 - x - 8, depth);
    case "s": return rect(x + 4, y - gap - depth, x2 - x - 8, depth);
  }
}

/** Divisores bajos y oscuros entre box y box. */
export const DIVIDERS: { level: number; points: Pt[] }[] = [
  ...[410, 476, 542, 608].map((y) => ({ level: 2, points: rect(70, y, 128, 6) })),
  { level: 3, points: rect(637, 442, 93, 8) },
  { level: 3, points: rect(637, 542, 93, 8) },
];

/** Suelo de cada piso. El nivel 0 es la pista; el resto son entrepisos que la rodean. */
export const LEVEL_FLOORS: Pt[][] = [
  [[198, 350], [470, 350], [525, 405], [525, 705], [245, 705], [198, 658]],
  // El entrepiso sigue por la derecha, bajo el piso 4: llega hasta el borde de la pista principal (x=525 y su diagonal)
  // y hasta donde empieza la escalera al cuarto (y=745)
  [[60, 50], [730, 50], [730, 745], [525, 745], [525, 405], [470, 350], [60, 350]],
  // El piso azul termina donde terminan los sectores (boxes hasta x=198, standing hasta x=245)
  [[70, 350], [198, 350], [198, 680], [220, 680], [245, 705], [245, 905], [70, 905]],
  // Sin el hueco de la cabina (más abajo, a la altura del piso 3) ni el de su escalera: el piso 4 empieza donde la escalera termina (x=557)
  [[637, 350], [730, 350], [730, 905], [220, 905], [220, 800], [557, 800], [557, 705], [637, 705]],
];

export type PropId = "barraCanada" | "barraBaja" | "barraUltra" | "cabina" | "barraPrincipal";

export interface PropShape {
  label: string;
  /** Piso del plano en que se muestra (y con el que se atenúa al enfocar otro). */
  level: number;
  /** Piso cuya altura ocupa. */
  elevation: number;
  points: Pt[];
  height: number;
  /** Estante de botellas iluminado contra la pared, detrás de la barra. */
  shelf?: Pt[];
}

/** Elementos del local que no se reservan. */
export const PROPS: Record<PropId, PropShape> = {
  // Barra del entrepiso: rectangular (en el plano 2D original era un trapecio)
  barraCanada: { label: "Barra Cañada", level: 1, elevation: 1, points: rect(150, 50, 190, 115), height: 1.1, shelf: rect(150, 50, 190, 8) },
  // Abajo del piso 4: otra barra, a la altura del entrepiso
  barraBaja: { label: "Barra", level: 1, elevation: 1, points: rect(690, 640, 35, 95), height: 1.1, shelf: rect(717, 640, 8, 95) },
  barraUltra: { label: "Barra", level: 3, elevation: 3, points: rect(685, 745, 40, 150), height: 1.1, shelf: rect(717, 745, 8, 150) },
  // No se vende, pero marca el lugar del DJ: lleva etiqueta fija
  cabina: { label: "Cabina", level: 3, elevation: 2, points: rect(245, 705, 265, 95), height: 1.2 },
  // Abajo de los boxes del tercer piso, contra la pared
  barraPrincipal: { label: "Barra Principal", level: 0, elevation: 0, points: rect(70, 380, 45, 270), height: 1.1, shelf: rect(70, 380, 8, 270) },
};

/** La cabina se ve en el plano del piso 4, pero está a la altura del piso 3: lleva su propia plataforma. */
export const CABINA_PLATFORM = { level: 3, elevation: 2, points: PROPS.cabina.points };

export interface Box { x: number; y: number; w: number; h: number }

export interface StairRun {
  /** Zona del plano que ocupa la escalera. */
  box: Box;
  from: number;
  to: number;
  /** Eje del plano en que corren los escalones. */
  axis: "x" | "y";
  /** Sentido en que sube sobre ese eje: -1 hacia donde decrece la coordenada, 1 hacia donde crece. */
  dir: -1 | 1;
}

export const STAIRS: StairRun[] = [
  { box: { x: 170, y: 350, w: 80, h: 70 }, from: 0, to: 1, axis: "y", dir: -1 },
  { box: { x: 70, y: 292, w: 130, h: 58 }, from: 1, to: 2, axis: "y", dir: 1 },
  // Después de la cabina: sube de su altura (piso 3) al piso 4
  { box: { x: 510, y: 745, w: 47, h: 55 }, from: 2, to: 3, axis: "x", dir: 1 },
];

/**
 * Bordes de un piso que dan al vacío. Los que corren pegados a una pared del local no llevan baranda ni neón.
 */
export function openEdges(points: Pt[]): [Pt, Pt][] {
  const { x0, x1, y0, y1 } = LOCAL_BOUNDS;
  const cerca = (v: number, borde: number) => Math.abs(v - borde) <= 15;
  const bordes: [Pt, Pt][] = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const sobrePared =
      (cerca(a[0], x0) && cerca(b[0], x0)) ||
      (cerca(a[0], x1) && cerca(b[0], x1)) ||
      (cerca(a[1], y0) && cerca(b[1], y0)) ||
      (cerca(a[1], y1) && cerca(b[1], y1));
    if (!sobrePared) bordes.push([a, b]);
  }
  return bordes;
}

/** Centro (en el plano) de cada piso, para apuntar la cámara. */
export function levelCenter(level: number): Pt {
  const pts = LEVEL_FLOORS[level];
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
}
