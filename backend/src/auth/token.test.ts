import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import { env } from "../config/env";
import { firmarToken } from "./token";

describe("firmarToken", () => {
  it("firma un token que puede verificarse con el secreto", () => {
    const token = firmarToken({ sub: "u1", email: "admin@araneda.cl", role: "administrador" });
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string; email: string; role: string };
    expect(payload.sub).toBe("u1");
    expect(payload.email).toBe("admin@araneda.cl");
    expect(payload.role).toBe("administrador");
  });

  it("produce un token invalido frente a un secreto distinto", () => {
    const token = firmarToken({ sub: "u1", email: "admin@araneda.cl", role: "administrador" });
    expect(() => jwt.verify(token, "otro-secreto")).toThrow();
  });
});
