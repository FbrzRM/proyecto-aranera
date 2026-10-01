import { NextFunction, Request, Response } from "express";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "JSON inválido" });
  }

  console.error("[error]", err instanceof Error ? err.stack ?? err.message : err);
  return res.status(500).json({ error: "Error interno del servidor" });
}
