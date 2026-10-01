import { crearCasoSchema as crearCasoBase } from "@araneda/shared";
import { estadosCaso, tiposCaso } from "../domain/caso";
import { z } from "../openapi/registry";

export const crearCasoSchema = crearCasoBase.openapi("CrearCaso");

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
