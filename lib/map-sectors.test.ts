import { describe, expect, it } from "vitest";
import { CREDITO_CONSUMO_INICIAL, mapaSchema } from "./content";
import { tramosCredito } from "./map-sectors";

describe("crédito de consumo (se edita desde Madre)", () => {
  it("de fábrica: 90% antes de 01:30, 70% hasta 02:00 y 50% después", () => {
    expect(tramosCredito(CREDITO_CONSUMO_INICIAL)).toEqual([
      { texto: "Antes de las 01:30", porcentaje: 90 },
      { texto: "01:30 a 02:00", porcentaje: 70 },
      { texto: "Después de las 02:00", porcentaje: 50 },
    ]);
  });

  it("lo publicado desde Madre cambia los tramos", () => {
    const c = { hasta1: "01:00", hasta2: "03:00", pct1: 100, pct2: 80, pct3: 40 };
    expect(tramosCredito(c).map((t) => [t.texto, t.porcentaje])).toEqual([
      ["Antes de las 01:00", 100],
      ["01:00 a 03:00", 80],
      ["Después de las 03:00", 40],
    ]);
  });

  it("un mapa publicado antes de existir el crédito (solo backstage) sigue valiendo y toma el de fábrica", () => {
    const r = mapaSchema.safeParse({ backstage: 1500000 });
    expect(r.success).toBe(true);
    expect(r.success && r.data.creditoConsumo).toEqual(CREDITO_CONSUMO_INICIAL);
  });

  it("rechaza horas mal escritas, horas en desorden y porcentajes fuera de 0 a 100", () => {
    const base = { backstage: 1500000 };
    expect(mapaSchema.safeParse({ ...base, creditoConsumo: { ...CREDITO_CONSUMO_INICIAL, hasta1: "1:30" } }).success).toBe(false);
    expect(mapaSchema.safeParse({ ...base, creditoConsumo: { ...CREDITO_CONSUMO_INICIAL, hasta1: "02:30" } }).success).toBe(false);
    expect(mapaSchema.safeParse({ ...base, creditoConsumo: { ...CREDITO_CONSUMO_INICIAL, pct1: 120 } }).success).toBe(false);
  });
});
