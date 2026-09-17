import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry, z } from "./registry";
import { loginResponseSchema, loginSchema } from "../schemas/auth.schema";

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT"
});

registry.registerPath({
  method: "post",
  path: "/v1/auth/login",
  tags: ["Auth"],
  summary: "Inicia sesion y devuelve un JWT",
  request: {
    body: {
      content: {
        "application/json": { schema: loginSchema }
      }
    }
  },
  responses: {
    200: {
      description: "Sesion iniciada",
      content: {
        "application/json": { schema: loginResponseSchema }
      }
    },
    400: { description: "Datos invalidos" },
    401: { description: "Credenciales invalidas" }
  }
});

registry.registerPath({
  method: "get",
  path: "/v1/auth/me",
  tags: ["Auth"],
  summary: "Devuelve el usuario autenticado",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Usuario autenticado",
      content: {
        "application/json": {
          schema: z.object({
            user: z.object({
              sub: z.string(),
              email: z.string(),
              role: z.string()
            })
          })
        }
      }
    },
    401: { description: "Token invalido o requerido" }
  }
});

export function buildOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Araneda API",
      version: "1.0.0",
      description: "API de gestion de casos (pedidos, reclamos y requerimientos)"
    },
    servers: [{ url: "/" }]
  });
}
