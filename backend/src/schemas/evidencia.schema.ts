import { z } from "../openapi/registry";

export const crearEvidenciaSchema = z
  .object({
    nombre: z.string().min(1).openapi({ example: "foto_empaque.jpg" }),
    url: z.string().url().openapi({ example: "https://archivos.araneda.cl/evidencias/123.jpg" }),
    descripcion: z.string().optional()
  })
  .openapi("CrearEvidencia");

export const evidenciaPublicaSchema = z
  .object({
    id: z.string(),
    casoId: z.string(),
    nombre: z.string(),
    url: z.string(),
    descripcion: z.string().nullable(),
    autorId: z.string(),
    creadoEn: z.string()
  })
  .openapi("Evidencia");

export const evidenciasSchema = z
  .object({
    items: z.array(evidenciaPublicaSchema)
  })
  .openapi("Evidencias");

export type CrearEvidenciaInput = z.infer<typeof crearEvidenciaSchema>;
