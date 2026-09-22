import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { credencialesSchema } from "../schemas/integracion.schema";
import { AccesoDenegadoError, CasoNoEncontradoError } from "../services/caso.service";
import { CredencialesInvalidasError, integracionService } from "../services/integracion.service";

export async function emitirToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const parsed = credencialesSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos invalidos", detalles: parsed.error.flatten() });
  }
  try {
    const result = await integracionService.emitirToken(parsed.data.clientId, parsed.data.clientSecret);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof CredencialesInvalidasError) {
      return res.status(401).json({ error: error.message });
    }
    return next(error);
  }
}

export async function crearPedido(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const pedido = await integracionService.crearPedido(req.user!.sub, req.body);
    return res.status(201).json(pedido);
  } catch (error) {
    return next(error);
  }
}

export async function listarPedidos(req: AuthenticatedRequest, res: Response) {
  const result = await integracionService.listarPedidos(req.user!.sub);
  return res.status(200).json(result);
}

export async function obtenerPedido(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const pedido = await integracionService.obtenerPedido(req.user!.sub, req.params.id);
    return res.status(200).json(pedido);
  } catch (error) {
    if (error instanceof CasoNoEncontradoError || error instanceof AccesoDenegadoError) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    return next(error);
  }
}
