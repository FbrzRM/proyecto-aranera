import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function firmarToken(payload: { sub: string; email: string; role: string }): string {
  const options = { expiresIn: env.jwtExpiresIn } as jwt.SignOptions;
  return jwt.sign(payload, env.jwtSecret, options);
}
