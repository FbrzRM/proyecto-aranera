import { describe, expect, it } from "vitest";
import { calcularPlazo } from "./sla";

function diasEntre(desde: Date, hasta: Date): number {
  return Math.round((hasta.getTime() - desde.getTime()) / 86_400_000);
}

describe("calcularPlazo", () => {
  const base = new Date("2026-01-01T12:00:00.000Z");

  it("asigna 8 semanas a los equipos", () => {
    expect(diasEntre(base, calcularPlazo("equipo", base))).toBe(56);
  });

  it("asigna 1 semana a consumibles y reactivos", () => {
    expect(diasEntre(base, calcularPlazo("consumible", base))).toBe(7);
    expect(diasEntre(base, calcularPlazo("reactivo", base))).toBe(7);
  });
});
