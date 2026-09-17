import { z } from "../openapi/registry";

export const loginSchema = z
  .object({
    email: z.string().email().openapi({ example: "admin@araneda.cl" }),
    password: z.string().min(6).openapi({ example: "Admin123" })
  })
  .openapi("LoginInput");

export const loginResponseSchema = z
  .object({
    token: z.string(),
    user: z.object({
      id: z.string(),
      email: z.string(),
      nombre: z.string(),
      role: z.string()
    })
  })
  .openapi("LoginResponse");

export type LoginInput = z.infer<typeof loginSchema>;
