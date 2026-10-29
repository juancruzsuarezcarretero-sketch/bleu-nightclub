import type { MapSectorConfig, MapSectorId, MapSectorSelection } from "@/lib/map-sectors";
import {
  formatARS,
  getSectorPriceLabel,
} from "@/lib/map-sectors";
import type { Paquete } from "@/lib/content";

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

export const textoPrecio = (p: Paquete): string =>
  p.unidad === "persona" ? `${formatARS(p.precio)} por persona` : `${formatARS(p.precio)} mesa completa`;

export function reservationFromPaquete(p: Paquete): ReservationSelection {
  const porPersona = p.unidad === "persona";
  return {
    displayLabel: `${p.etiqueta} - ${textoPrecio(p)}`,
    sector: p.sector,
    priceLabel: porPersona ? textoPrecio(p) : formatARS(p.precio),
    theme: p.tema,
    perPerson: porPersona,
    ...(porPersona ? { pricePerPerson: p.precio } : { fixedPrice: p.precio }),
  };
}

export function reservationFromMapSelection(
  selection: MapSectorSelection,
  persons: number,
  sectores: Record<MapSectorId, MapSectorConfig>
): ReservationSelection {
  const config = sectores[selection.sectorId];
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
