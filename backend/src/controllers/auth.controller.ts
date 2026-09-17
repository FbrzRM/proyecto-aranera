import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { authService, InvalidCredentialsError } from "../services/auth.service";
import { LoginInput } from "../schemas/auth.schema";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body as LoginInput);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    return next(error);
  }
}

export function me(req: AuthenticatedRequest, res: Response) {
  return res.status(200).json({ user: req.user });
}

export async function refresh(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const result = await authService.refresh(req.user!.sub);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
