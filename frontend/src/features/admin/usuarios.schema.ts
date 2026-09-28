import { z } from "zod";

export const crearUsuarioSchema = z.object({
  nombre: z.string().min(1, "Requerido"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  role: z.enum(["administrador", "jefatura", "empleado", "cliente"])
});

export type CrearUsuarioInput = z.infer<typeof crearUsuarioSchema>;
