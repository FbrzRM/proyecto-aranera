import { z } from "zod";

export const crearCasoSchema = z.object({
  tipo: z.enum(["pedido", "reclamo", "requerimiento"]),
  categoria: z.enum(["equipo", "consumible", "reactivo"]),
  titulo: z.string().min(1, "Requerido"),
  descripcion: z.string().min(1, "Requerido")
});

export type CrearCasoInput = z.infer<typeof crearCasoSchema>;
