import { describe, expect, it } from "vitest";
import { MAP_SECTORS, type MapSectorId } from "./map-sectors";
import { levelOfSector, MAP_LEVELS } from "./map-levels";
import { LEVEL_FLOORS, LEVEL_HEIGHT, SECTOR_SHAPES, levelCenter, planToWorld, type Pt } from "./map-3d";

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

  it("el plano se centra en el origen del mundo", () => {
    expect(planToWorld([400, 480])).toEqual([0, 0]);
    expect(planToWorld(levelCenter(1))[1]).toBeLessThan(0);
  });
});
