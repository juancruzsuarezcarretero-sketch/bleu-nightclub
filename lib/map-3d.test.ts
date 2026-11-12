import { describe, expect, it } from "vitest";
import { MAP_SECTORS, type MapSectorId } from "./map-sectors";
import { levelOfSector, MAP_LEVELS } from "./map-levels";
import { BARANDA_CABINA, PUERTA_CABINA, CABINA_PLATFORM, DIVIDERS, LEVEL_FLOORS, LEVEL_HEIGHT, LOCAL_BOUNDS, PROPS, SECTOR_SHAPES, SOFAS, EYE_HEIGHT, PLAN_SCALE, STAIRS, levelCenter, openEdges, planToWorld, sofaParts, tableFor, viewpoint, viewpointAt, type Pt, type Sofa } from "./map-3d";

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

  it("cada sillón está dentro del sector al que pertenece", () => {
    for (const [id, sillones] of Object.entries(SOFAS) as [MapSectorId, Sofa[]][]) {
      expect(SECTOR_SHAPES[id], id).toBeDefined();
      for (const s of sillones) expect(inside(centroide(s.points), SECTOR_SHAPES[id].points), id).toBe(true);
    }
  });

  it("los sillones de los boxes azules están pegados a la pared, con el respaldo de ese lado", () => {
    for (const id of ["box-1", "box-2", "box-3", "box-4", "box-5"] as const) {
      const [s] = SOFAS[id]!;
      expect(s.back, id).toBe("w");
      const sillonX = Math.min(...s.points.map((p) => p[0]));
      const sectorX = Math.min(...SECTOR_SHAPES[id].points.map((p) => p[0]));
      expect(sillonX - sectorX, id).toBeLessThanOrEqual(4);
    }
  });

  it("el asiento y el respaldo de un sillón suman exactamente su superficie", () => {
    const area = (pts: Pt[]) => (pts[2][0] - pts[0][0]) * (pts[2][1] - pts[0][1]);
    for (const sillones of Object.values(SOFAS)) {
      for (const s of sillones!) {
        const { seat, backrest } = sofaParts(s);
        expect(area(seat) + area(backrest)).toBe(area(s.points));
      }
    }
  });

  it("el entrepiso sigue hasta el pie de la escalera al cuarto y la otra barra queda bajo el piso 4", () => {
    const entrepiso = LEVEL_FLOORS[1];
    const escalera = STAIRS.find((s) => s.to === 3)!;
    expect(Math.max(...entrepiso.map((p) => p[1]))).toBe(escalera.box.y);
    const centro = centroide(PROPS.barraBaja.points);
    expect(inside(centro, entrepiso)).toBe(true);
    expect(inside(centro, LEVEL_FLOORS[3])).toBe(true); // el piso 4 está arriba
    expect(PROPS.barraBaja.elevation).toBeLessThan(3);
  });

  it("el entrepiso llega hasta el límite con la pista principal, sin pisarla", () => {
    const pista = LEVEL_FLOORS[0];
    const entrepiso = LEVEL_FLOORS[1];
    for (const y of [420, 500, 600, 700]) {
      expect(inside([520, y], pista), `pista y=${y}`).toBe(true);
      expect(inside([520, y], entrepiso), `no pisa la pista y=${y}`).toBe(false);
      expect(inside([530, y], entrepiso), `empieza donde termina la pista y=${y}`).toBe(true);
    }
    // También sigue la diagonal de la esquina de la pista
    expect(inside([500, 400], pista)).toBe(true);
    expect(inside([500, 400], entrepiso)).toBe(false);
    expect(inside([500, 360], pista)).toBe(false);
    expect(inside([500, 360], entrepiso)).toBe(true);
  });

  it("los bordes pegados a una pared no llevan baranda: del piso azul quedan 5 abiertos", () => {
    const abiertos = openEdges(LEVEL_FLOORS[2]);
    expect(abiertos).toHaveLength(5);
    for (const [a, b] of abiertos) {
      expect(a[0] === 70 && b[0] === 70, "pared izquierda").toBe(false);
      expect(a[1] === 905 && b[1] === 905, "pared de abajo").toBe(false);
    }
  });

  it("ningún piso se sale de las paredes del local", () => {
    for (const piso of LEVEL_FLOORS) {
      for (const [x, y] of piso) {
        expect(x).toBeGreaterThanOrEqual(LOCAL_BOUNDS.x0);
        expect(x).toBeLessThanOrEqual(LOCAL_BOUNDS.x1);
        expect(y).toBeGreaterThanOrEqual(LOCAL_BOUNDS.y0);
        expect(y).toBeLessThanOrEqual(LOCAL_BOUNDS.y1);
      }
    }
  });

  it("cada mesa queda frente a su sillón, dentro del sector y sin pisarlo", () => {
    const solapan = (a: Pt[], b: Pt[]) =>
      a[0][0] < b[2][0] && b[0][0] < a[2][0] && a[0][1] < b[2][1] && b[0][1] < a[2][1];
    for (const [id, sillones] of Object.entries(SOFAS) as [MapSectorId, Sofa[]][]) {
      for (const s of sillones) {
        const mesa = tableFor(s);
        expect(inside(centroide(mesa), SECTOR_SHAPES[id].points), id).toBe(true);
        expect(solapan(mesa, s.points), `${id} mesa/sillón`).toBe(false);
      }
    }
  });

  it("los divisores caen en el hueco entre box y box, sobre el suelo de su piso", () => {
    expect(DIVIDERS).toHaveLength(6);
    for (const d of DIVIDERS) {
      const centro = centroide(d.points);
      expect(inside(centro, LEVEL_FLOORS[d.level])).toBe(true);
      for (const id of Object.keys(SECTOR_SHAPES) as MapSectorId[]) {
        expect(inside(centro, SECTOR_SHAPES[id].points), `divisor dentro de ${id}`).toBe(false);
      }
    }
  });

  it("todas las barras son rectangulares y la del entrepiso apoya en su suelo", () => {
    for (const prop of Object.values(PROPS)) {
      if (prop === PROPS.cabina) continue;
      const xs = new Set(prop.points.map((p) => p[0]));
      const ys = new Set(prop.points.map((p) => p[1]));
      expect(prop.points).toHaveLength(4);
      expect(xs.size, prop.label).toBe(2);
      expect(ys.size, prop.label).toBe(2);
    }
    expect(inside(centroide(PROPS.barraCanada.points), LEVEL_FLOORS[1])).toBe(true);
  });

  it("la escalera de la pista al entrepiso es amplia y su punta alta toca el borde del entrepiso", () => {
    const { box } = STAIRS.find((s) => s.from === 0 && s.to === 1)!;
    expect(box.w).toBeGreaterThanOrEqual(80);
    expect(box.h).toBeGreaterThanOrEqual(70);
    expect(box.x).toBeGreaterThanOrEqual(Math.max(...LEVEL_FLOORS[2].map((p) => p[0]))); // no queda bajo el piso azul
    const medio = box.x + box.w / 2;
    expect(inside([medio, box.y - 5], LEVEL_FLOORS[1])).toBe(true); // llega al borde del entrepiso
    expect(inside([medio, box.y + 5], LEVEL_FLOORS[1])).toBe(false);
    expect(inside([box.x + box.w / 2, box.y + box.h / 2], LEVEL_FLOORS[0])).toBe(true); // sube desde la pista
  });

  it("desde cada sector se ve la pista: ojos arriba del sector, dentro de él, y mirada hacia la pista", () => {
    const [pistaX, pistaZ] = planToWorld(levelCenter(0));
    for (const id of ids) {
      const { eye, look } = viewpoint(id);
      const { level, height, points } = SECTOR_SHAPES[id];
      expect(eye[1], id).toBeGreaterThan(LEVEL_HEIGHT[level] + height);
      // los ojos caen dentro del sector (se vuelve del mundo al plano)
      const plano: Pt = [eye[0] / PLAN_SCALE + 400, eye[2] / PLAN_SCALE + 480];
      expect(inside(plano, points), `${id} ojos dentro del sector`).toBe(true);
      expect([look[0], look[2]], id).toEqual([pistaX, pistaZ]);
      expect(Math.hypot(look[0] - eye[0], look[2] - eye[2]), id).toBeGreaterThan(3);
    }
  });

  it("en los boxes la vista es desde el borde que da a la pista, no desde el fondo contra la pared", () => {
    for (const id of ["box-1", "box-2", "box-3", "box-4", "box-5"] as const) {
      const { eye } = viewpoint(id);
      const x = eye[0] / PLAN_SCALE + 400;
      const bordeX = Math.max(...SECTOR_SHAPES[id].points.map((p) => p[0]));
      expect(bordeX - x, id).toBeLessThanOrEqual(6); // pegado al borde de la pista
    }
  });

  it("en el golden (y demás sectores amplios) la vista sale del punto tocado; en un box, siempre del borde", () => {
    const punto: [number, number] = planToWorld([700, 300]);
    expect(viewpoint("golden", punto).eye.slice(0, 1).concat(viewpoint("golden", punto).eye[2])).toEqual(punto);
    expect(viewpoint("golden", planToWorld([500, 100])).eye[0]).not.toBe(viewpoint("golden", punto).eye[0]);
    expect(viewpoint("box-1", punto).eye).toEqual(viewpoint("box-1").eye);
  });

  it("la puerta de la baranda de la cabina está al medio y la baranda cubre el resto de su lado oeste", () => {
    const cabina = PROPS.cabina.points;
    const medio = (cabina[0][1] + cabina[2][1]) / 2;
    expect(PUERTA_CABINA.y + PUERTA_CABINA.h / 2).toBeCloseTo(medio);
    const [antes, despues] = BARANDA_CABINA;
    expect(antes[0][1]).toBe(cabina[0][1]);
    expect(antes[1][1]).toBe(PUERTA_CABINA.y);
    expect(despues[0][1]).toBe(PUERTA_CABINA.y + PUERTA_CABINA.h);
    expect(despues[1][1]).toBe(cabina[2][1]);
    expect(antes[0][0]).toBe(cabina[0][0]); // pegada al lado oeste de la cabina
  });

  it("desde un punto de un piso los ojos quedan a la altura de ese piso, mirando a la pista (o a la cabina desde la pista)", () => {
    const [pistaX, pistaZ] = planToWorld(levelCenter(0));
    const arriba = viewpointAt(2, -20, 10);
    expect(arriba.eye[1]).toBeCloseTo(LEVEL_HEIGHT[2] + EYE_HEIGHT);
    expect([arriba.look[0], arriba.look[2]]).toEqual([pistaX, pistaZ]);
    const enPista = viewpointAt(0, pistaX + 10, pistaZ);
    expect(enPista.eye[1]).toBeCloseTo(EYE_HEIGHT);
    const [cx, cz] = planToWorld([377.5, 752.5]);
    expect([enPista.look[0], enPista.look[2]]).toEqual([cx, cz]); // desde la pista se mira a la cabina
  });

  it("el plano se centra en el origen del mundo", () => {
    expect(planToWorld([400, 480])).toEqual([0, 0]);
    expect(planToWorld(levelCenter(1))[1]).toBeLessThan(0);
  });
});
