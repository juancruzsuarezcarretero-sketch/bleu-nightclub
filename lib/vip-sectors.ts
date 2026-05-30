export type SectorTheme = "gold" | "purple" | "red";

export type StandingSectorId = "vip-gold" | "vip-standing" | "ultra-access";

export interface StandingSectorConfig {
  type: "standing";
  id: StandingSectorId;
  name: string;
  pricePerPerson: number;
  capacityLabel: string;
  includes: string[];
  theme: SectorTheme;
  reserveLabel: string;
}

export interface TableTierConfig {
  type: "table";
  tier: "vip" | "ultra";
  name: string;
  capacity: number;
  totalPrice: number;
  includes: string[];
  theme: SectorTheme;
  reserveLabel: string;
}

export const STANDING_SECTORS: Record<StandingSectorId, StandingSectorConfig> = {
  "vip-gold": {
    type: "standing",
    id: "vip-gold",
    name: "VIP Gold",
    pricePerPerson: 35000,
    capacityLabel: "Sin límite de personas",
    includes: ["Acceso al sector VIP Gold", "Ambiente exclusivo"],
    theme: "gold",
    reserveLabel: "Reservar",
  },
  "vip-standing": {
    type: "standing",
    id: "vip-standing",
    name: "VIP Standing",
    pricePerPerson: 50000,
    capacityLabel: "Sin límite de personas",
    includes: ["Acceso VIP Standing", "Vista privilegiada del sector"],
    theme: "gold",
    reserveLabel: "Reservar",
  },
  "ultra-access": {
    type: "standing",
    id: "ultra-access",
    name: "Ultra",
    pricePerPerson: 100000,
    capacityLabel: "Sin límite de personas",
    includes: ["Acceso Ultra VIP sin mesa", "Experiencia premium"],
    theme: "purple",
    reserveLabel: "Reservar",
  },
};

export const TABLE_TIERS: Record<"vip" | "ultra", TableTierConfig> = {
  vip: {
    type: "table",
    tier: "vip",
    name: "Mesas VIP",
    capacity: 10,
    totalPrice: 700000,
    includes: [
      "Lugar reservado",
      "Cristalería individual",
      "Moza a disposición",
    ],
    theme: "gold",
    reserveLabel: "Reservar Mesa",
  },
  ultra: {
    type: "table",
    tier: "ultra",
    name: "Mesas Ultra VIP",
    capacity: 10,
    totalPrice: 1200000,
    includes: [
      "Lugar reservado",
      "Cristalería individual",
      "Moza a disposición",
    ],
    theme: "purple",
    reserveLabel: "Reservar Mesa",
  },
};

export const THEME_STYLES: Record<
  SectorTheme,
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
    buttonHover:
      "hover:bg-[#C89020]/90 hover:shadow-[0_0_20px_rgba(200,144,32,0.4)]",
  },
  purple: {
    accent: "#9933cc",
    accentBorder: "border-[#9933cc]/40",
    accentBg: "bg-[#0e0820]/80",
    accentGlow: "shadow-[0_0_30px_rgba(153,51,204,0.15)]",
    buttonBg: "bg-[#9933cc]",
    buttonHover:
      "hover:bg-[#9933cc]/90 hover:shadow-[0_0_20px_rgba(153,51,204,0.4)]",
  },
  red: {
    accent: "#aa0022",
    accentBorder: "border-[#aa0022]/40",
    accentBg: "bg-[#180204]/80",
    accentGlow: "shadow-[0_0_30px_rgba(170,0,34,0.15)]",
    buttonBg: "bg-[#aa0022]",
    buttonHover:
      "hover:bg-[#aa0022]/90 hover:shadow-[0_0_20px_rgba(170,0,34,0.4)]",
  },
};

export function formatARS(amount: number): string {
  return `$${amount.toLocaleString("es-AR")}`;
}

export type SectorSelection =
  | { kind: "standing"; sectorId: StandingSectorId }
  | { kind: "table"; tableId: string; tableLabel: string; tier: "vip" | "ultra" };
