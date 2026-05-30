import type { MapSectorSelection } from "@/lib/map-sectors";
import {
  MAP_SECTORS,
  formatARS,
  getSectorPriceLabel,
} from "@/lib/map-sectors";
import type { PackageId } from "@/lib/whatsapp";

export type ReservationTheme =
  | "gold"
  | "purple"
  | "red"
  | "blue"
  | "purple-dark";

export interface ReservationSelection {
  displayLabel: string;
  sector: string;
  priceLabel: string;
  theme: ReservationTheme;
  perPerson: boolean;
  pricePerPerson?: number;
  fixedPrice?: number;
  defaultPersons?: number;
}

export const PACKAGE_RESERVATIONS: Record<PackageId, ReservationSelection> = {
  "vip-gold": {
    displayLabel: "VIP Gold - $35.000 por persona",
    sector: "VIP Gold",
    priceLabel: "$35.000 por persona",
    theme: "gold",
    perPerson: true,
    pricePerPerson: 35000,
  },
  "vip-standing": {
    displayLabel: "VIP Standing - $50.000 por persona",
    sector: "VIP Standing",
    priceLabel: "$50.000 por persona",
    theme: "gold",
    perPerson: true,
    pricePerPerson: 50000,
  },
  ultra: {
    displayLabel: "Ultra VIP - $100.000 por persona",
    sector: "Ultra VIP",
    priceLabel: "$100.000 por persona",
    theme: "purple",
    perPerson: true,
    pricePerPerson: 100000,
  },
  "mesa-vip": {
    displayLabel: "Mesa VIP - $700.000 mesa completa",
    sector: "Mesas VIP",
    priceLabel: "$700.000",
    theme: "gold",
    perPerson: false,
    fixedPrice: 700000,
  },
  "mesa-ultra": {
    displayLabel: "Mesa Ultra VIP - $1.200.000 mesa completa",
    sector: "Mesas Ultra VIP",
    priceLabel: "$1.200.000",
    theme: "purple",
    perPerson: false,
    fixedPrice: 1200000,
  },
};

export function reservationFromPackage(packageId: PackageId): ReservationSelection {
  return PACKAGE_RESERVATIONS[packageId];
}

export function reservationFromMapSelection(
  selection: MapSectorSelection,
  persons = 2
): ReservationSelection {
  const config = MAP_SECTORS[selection.sectorId];
  const priceLabel = getSectorPriceLabel(config);

  return {
    displayLabel: `${config.name} - ${priceLabel}`,
    sector: config.name,
    priceLabel,
    theme: config.theme,
    perPerson: Boolean(config.pricePerPerson),
    pricePerPerson: config.pricePerPerson,
    fixedPrice: config.fixedPrice,
    defaultPersons: persons,
  };
}

export function calculateReservationPrice(
  selection: ReservationSelection,
  personas: number
): string {
  if (selection.perPerson && selection.pricePerPerson) {
    return formatARS(selection.pricePerPerson * personas);
  }
  return selection.priceLabel;
}

export const SELECTION_THEME_STYLES: Record<
  ReservationTheme,
  { border: string; bg: string; text: string }
> = {
  gold: {
    border: "border-[#C89020]/50",
    bg: "bg-[#C89020]/10",
    text: "text-[#C89020]",
  },
  purple: {
    border: "border-[#9933cc]/50",
    bg: "bg-[#9933cc]/10",
    text: "text-[#9933cc]",
  },
  blue: {
    border: "border-[#0066FF]/50",
    bg: "bg-[#0066FF]/10",
    text: "text-[#0066FF]",
  },
  "purple-dark": {
    border: "border-[#7733aa]/50",
    bg: "bg-[#7733aa]/10",
    text: "text-[#9933CC]",
  },
  red: {
    border: "border-[#aa0022]/50",
    bg: "bg-[#aa0022]/10",
    text: "text-[#aa0022]",
  },
};
