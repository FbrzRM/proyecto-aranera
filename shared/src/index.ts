import { z } from "zod";

export const rolesUsuario = ["administrador", "jefatura", "empleado", "cliente"] as const;
export const tiposCaso = ["pedido", "reclamo", "requerimiento"] as const;
export const categoriasCaso = ["equipo", "consumible", "reactivo"] as const;

export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres")
});
export type LoginInput = z.infer<typeof loginSchema>;

export const crearUsuarioSchema = z.object({
  nombre: z.string().min(1, "Requerido"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  role: z.enum(rolesUsuario)
});
export type CrearUsuarioInput = z.infer<typeof crearUsuarioSchema>;

export const crearCasoSchema = z.object({
  tipo: z.enum(tiposCaso),
  categoria: z.enum(categoriasCaso),
  titulo: z.string().min(1, "Requerido"),
  descripcion: z.string().min(1, "Requerido")
});
export type CrearCasoInput = z.infer<typeof crearCasoSchema>;
