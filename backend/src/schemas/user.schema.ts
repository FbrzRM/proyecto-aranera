import { roles } from "../domain/roles";
import { z } from "../openapi/registry";

export const createUserSchema = z
  .object({
    email: z.string().email().openapi({ example: "empleado@araneda.cl" }),
    nombre: z.string().min(1).openapi({ example: "Juan Perez" }),
    password: z.string().min(6).openapi({ example: "Clave123" }),
    role: z.enum(roles).openapi({ example: "empleado" })
  })
  .openapi("CrearUsuario");

export const updateUserSchema = z
  .object({
    nombre: z.string().min(1).optional(),
    password: z.string().min(6).optional(),
    role: z.enum(roles).optional(),
    activo: z.boolean().optional()
  })
  .openapi("ActualizarUsuario");

export const usuarioPublicoSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    nombre: z.string(),
    role: z.string(),
    activo: z.boolean()
  })
  .openapi("Usuario");

export const usuariosPaginadosSchema = z
  .object({
    items: z.array(usuarioPublicoSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number()
  })
  .openapi("UsuariosPaginados");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
