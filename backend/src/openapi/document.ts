import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry, z } from "./registry";
import { loginResponseSchema, loginSchema } from "../schemas/auth.schema";
import {
  createUserSchema,
  paginationSchema,
  updateUserSchema,
  usuarioPublicoSchema,
  usuariosPaginadosSchema
} from "../schemas/user.schema";

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

registry.registerPath({
  method: "post",
  path: "/v1/auth/refresh",
  tags: ["Auth"],
  summary: "Renueva el JWT del usuario autenticado",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Token renovado",
      content: { "application/json": { schema: loginResponseSchema } }
    },
    401: { description: "Token invalido o requerido" }
  }
});

const idParams = z.object({ id: z.string() });

registry.registerPath({
  method: "post",
  path: "/v1/usuarios",
  tags: ["Usuarios"],
  summary: "Crea un usuario (solo Administrador)",
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: createUserSchema } } }
  },
  responses: {
    201: { description: "Usuario creado", content: { "application/json": { schema: usuarioPublicoSchema } } },
    400: { description: "Datos invalidos" },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" },
    409: { description: "El email ya esta en uso" }
  }
});

registry.registerPath({
  method: "get",
  path: "/v1/usuarios",
  tags: ["Usuarios"],
  summary: "Lista usuarios paginados (Administrador o Jefatura)",
  security: [{ bearerAuth: [] }],
  request: { query: paginationSchema },
  responses: {
    200: { description: "Listado", content: { "application/json": { schema: usuariosPaginadosSchema } } },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" }
  }
});

registry.registerPath({
  method: "get",
  path: "/v1/usuarios/{id}",
  tags: ["Usuarios"],
  summary: "Obtiene un usuario por id (Administrador o Jefatura)",
  security: [{ bearerAuth: [] }],
  request: { params: idParams },
  responses: {
    200: { description: "Usuario", content: { "application/json": { schema: usuarioPublicoSchema } } },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" },
    404: { description: "Usuario no encontrado" }
  }
});

registry.registerPath({
  method: "patch",
  path: "/v1/usuarios/{id}",
  tags: ["Usuarios"],
  summary: "Actualiza un usuario (solo Administrador)",
  security: [{ bearerAuth: [] }],
  request: {
    params: idParams,
    body: { content: { "application/json": { schema: updateUserSchema } } }
  },
  responses: {
    200: { description: "Usuario actualizado", content: { "application/json": { schema: usuarioPublicoSchema } } },
    400: { description: "Datos invalidos" },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" },
    404: { description: "Usuario no encontrado" }
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
