import { categorias, estadosCaso, tiposCaso } from "../domain/caso";
import { z } from "../openapi/registry";

export const crearCasoSchema = z
  .object({
    tipo: z.enum(tiposCaso).openapi({ example: "pedido" }),
    categoria: z.enum(categorias).openapi({ example: "equipo" }),
    titulo: z.string().min(1).openapi({ example: "Compra de centrifuga" }),
    descripcion: z.string().min(1).openapi({ example: "Se requiere una centrifuga para el laboratorio" })
  })
  .openapi("CrearCaso");

export const asignarCasoSchema = z
  .object({
    responsableId: z.string().min(1)
  })
  .openapi("AsignarCaso");

export const cambiarEstadoSchema = z
  .object({
    estado: z.enum(estadosCaso).openapi({ example: "recibido" })
  })
  .openapi("CambiarEstadoCaso");

export const casoPublicoSchema = z
  .object({
    id: z.string(),
    tipo: z.string(),
    categoria: z.string(),
    titulo: z.string(),
    descripcion: z.string(),
    clienteId: z.string(),
    responsableId: z.string().nullable(),
    estado: z.string(),
    plazo: z.string(),
    pagado: z.boolean(),
    creadoEn: z.string(),
    actualizadoEn: z.string()
  })
  .openapi("Caso");

export const casosPaginadosSchema = z
  .object({
    items: z.array(casoPublicoSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number()
  })
  .openapi("CasosPaginados");

export const casoQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  estado: z.enum(estadosCaso).optional(),
  tipo: z.enum(tiposCaso).optional(),
  responsableId: z.string().optional(),
  vencidos: z.enum(["true", "false"]).optional()
});

export type CrearCasoInput = z.infer<typeof crearCasoSchema>;
export type CasoQuery = z.infer<typeof casoQuerySchema>;
