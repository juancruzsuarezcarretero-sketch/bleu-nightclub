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
  // Mitad del ancho que tenía (337): queda del lado de la escalera, que es donde termina en x=557
  backstage: { level: 3, height: BOX_H, points: rect(389, 803, 168, 102) },
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
  // El pedazo de abajo (el del backstage) mide la mitad: llega hasta x=389
  [[637, 350], [730, 350], [730, 905], [389, 905], [389, 800], [557, 800], [557, 705], [637, 705]],
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
  // Abajo del piso 4: otra barra, a la altura del entrepiso, desde donde termina el golden VIP (y=350) hasta el fondo del entrepiso
  barraBaja: { label: "Barra", level: 1, elevation: 1, points: rect(690, 350, 35, 385), height: 1.1, shelf: rect(717, 350, 8, 385) },
  barraUltra: { label: "Barra", level: 3, elevation: 3, points: rect(685, 745, 40, 150), height: 1.1, shelf: rect(717, 745, 8, 150) },
  // No se vende, pero marca el lugar del DJ: lleva etiqueta fija
  cabina: { label: "Cabina", level: 3, elevation: 2, points: rect(245, 705, 265, 95), height: 1.2 },
  // Abajo de los boxes del tercer piso, contra la pared
  barraPrincipal: { label: "Barra Principal", level: 0, elevation: 0, points: rect(70, 380, 45, 270), height: 1.1, shelf: rect(70, 380, 8, 270) },
};

/** Rectángulo con las esquinas indicadas redondeadas (radio `r`, en unidades del plano), como polígono recorrido en el sentido de las agujas del reloj. */
export function roundedRect(x: number, y: number, w: number, h: number, r: number, round: { nw?: boolean; ne?: boolean; se?: boolean; sw?: boolean }): Pt[] {
  const PASOS = 6;
  const esquina = (redonda: boolean | undefined, cx: number, cy: number, a0: number, punto: Pt): Pt[] => {
    if (!redonda) return [punto];
    return Array.from({ length: PASOS + 1 }, (_, i) => {
      const a = a0 + ((Math.PI / 2) * i) / PASOS;
      return [Math.round((cx + r * Math.cos(a)) * 100) / 100, Math.round((cy + r * Math.sin(a)) * 100) / 100] as Pt;
    });
  };
  return [
    ...esquina(round.nw, x + r, y + r, Math.PI, [x, y]),
    ...esquina(round.ne, x + w - r, y + r, (3 * Math.PI) / 2, [x + w, y]),
    ...esquina(round.se, x + w - r, y + h - r, 0, [x + w, y + h]),
    ...esquina(round.sw, x + r, y + h - r, Math.PI / 2, [x, y + h]),
  ];
}

/**
 * Doble cabina de DJ, como en el local: dos mesas rectangulares una al lado de la otra, con las puntas que dan al
 * medio redondeadas. Van en el borde de la plataforma que mira a la pista general (el norte) y no ocupan toda su
 * profundidad: atrás queda lugar para los DJ.
 */
export const CABINAS: Pt[][] = [
  roundedRect(258, 708, 105, 48, 20, { ne: true, se: true }),
  roundedRect(392, 708, 105, 48, 20, { nw: true, sw: true }),
];

/** La cabina se ve en el plano del piso 4, pero está a la altura del piso 3: lleva su propia plataforma. */
export const CABINA_PLATFORM = { level: 3, elevation: 2, points: PROPS.cabina.points };

export interface Box { x: number; y: number; w: number; h: number }

/** Puerta (hueco de la baranda) entre el piso azul y la cabina, a mitad de su lado oeste. */
export const PUERTA_CABINA: Box = { x: 235, y: 740.5, w: 20, h: 24 };

/** Baranda que separa el piso azul de la cabina (x=245, el lado oeste de la cabina), con la puerta en el medio. */
export const BARANDA_CABINA: [Pt, Pt][] = [
  [[245, 705], [245, PUERTA_CABINA.y]],
  [[245, PUERTA_CABINA.y + PUERTA_CABINA.h], [245, 800]],
];

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
  // Arranca en el margen derecho del piso azul (x=245) y sigue hacia la derecha, para no quedar debajo de él
  { box: { x: 245, y: 350, w: 80, h: 70 }, from: 0, to: 1, axis: "y", dir: -1 },
  { box: { x: 70, y: 292, w: 130, h: 58 }, from: 1, to: 2, axis: "y", dir: 1 },
  // Después de la cabina: sube de su altura (piso 3) al piso 4
  { box: { x: 510, y: 745, w: 47, h: 55 }, from: 2, to: 3, axis: "x", dir: 1 },
];

/**
 * Bordes de un piso que dan al vacío. Los que corren pegados a una pared del local no llevan baranda ni neón.
 */
export function openEdges(points: Pt[]): [Pt, Pt][] {
  return partirBordes(points).abiertos;
}

export interface WallSegment {
  /** Extremos del tramo, ya pegados a la pared (sobre `LOCAL_BOUNDS`). */
  a: Pt;
  b: Pt;
  /** Dirección hacia adentro del local, en el plano. */
  inward: Pt;
}

/** Bordes de un piso que corren pegados a una pared del local, llevados a la pared misma. */
export function wallEdges(points: Pt[]): WallSegment[] {
  return partirBordes(points).paredes;
}

function partirBordes(points: Pt[]) {
  const { x0, x1, y0, y1 } = LOCAL_BOUNDS;
  const cerca = (v: number, borde: number) => Math.abs(v - borde) <= 15;
  const abiertos: [Pt, Pt][] = [];
  const paredes: WallSegment[] = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    if (cerca(a[0], x0) && cerca(b[0], x0)) paredes.push({ a: [x0, a[1]], b: [x0, b[1]], inward: [1, 0] });
    else if (cerca(a[0], x1) && cerca(b[0], x1)) paredes.push({ a: [x1, a[1]], b: [x1, b[1]], inward: [-1, 0] });
    else if (cerca(a[1], y0) && cerca(b[1], y0)) paredes.push({ a: [a[0], y0], b: [b[0], y0], inward: [0, 1] });
    else if (cerca(a[1], y1) && cerca(b[1], y1)) paredes.push({ a: [a[0], y1], b: [b[0], y1], inward: [0, -1] });
    else abiertos.push([a, b]);
  }
  return { abiertos, paredes };
}

/** Centro (en el plano) de cada piso, para apuntar la cámara. */
export function levelCenter(level: number): Pt {
  const pts = LEVEL_FLOORS[level];
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
}

/** Altura de los ojos sobre el techo del sector (1 unidad del mundo ≈ 0,75 m). */
export const EYE_HEIGHT = 2.2;

/** Desde dónde se mira (`eye`) y hacia dónde (`look`), en coordenadas del mundo. */
export interface Vista {
  eye: [number, number, number];
  look: [number, number, number];
}

const dentro = ([x, y]: Pt, poly: Pt[]) => {
  let r = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) r = !r;
  }
  return r;
};

/** Lo que se mira desde un piso: la pista desde los pisos de arriba y la cabina desde la pista. */
function miradaDesdePiso(level: number, ex: number, ez: number): [number, number, number] {
  const [px, pz] = planToWorld(levelCenter(0));
  if (level !== 0) return [px, 1.2, pz];
  const [cx, cz] = planToWorld(PROPS.cabina.points.reduce<Pt>((a, p, _, t) => [a[0] + p[0] / t.length, a[1] + p[1] / t.length], [0, 0]));
  const lejos = Math.hypot(cx - ex, cz - ez) > 3;
  return lejos ? [cx, LEVEL_HEIGHT[2] + 1.5, cz] : [px, 1.2, pz];
}

/** Vista de alguien parado en un punto cualquiera de un piso (en coordenadas del mundo). */
export function viewpointAt(level: number, x: number, z: number): Vista {
  return { eye: [x, LEVEL_HEIGHT[level] + EYE_HEIGHT, z], look: miradaDesdePiso(level, x, z) };
}

/** Sectores amplios (varios palcos o zona standing) donde la vista sale del punto exacto que se toca. */
export const SECTORES_LIBRES: MapSectorId[] = ["golden", "vip-n3-standing", "ultra-standing", "backstage"];

/**
 * Punto de vista de alguien parado en un sector, asomado al borde que da hacia la pista (como en un box,
 * apoyado en el límite); si el sector no tiene un borde utilizable, desde su sillón o centro.
 */
export function viewpoint(id: MapSectorId, at?: [number, number]): Vista {
  const { level, height, points } = SECTOR_SHAPES[id];
  const [lx, lz] = planToWorld(levelCenter(0));
  const pista = levelCenter(0);
  const y = LEVEL_HEIGHT[level] + height + EYE_HEIGHT;

  const sofa = SOFAS[id]?.[0]?.points ?? points;
  const centro: Pt = [sofa.reduce((a, p) => a + p[0], 0) / sofa.length, sofa.reduce((a, p) => a + p[1], 0) / sofa.length];

  // Borde cuyo punto medio queda más cerca de la pista, corrido hacia adentro del sector
  let mejor: Pt | null = null;
  let distancia = Infinity;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const m: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const d = Math.hypot(m[0] - pista[0], m[1] - pista[1]);
    if (d >= distancia) continue;
    const largo = Math.hypot(centro[0] - m[0], centro[1] - m[1]) || 1;
    const adentro: Pt = [m[0] + ((centro[0] - m[0]) / largo) * 4, m[1] + ((centro[1] - m[1]) / largo) * 4];
    if (dentro(adentro, points)) {
      mejor = adentro;
      distancia = d;
    }
  }
  // En los sectores grandes cada uno elige dónde pararse: los ojos van al punto donde hizo clic
  const [ex, ez] = at && SECTORES_LIBRES.includes(id) ? at : planToWorld(mejor ?? centro);
  return { eye: [ex, y, ez], look: [lx, 1.2, lz] };
}
