import type { MapSectorId } from "@/lib/map-sectors";

export interface MapLevel {
  index: number;
  label: string;
  name: string;
  accent: string;
  sectors: MapSectorId[];
  view: string;
  /** Foto de la vista desde el nivel (ruta en /public). Si falta, se muestra solo el texto. */
  photo?: string;
}

export const MAP_LEVELS: MapLevel[] = [
  {
    index: 0,
    label: "Piso 1",
    name: "Pista Principal",
    accent: "#F0F0F0",
    sectors: [],
    view: "A nivel de pista, frente al escenario y la cabina del DJ.",
  },
  {
    index: 1,
    label: "Segundo piso",
    name: "Entrepiso · Golden",
    accent: "#C89020",
    sectors: ["golden"],
    view: "Desde el entrepiso se ve toda la pista desde arriba, con sillones sobre la baranda.",
  },
  {
    index: 2,
    label: "Tercer piso",
    name: "Box Azules · VIP Nivel 3",
    accent: "#0066FF",
    sectors: ["box-1", "box-2", "box-3", "box-4", "box-5", "vip-n3-standing"],
    view: "Boxes elevados con vista directa a la pista y al escenario.",
  },
  {
    index: 3,
    label: "Cuarto piso",
    name: "Box Violetas · Backstage",
    accent: "#9933CC",
    sectors: ["ultra-box-1", "ultra-box-2", "ultra-box-3", "ultra-standing", "backstage"],
    view: "El nivel más alto: palcos sobre la pista y el backstage VIP.",
  },
];

export function levelOfSector(id: MapSectorId): number {
  return MAP_LEVELS.find((l) => l.sectors.includes(id))?.index ?? 0;
}
