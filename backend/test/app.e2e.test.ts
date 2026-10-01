import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

const app = createApp();

describe("app (sin base de datos)", () => {
  it("GET /health responde 200", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("expone cabeceras de seguridad y oculta x-powered-by", async () => {
    const res = await request(app).get("/health");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });

  it("valida el body del login y responde 400", async () => {
    const res = await request(app).post("/v1/auth/login").send({ email: "no-es-email" });
    expect(res.status).toBe(400);
  });

  it("protege rutas internas: 401 sin token", async () => {
    const res = await request(app).get("/v1/usuarios");
    expect(res.status).toBe(401);
  });

  it("rechaza JSON malformado con 400", async () => {
    const res = await request(app)
      .post("/v1/auth/login")
      .set("Content-Type", "application/json")
      .send("{not-json");
    expect(res.status).toBe(400);
  });
});
