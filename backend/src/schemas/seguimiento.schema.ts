import { z } from "../openapi/registry";

export const seguimientoPublicoSchema = z
  .object({
    id: z.string(),
    casoId: z.string(),
    accion: z.string(),
    descripcion: z.string(),
    autorId: z.string(),
    estado: z.string().nullable(),
    creadoEn: z.string()
  })
  .openapi("Seguimiento");

export const seguimientosSchema = z
  .object({
    items: z.array(seguimientoPublicoSchema)
  })
  .openapi("Seguimientos");
