export const WHATSAPP_NUMBER = "5493544433834";

export const WHATSAPP_DISPLAY = "+54 9 354 443-3834";

export type PackageId =
  | "vip-gold"
  | "vip-standing"
  | "ultra"
  | "mesa-vip"
  | "mesa-ultra";

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildReservationWhatsAppMessage(data: {
  sector: string;
  nombre: string;
  fecha: string;
  personas: number;
  price: string;
  mensaje?: string;
}): string {
  const lines = [
    "Hola! Quiero hacer una reserva:",
    `📍 Sector: ${data.sector}`,
    `👤 Nombre: ${data.nombre}`,
    `📅 Fecha: ${data.fecha}`,
    `👥 Personas: ${data.personas}`,
    `💰 Precio: ${data.price}`,
  ];
  if (data.mensaje?.trim()) {
    lines.push(`📝 ${data.mensaje.trim()}`);
  }
  return lines.join("\n");
}
