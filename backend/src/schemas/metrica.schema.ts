import { z } from "../openapi/registry";
import { casoPublicoSchema } from "./caso.schema";

export const resumenMetricasSchema = z
  .object({
    total: z.number(),
    conResponsable: z.number(),
    sinResponsable: z.number(),
    vencidos: z.number(),
    pagados: z.number(),
    porcentajeConResponsable: z.number(),
    porcentajeVencidos: z.number(),
    porEstado: z.record(z.number()),
    porTipo: z.record(z.number())
  })
  .openapi("ResumenMetricas");

export const cargaEmpleadoSchema = z
  .object({
    responsableId: z.string(),
    nombre: z.string(),
    total: z.number(),
    abiertos: z.number(),
    vencidos: z.number()
  })
  .openapi("CargaEmpleado");

export const empleadosMetricasSchema = z
  .object({
    items: z.array(cargaEmpleadoSchema)
  })
  .openapi("EmpleadosMetricas");

export const casosVencidosSchema = z
  .object({
    items: z.array(casoPublicoSchema),
    total: z.number()
  })
  .openapi("CasosVencidos");
