import { categorias } from "../domain/caso";
import { z } from "../openapi/registry";

export const credencialesSchema = z
  .object({
    clientId: z.string().min(1).openapi({ example: "arn_ab12cd34ef56" }),
    clientSecret: z.string().min(1)
  })
  .openapi("CredencialesTercero");

export const tokenServicioSchema = z
  .object({
    token: z.string()
  })
  .openapi("TokenServicio");

export const crearPedidoSchema = z
  .object({
    producto: z.string().min(1).openapi({ example: "Microscopio binocular" }),
    detalle: z.string().min(1).openapi({ example: "10 unidades modelo X" }),
    categoria: z.enum(categorias).openapi({ example: "equipo" })
  })
  .openapi("CrearPedidoExterno");

export const pedidoExternoSchema = z
  .object({
    id: z.string(),
    producto: z.string(),
    detalle: z.string(),
    categoria: z.string(),
    estado: z.string(),
    plazo: z.string(),
    pagado: z.boolean(),
    creadoEn: z.string()
  })
  .openapi("PedidoExterno");

export const pedidosExternosSchema = z
  .object({
    items: z.array(pedidoExternoSchema)
  })
  .openapi("PedidosExternos");

export type CrearPedidoInput = z.infer<typeof crearPedidoSchema>;
export type PedidoExterno = z.infer<typeof pedidoExternoSchema>;
