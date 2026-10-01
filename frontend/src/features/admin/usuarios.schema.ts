import { rolesUsuario } from "@araneda/shared";
import { z } from "zod";

export { crearUsuarioSchema } from "@araneda/shared";
export type { CrearUsuarioInput } from "@araneda/shared";

export const editarUsuarioSchema = z.object({
  nombre: z.string().min(1, "Requerido"),
  role: z.enum(rolesUsuario),
  activo: z.boolean(),
  password: z.union([z.string().min(6, "Mínimo 6 caracteres"), z.literal("")])
});

export type EditarUsuarioInput = z.infer<typeof editarUsuarioSchema>;
