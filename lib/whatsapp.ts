export function whatsappUrl(numero: string, message?: string): string {
  const base = `https://wa.me/${numero}`;
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
