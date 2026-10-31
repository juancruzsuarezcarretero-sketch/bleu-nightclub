import { describe, expect, it } from "vitest";
import type { Foto } from "./content";
import { agruparCarpetas } from "./galeria";

const foto = (id: number, date: string, eventName: string): Foto => ({ id, date, eventName, image: `https://images.unsplash.com/${id}`, aspect: "tall" });

describe("agruparCarpetas", () => {
  it("junta las fotos de la misma noche y respeta el orden de aparición", () => {
    const carpetas = agruparCarpetas([foto(1, "VIE 24.10", "BLEU"), foto(2, "SÁB 25.10", "BARTO"), foto(3, "VIE 24.10", "BLEU")]);
    expect(carpetas.map((c) => [c.eventName, c.fotos.map((f) => f.id)])).toEqual([["BLEU", [1, 3]], ["BARTO", [2]]]);
  });

  it("la misma fecha con otro nombre, o el mismo nombre con otra fecha, son carpetas distintas", () => {
    const carpetas = agruparCarpetas([foto(1, "VIE 24.10", "BLEU"), foto(2, "VIE 24.10", "BARTO"), foto(3, "VIE 31.10", "BLEU")]);
    expect(carpetas).toHaveLength(3);
  });

  it("sin fotos no hay carpetas", () => {
    expect(agruparCarpetas([])).toEqual([]);
  });
});
