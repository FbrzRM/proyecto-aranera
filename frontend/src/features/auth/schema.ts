import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo invalido"),
  password: z.string().min(6, "Minimo 6 caracteres")
});

export type LoginInput = z.infer<typeof loginSchema>;
