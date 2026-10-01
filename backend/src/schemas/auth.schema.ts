import { loginSchema as loginBase } from "@araneda/shared";
import { z } from "../openapi/registry";

export const loginSchema = loginBase.openapi("LoginInput");

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
