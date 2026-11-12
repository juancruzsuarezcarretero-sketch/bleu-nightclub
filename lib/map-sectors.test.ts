import { describe, expect, it } from "vitest";
import { CONSUMO_CREDITO, consumoCreditoLabel } from "./map-sectors";

describe("crédito de consumo", () => {
  it("baja con la hora: 90% antes de 01:30, 70% hasta 02:00 y 50% después", () => {
    expect(CONSUMO_CREDITO.map((t) => t.porcentaje)).toEqual([90, 70, 50]);
    expect(CONSUMO_CREDITO.map((t) => t.hasta)).toEqual(["01:30", "02:00", null]);
  });

  it("los carteles de cada tramo leen en orden", () => {
    const textos = CONSUMO_CREDITO.map((t, i) => consumoCreditoLabel(t, i === 0 ? null : CONSUMO_CREDITO[i - 1].hasta));
    expect(textos).toEqual(["Antes de las 01:30", "01:30 a 02:00", "Después de las 02:00"]);
  });
});
