import { describe, expect, it } from "vitest";
import { MAP_SECTORS, type MapSectorId } from "./map-sectors";
import { levelOfSector, MAP_LEVELS } from "./map-levels";
import { CABINA_PLATFORM, LEVEL_FLOORS, LEVEL_HEIGHT, PROPS, SECTOR_SHAPES, STAIRS, levelCenter, planToWorld, type Pt } from "./map-3d";

const ids = Object.keys(MAP_SECTORS) as MapSectorId[];

const inside = ([x, y]: Pt, poly: Pt[]) => {
  let dentro = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
};

const centroide = (pts: Pt[]): Pt => [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length];

describe("geometría 3D del mapa", () => {
  it("todo sector reservable del mapa tiene su volumen 3D, y no sobra ninguno", () => {
    expect(Object.keys(SECTOR_SHAPES).sort()).toEqual([...ids].sort());
  });

  it("cada sector está en el mismo piso que dice el mapa de pisos", () => {
    for (const id of ids) expect(SECTOR_SHAPES[id].level).toBe(levelOfSector(id));
  });

  it("hay un suelo y una altura por piso", () => {
    expect(LEVEL_FLOORS).toHaveLength(MAP_LEVELS.length);
    expect(LEVEL_HEIGHT).toHaveLength(MAP_LEVELS.length);
  });

  it("cada sector apoya sobre el suelo de su piso", () => {
    for (const id of ids) {
      const { points, level } = SECTOR_SHAPES[id];
      expect(points.length).toBeGreaterThanOrEqual(3);
      expect(inside(centroide(points), LEVEL_FLOORS[level]), id).toBe(true);
    }
  });

  it("el piso azul termina donde terminan los sectores azules", () => {
    const azul = LEVEL_FLOORS[2];
    expect(Math.max(...azul.map((p) => p[0]))).toBe(245); // el standing llega hasta x=245
    expect(inside([220, 500], azul)).toBe(false); // al costado de los boxes (x 198 a 245) ya no hay piso
    expect(inside([150, 500], azul)).toBe(true);
    expect(inside([150, 800], azul)).toBe(true);
    for (const id of ["box-1", "box-2", "box-3", "box-4", "box-5"] as const) {
      for (const p of SECTOR_SHAPES[id].points) expect(p[0]).toBeLessThanOrEqual(198);
    }
  });

  it("la cabina de DJ está a la altura del piso 3, se ve en el piso 4 y no pisa su suelo", () => {
    expect(PROPS.cabina.elevation).toBe(2);
    expect(PROPS.cabina.level).toBe(3);
    expect(CABINA_PLATFORM.elevation).toBe(2);
    const centro = centroide(PROPS.cabina.points);
    expect(inside(centro, LEVEL_FLOORS[3])).toBe(false);
    expect(inside(centro, CABINA_PLATFORM.points)).toBe(true);
    expect(LEVEL_HEIGHT[CABINA_PLATFORM.elevation]).toBe(LEVEL_HEIGHT[2]);
  });

  it("la escalera después de la cabina sube al piso 4 y no queda tapada por su suelo", () => {
    const escalera = STAIRS.find((s) => s.from === 2 && s.to === 3);
    expect(escalera).toBeDefined();
    const { box } = escalera!;
    expect(box.x).toBe(510); // arranca donde termina la cabina
    const medio: Pt = [box.x + box.w / 2, box.y + box.h / 2];
    expect(inside(medio, LEVEL_FLOORS[3])).toBe(false); // hueco en el suelo del piso 4
    expect(inside([box.x + 5, medio[1]], CABINA_PLATFORM.points)).toBe(false); // y fuera de la cabina misma
    expect(inside([box.x + box.w + 5, medio[1]], LEVEL_FLOORS[3])).toBe(true); // llega al suelo del piso 4
    expect(LEVEL_HEIGHT[escalera!.from]).toBe(LEVEL_HEIGHT[CABINA_PLATFORM.elevation]);
  });

  it("el piso 4 empieza donde termina la escalera, sin adelantarse sobre los escalones", () => {
    const { box } = STAIRS.find((s) => s.from === 2 && s.to === 3)!;
    const finEscalera = box.x + box.w;
    for (const y of [710, 725, 745, 770, 795]) {
      expect(inside([finEscalera - 3, y], LEVEL_FLOORS[3]), `antes del final, y=${y}`).toBe(false);
      expect(inside([finEscalera + 3, y], LEVEL_FLOORS[3]), `después del final, y=${y}`).toBe(true);
    }
  });

  it("el rojo (backstage) se expandió hacia el azul y apoya en el suelo del piso 4", () => {
    const xs = SECTOR_SHAPES.backstage.points.map((p) => p[0]);
    expect(Math.min(...xs)).toBeLessThan(245);
    expect(inside([230, 850], LEVEL_FLOORS[3])).toBe(true);
  });

  it("la cabina lleva etiqueta y el resto de elementos también", () => {
    expect(PROPS.cabina.label).toBe("Cabina");
    for (const prop of Object.values(PROPS)) expect(prop.label.length).toBeGreaterThan(0);
  });

  it("el plano se centra en el origen del mundo", () => {
    expect(planToWorld([400, 480])).toEqual([0, 0]);
    expect(planToWorld(levelCenter(1))[1]).toBeLessThan(0);
  });
});
