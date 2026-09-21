import { z } from "../openapi/registry";

export const crearTerceroSchema = z
  .object({
    nombre: z.string().min(1).openapi({ example: "Distribuidora Andina" })
  })
  .openapi("CrearTercero");

export const terceroCreadoSchema = z
  .object({
    id: z.string(),
    nombre: z.string(),
    clientId: z.string(),
    clientSecret: z.string(),
    activo: z.boolean()
  })
  .openapi("TerceroCreado");

export const terceroPublicoSchema = z
  .object({
    id: z.string(),
    nombre: z.string(),
    clientId: z.string(),
    activo: z.boolean()
  })
  .openapi("Tercero");

export const tercerosSchema = z
  .object({
    items: z.array(terceroPublicoSchema)
  })
  .openapi("Terceros");

export type CrearTerceroInput = z.infer<typeof crearTerceroSchema>;
