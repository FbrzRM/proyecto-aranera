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
import {
  asignarCasoSchema,
  cambiarEstadoSchema,
  casoPublicoSchema,
  casoQuerySchema,
  casosPaginadosSchema,
  crearCasoSchema
} from "../schemas/caso.schema";
import { crearEvidenciaSchema, evidenciaPublicaSchema, evidenciasSchema } from "../schemas/evidencia.schema";
import { seguimientosSchema } from "../schemas/seguimiento.schema";
import { crearTerceroSchema, terceroCreadoSchema, tercerosSchema } from "../schemas/tercero.schema";
import { casosVencidosSchema, empleadosMetricasSchema, resumenMetricasSchema } from "../schemas/metrica.schema";
import {
  credencialesSchema,
  crearPedidoSchema,
  pedidoExternoSchema,
  pedidosExternosSchema,
  tokenServicioSchema
} from "../schemas/integracion.schema";

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

const casoIdParams = z.object({ id: z.string() });

registry.registerPath({
  method: "post",
  path: "/v1/casos",
  tags: ["Casos"],
  summary: "Crea un caso: pedido, reclamo o requerimiento (Cliente o Tercero)",
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: crearCasoSchema } } }
  },
  responses: {
    201: { description: "Caso creado", content: { "application/json": { schema: casoPublicoSchema } } },
    400: { description: "Datos invalidos" },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" }
  }
});

registry.registerPath({
  method: "get",
  path: "/v1/casos",
  tags: ["Casos"],
  summary: "Lista casos paginados y filtrables (el Cliente solo ve los suyos)",
  security: [{ bearerAuth: [] }],
  request: { query: casoQuerySchema },
  responses: {
    200: { description: "Listado", content: { "application/json": { schema: casosPaginadosSchema } } },
    401: { description: "No autenticado" }
  }
});

registry.registerPath({
  method: "get",
  path: "/v1/casos/{id}",
  tags: ["Casos"],
  summary: "Obtiene un caso por id",
  security: [{ bearerAuth: [] }],
  request: { params: casoIdParams },
  responses: {
    200: { description: "Caso", content: { "application/json": { schema: casoPublicoSchema } } },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" },
    404: { description: "Caso no encontrado" }
  }
});

registry.registerPath({
  method: "patch",
  path: "/v1/casos/{id}/asignar",
  tags: ["Casos"],
  summary: "Asigna un responsable al caso (Empleado o Jefatura)",
  security: [{ bearerAuth: [] }],
  request: {
    params: casoIdParams,
    body: { content: { "application/json": { schema: asignarCasoSchema } } }
  },
  responses: {
    200: { description: "Caso asignado", content: { "application/json": { schema: casoPublicoSchema } } },
    400: { description: "Responsable invalido" },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" },
    404: { description: "Caso no encontrado" },
    409: { description: "Transicion invalida" }
  }
});

registry.registerPath({
  method: "patch",
  path: "/v1/casos/{id}/estado",
  tags: ["Casos"],
  summary: "Avanza el estado del caso respetando el ciclo de vida (Empleado o Jefatura)",
  security: [{ bearerAuth: [] }],
  request: {
    params: casoIdParams,
    body: { content: { "application/json": { schema: cambiarEstadoSchema } } }
  },
  responses: {
    200: { description: "Estado actualizado", content: { "application/json": { schema: casoPublicoSchema } } },
    400: { description: "Datos invalidos" },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" },
    404: { description: "Caso no encontrado" },
    409: { description: "Transicion invalida" }
  }
});

registry.registerPath({
  method: "patch",
  path: "/v1/casos/{id}/pago",
  tags: ["Casos"],
  summary: "Registra el pago del caso como auditoria (Cliente o Empleado)",
  description:
    "Solo marca el caso como pagado para trazabilidad. No procesa cobros ni integra ninguna pasarela de pago; es un registro manual de auditoria.",
  security: [{ bearerAuth: [] }],
  request: { params: casoIdParams },
  responses: {
    200: { description: "Pago registrado", content: { "application/json": { schema: casoPublicoSchema } } },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" },
    404: { description: "Caso no encontrado" },
    409: { description: "El caso no admite pago" }
  }
});

registry.registerPath({
  method: "get",
  path: "/v1/casos/{id}/seguimientos",
  tags: ["Casos"],
  summary: "Historial inmutable de seguimiento del caso (auditoria)",
  security: [{ bearerAuth: [] }],
  request: { params: casoIdParams },
  responses: {
    200: { description: "Seguimientos", content: { "application/json": { schema: seguimientosSchema } } },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" },
    404: { description: "Caso no encontrado" }
  }
});

registry.registerPath({
  method: "post",
  path: "/v1/casos/{id}/evidencias",
  tags: ["Casos"],
  summary: "Adjunta una evidencia al caso como referencia (Empleado o Jefatura)",
  description:
    "Registra una referencia a la evidencia (nombre y URL). No almacena archivos ni sube binarios; el archivo vive en un almacenamiento externo.",
  security: [{ bearerAuth: [] }],
  request: {
    params: casoIdParams,
    body: { content: { "application/json": { schema: crearEvidenciaSchema } } }
  },
  responses: {
    201: { description: "Evidencia registrada", content: { "application/json": { schema: evidenciaPublicaSchema } } },
    400: { description: "Datos invalidos" },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" },
    404: { description: "Caso no encontrado" }
  }
});

registry.registerPath({
  method: "get",
  path: "/v1/casos/{id}/evidencias",
  tags: ["Casos"],
  summary: "Lista las evidencias del caso",
  security: [{ bearerAuth: [] }],
  request: { params: casoIdParams },
  responses: {
    200: { description: "Evidencias", content: { "application/json": { schema: evidenciasSchema } } },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" },
    404: { description: "Caso no encontrado" }
  }
});

registry.registerPath({
  method: "post",
  path: "/v1/terceros",
  tags: ["Terceros"],
  summary: "Registra un tercero y devuelve sus credenciales una sola vez (solo Administrador)",
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: crearTerceroSchema } } }
  },
  responses: {
    201: { description: "Tercero creado", content: { "application/json": { schema: terceroCreadoSchema } } },
    400: { description: "Datos invalidos" },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" }
  }
});

registry.registerPath({
  method: "get",
  path: "/v1/terceros",
  tags: ["Terceros"],
  summary: "Lista los terceros registrados (Administrador o Jefatura)",
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "Listado", content: { "application/json": { schema: tercerosSchema } } },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" }
  }
});

registry.registerPath({
  method: "post",
  path: "/v1/integracion/token",
  tags: ["Integracion"],
  summary: "Intercambia credenciales de tercero por un token de servicio",
  request: {
    body: { content: { "application/json": { schema: credencialesSchema } } }
  },
  responses: {
    200: { description: "Token emitido", content: { "application/json": { schema: tokenServicioSchema } } },
    400: { description: "Datos invalidos" },
    401: { description: "Credenciales invalidas" }
  }
});

registry.registerPath({
  method: "post",
  path: "/v1/integracion/pedidos",
  tags: ["Integracion"],
  summary: "Crea un pedido desde el canal del tercero (contrato publico)",
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: crearPedidoSchema } } }
  },
  responses: {
    201: { description: "Pedido creado", content: { "application/json": { schema: pedidoExternoSchema } } },
    400: { description: "Datos invalidos" },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" }
  }
});

registry.registerPath({
  method: "get",
  path: "/v1/integracion/pedidos",
  tags: ["Integracion"],
  summary: "Lista los pedidos propios del tercero",
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "Listado", content: { "application/json": { schema: pedidosExternosSchema } } },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" }
  }
});

registry.registerPath({
  method: "get",
  path: "/v1/integracion/pedidos/{id}",
  tags: ["Integracion"],
  summary: "Obtiene un pedido propio del tercero",
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { description: "Pedido", content: { "application/json": { schema: pedidoExternoSchema } } },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" },
    404: { description: "Pedido no encontrado" }
  }
});

registry.registerPath({
  method: "get",
  path: "/v1/metricas/resumen",
  tags: ["Metricas"],
  summary: "Resumen de casos para el dashboard (Jefatura o Administrador)",
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "Resumen", content: { "application/json": { schema: resumenMetricasSchema } } },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" }
  }
});

registry.registerPath({
  method: "get",
  path: "/v1/metricas/empleados",
  tags: ["Metricas"],
  summary: "Carga y desempeno por responsable (Jefatura o Administrador)",
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "KPI por empleado", content: { "application/json": { schema: empleadosMetricasSchema } } },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" }
  }
});

registry.registerPath({
  method: "get",
  path: "/v1/metricas/vencidos",
  tags: ["Metricas"],
  summary: "Casos vencidos segun su plazo (Jefatura o Administrador)",
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "Casos vencidos", content: { "application/json": { schema: casosVencidosSchema } } },
    401: { description: "No autenticado" },
    403: { description: "No autorizado" }
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
