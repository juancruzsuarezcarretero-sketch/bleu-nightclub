import { describe, expect, it } from "vitest";
import { buildReservationWhatsAppMessage } from "./whatsapp";

const base = { sector: "VIP Gold", nombre: "Ana", fecha: "2026-11-07", personas: 4, price: "$ 35.000" };

describe("buildReservationWhatsAppMessage", () => {
  it("incluye la noche elegida cuando la reserva viene de un evento", () => {
    expect(buildReservationWhatsAppMessage({ ...base, evento: "FISHER · VIE 20.06" })).toContain("🎉 Noche: FISHER · VIE 20.06");
  });
  it("sin evento no agrega la línea de noche", () => {
    expect(buildReservationWhatsAppMessage(base)).not.toContain("Noche");
  });
});
