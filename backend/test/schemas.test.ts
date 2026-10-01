import { crearUsuarioSchema, loginSchema } from "@araneda/shared";
import { describe, expect, it } from "vitest";

describe("esquemas compartidos", () => {
  it("loginSchema exige email valido y password de 6+", () => {
    expect(loginSchema.safeParse({ email: "admin@araneda.cl", password: "Admin123" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "no-es-email", password: "Admin123" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "admin@araneda.cl", password: "123" }).success).toBe(false);
  });

  it("crearUsuarioSchema no admite el rol tercero", () => {
    const base = { nombre: "Ada", email: "ada@araneda.cl", password: "Clave123" };
    expect(crearUsuarioSchema.safeParse({ ...base, role: "empleado" }).success).toBe(true);
    expect(crearUsuarioSchema.safeParse({ ...base, role: "tercero" }).success).toBe(false);
  });
});
