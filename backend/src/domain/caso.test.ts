import { describe, expect, it } from "vitest";
import { estadosCaso, transicionValida } from "./caso";

describe("transicionValida", () => {
  it("permite avanzar en el flujo del pedido", () => {
    expect(transicionValida("creado", "recibido")).toBe(true);
    expect(transicionValida("recibido", "asignado")).toBe(true);
    expect(transicionValida("empacando", "pagado")).toBe(true);
    expect(transicionValida("pagado", "enviado")).toBe(true);
  });

  it("rechaza saltos de estado invalidos", () => {
    expect(transicionValida("creado", "enviado")).toBe(false);
    expect(transicionValida("creado", "pagado")).toBe(false);
    expect(transicionValida("despachando", "cerrado")).toBe(false);
  });

  it("permite cancelar desde estados abiertos", () => {
    expect(transicionValida("creado", "cancelado")).toBe(true);
    expect(transicionValida("despachando", "cancelado")).toBe(true);
  });

  it("no permite transicionar desde estados terminales", () => {
    for (const destino of estadosCaso) {
      expect(transicionValida("cerrado", destino)).toBe(false);
      expect(transicionValida("cancelado", destino)).toBe(false);
    }
  });
});
