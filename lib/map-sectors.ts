export type MapSectorId =
  | "golden"
  | "box-1"
  | "box-2"
  | "box-3"
  | "box-4"
  | "box-5"
  | "vip-n3-standing"
  | "ultra-box-1"
  | "ultra-box-2"
  | "ultra-box-3"
  | "ultra-standing"
  | "backstage";

export type MapSectorTheme =
  | "gold"
  | "blue"
  | "purple"
  | "purple-dark"
  | "red";

export type SectorType = "mesa" | "standing" | "area";

export interface MapSectorConfig {
  id: MapSectorId;
  name: string;
  type: SectorType;
  pricePerPerson?: number;
  fixedPrice?: number;
  maxCapacity?: number;
  capacityLabel: string;
  includes: string[];
  typeLabel?: string;
  theme: MapSectorTheme;
  accent: string;
  fill: string;
  stroke: string;
  hoverFill: string;
  reservable: boolean;
}

export function formatARS(amount: number): string {
  return `$${amount.toLocaleString("es-AR")}`;
}

const TABLE_INCLUDES = [
  "Lugar reservado",
  "Cristalería individual",
  "Moza a disposición",
];

export const MAP_SECTORS: Record<MapSectorId, MapSectorConfig> = {
  golden: {
    id: "golden",
    name: "Golden",
    type: "mesa",
    typeLabel: "Mesa con sillones",
    pricePerPerson: 35000,
    capacityLabel: "Sin límite de personas",
    includes: ["Mesa con sillones", "Zona lounge exclusiva", "Servicio premium"],
    theme: "gold",
    accent: "#C89020",
    fill: "#1a1402",
    stroke: "#C89020",
    hoverFill: "#2a2010",
    reservable: true,
  },
  "box-1": {
    id: "box-1",
    name: "Box 1",
    type: "mesa",
    fixedPrice: 700000,
    maxCapacity: 10,
    capacityLabel: "Hasta 10 personas",
    includes: TABLE_INCLUDES,
    theme: "blue",
    accent: "#0066FF",
    fill: "#050b16",
    stroke: "#0066FF",
    hoverFill: "#0a1830",
    reservable: true,
  },
  "box-2": {
    id: "box-2",
    name: "Box 2",
    type: "mesa",
    fixedPrice: 700000,
    maxCapacity: 10,
    capacityLabel: "Hasta 10 personas",
    includes: TABLE_INCLUDES,
    theme: "blue",
    accent: "#0066FF",
    fill: "#050b16",
    stroke: "#0066FF",
    hoverFill: "#0a1830",
    reservable: true,
  },
  "box-3": {
    id: "box-3",
    name: "Box 3",
    type: "mesa",
    fixedPrice: 700000,
    maxCapacity: 10,
    capacityLabel: "Hasta 10 personas",
    includes: TABLE_INCLUDES,
    theme: "blue",
    accent: "#0066FF",
    fill: "#050b16",
    stroke: "#0066FF",
    hoverFill: "#0a1830",
    reservable: true,
  },
  "box-4": {
    id: "box-4",
    name: "Box 4",
    type: "mesa",
    fixedPrice: 700000,
    maxCapacity: 10,
    capacityLabel: "Hasta 10 personas",
    includes: TABLE_INCLUDES,
    theme: "blue",
    accent: "#0066FF",
    fill: "#050b16",
    stroke: "#0066FF",
    hoverFill: "#0a1830",
    reservable: true,
  },
  "box-5": {
    id: "box-5",
    name: "Box 5",
    type: "mesa",
    fixedPrice: 700000,
    maxCapacity: 10,
    capacityLabel: "Hasta 10 personas",
    includes: TABLE_INCLUDES,
    theme: "blue",
    accent: "#0066FF",
    fill: "#050b16",
    stroke: "#0066FF",
    hoverFill: "#0a1830",
    reservable: true,
  },
  "vip-n3-standing": {
    id: "vip-n3-standing",
    name: "VIP Nivel 3",
    type: "standing",
    pricePerPerson: 50000,
    capacityLabel: "Sin límite de personas",
    includes: ["Acceso VIP Nivel 3", "Zona standing premium"],
    theme: "blue",
    accent: "#0066FF",
    fill: "#050b16",
    stroke: "#0066FF",
    hoverFill: "#0a1830",
    reservable: true,
  },
  "ultra-box-1": {
    id: "ultra-box-1",
    name: "Ultra Box 1 — Palco 2",
    type: "mesa",
    fixedPrice: 1200000,
    maxCapacity: 10,
    capacityLabel: "Hasta 10 personas",
    includes: TABLE_INCLUDES,
    theme: "purple",
    accent: "#9933CC",
    fill: "#0e0820",
    stroke: "#9933CC",
    hoverFill: "#180e30",
    reservable: true,
  },
  "ultra-box-2": {
    id: "ultra-box-2",
    name: "Ultra Box 2 — Palco 2",
    type: "mesa",
    fixedPrice: 1200000,
    maxCapacity: 10,
    capacityLabel: "Hasta 10 personas",
    includes: TABLE_INCLUDES,
    theme: "purple",
    accent: "#9933CC",
    fill: "#0e0820",
    stroke: "#9933CC",
    hoverFill: "#180e30",
    reservable: true,
  },
  "ultra-box-3": {
    id: "ultra-box-3",
    name: "Ultra Box 3 — Palco 3",
    type: "mesa",
    fixedPrice: 1200000,
    maxCapacity: 10,
    capacityLabel: "Hasta 10 personas",
    includes: TABLE_INCLUDES,
    theme: "purple",
    accent: "#9933CC",
    fill: "#0e0820",
    stroke: "#9933CC",
    hoverFill: "#180e30",
    reservable: true,
  },
  "ultra-standing": {
    id: "ultra-standing",
    name: "Ultra Standing",
    type: "standing",
    pricePerPerson: 100000,
    capacityLabel: "Sin límite de personas",
    includes: ["Acceso Ultra VIP", "Zona standing exclusiva"],
    theme: "purple-dark",
    accent: "#9933CC",
    fill: "#0a0618",
    stroke: "#7733aa",
    hoverFill: "#120a24",
    reservable: true,
  },
  backstage: {
    id: "backstage",
    name: "Backstage VIP",
    type: "area",
    fixedPrice: 1500000,
    capacityLabel: "Área exclusiva",
    includes: [
      "Acceso Backstage VIP",
      "Área privada exclusiva",
      "Servicio de máximo nivel",
    ],
    theme: "red",
    accent: "#AA0022",
    fill: "#180204",
    stroke: "#AA0022",
    hoverFill: "#240308",
    reservable: true,
  },
};

export const MAP_THEME_STYLES: Record<
  MapSectorTheme,
  {
    accent: string;
    accentBorder: string;
    accentBg: string;
    accentGlow: string;
    buttonBg: string;
    buttonHover: string;
  }
> = {
  gold: {
    accent: "#C89020",
    accentBorder: "border-[#C89020]/40",
    accentBg: "bg-[#1a1402]/80",
    accentGlow: "shadow-[0_0_30px_rgba(200,144,32,0.15)]",
    buttonBg: "bg-[#C89020]",
    buttonHover: "hover:bg-[#C89020]/90",
  },
  blue: {
    accent: "#0066FF",
    accentBorder: "border-[#0066FF]/40",
    accentBg: "bg-[#050b16]/80",
    accentGlow: "shadow-[0_0_30px_rgba(0,102,255,0.15)]",
    buttonBg: "bg-[#0066FF]",
    buttonHover: "hover:bg-[#0066FF]/90",
  },
  purple: {
    accent: "#9933CC",
    accentBorder: "border-[#9933CC]/40",
    accentBg: "bg-[#0e0820]/80",
    accentGlow: "shadow-[0_0_30px_rgba(153,51,204,0.15)]",
    buttonBg: "bg-[#9933CC]",
    buttonHover: "hover:bg-[#9933CC]/90",
  },
  "purple-dark": {
    accent: "#9933CC",
    accentBorder: "border-[#7733aa]/40",
    accentBg: "bg-[#0a0618]/80",
    accentGlow: "shadow-[0_0_30px_rgba(119,51,170,0.15)]",
    buttonBg: "bg-[#7733aa]",
    buttonHover: "hover:bg-[#7733aa]/90",
  },
  red: {
    accent: "#AA0022",
    accentBorder: "border-[#AA0022]/40",
    accentBg: "bg-[#180204]/80",
    accentGlow: "shadow-[0_0_30px_rgba(170,0,34,0.15)]",
    buttonBg: "bg-[#AA0022]",
    buttonHover: "hover:bg-[#AA0022]/90",
  },
};

export type MapSectorSelection = {
  sectorId: MapSectorId;
};

export function getSectorTypeLabel(type: SectorType): string {
  switch (type) {
    case "mesa":
      return "Mesa privada";
    case "standing":
      return "Standing";
    case "area":
      return "Área exclusiva";
  }
}

export function getSectorPriceLabel(config: MapSectorConfig): string {
  if (config.pricePerPerson) {
    return `${formatARS(config.pricePerPerson)} por persona`;
  }
  if (config.fixedPrice) {
    return config.type === "area"
      ? formatARS(config.fixedPrice)
      : `${formatARS(config.fixedPrice)} mesa completa`;
  }
  return "";
}

export function calculateSectorTotal(
  config: MapSectorConfig,
  persons: number
): number {
  if (config.pricePerPerson) return config.pricePerPerson * persons;
  return config.fixedPrice ?? 0;
}
