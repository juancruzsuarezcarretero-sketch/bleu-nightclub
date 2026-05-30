import type { SectorSelection } from "@/lib/vip-sectors";

export const WHATSAPP_NUMBER = "5493544433834";

export const WHATSAPP_DISPLAY = "+54 9 354 443-3834";

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

const STANDING_MESSAGES = {
  "vip-gold": "Hola! Quiero reservar VIP Gold",
  "vip-standing": "Hola! Quiero reservar VIP Standing",
  "ultra-access": "Hola! Quiero reservar Ultra VIP",
} as const;

export function getReservationWhatsAppMessage(
  selection: SectorSelection
): string {
  if (selection.kind === "standing") {
    return STANDING_MESSAGES[selection.sectorId];
  }
  return `Hola! Quiero reservar la Mesa ${selection.tableLabel}`;
}
