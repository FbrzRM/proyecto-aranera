import { NextFunction, Response } from "express";
import { Role } from "../domain/roles";
import { AuthenticatedRequest } from "./auth.middleware";

export function requireRole(...allowed: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }
    if (!allowed.includes(req.user.role as Role)) {
      return res.status(403).json({ error: "No autorizado" });
    }
    return next();
  };
}
