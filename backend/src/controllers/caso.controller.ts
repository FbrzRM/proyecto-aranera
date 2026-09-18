import { NextFunction, Response } from "express";
import { Role } from "../domain/roles";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { casoQuerySchema } from "../schemas/caso.schema";
import {
  AccesoDenegadoError,
  Actor,
  CasoNoEncontradoError,
  PagoInvalidoError,
  ResponsableInvalidoError,
  TransicionInvalidaError,
  casoService
} from "../services/caso.service";

function actorDe(req: AuthenticatedRequest): Actor {
  return { sub: req.user!.sub, role: req.user!.role as Role };
}

function manejar(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof CasoNoEncontradoError) {
    return res.status(404).json({ error: error.message });
  }
  if (error instanceof AccesoDenegadoError) {
    return res.status(403).json({ error: error.message });
  }
  if (error instanceof TransicionInvalidaError || error instanceof PagoInvalidoError) {
    return res.status(409).json({ error: error.message });
  }
  if (error instanceof ResponsableInvalidoError) {
    return res.status(400).json({ error: error.message });
  }
  return next(error);
}

export async function crearCaso(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const caso = await casoService.crear(req.body, req.user!.sub);
    return res.status(201).json(caso);
  } catch (error) {
    return manejar(error, res, next);
  }
}

export async function listarCasos(req: AuthenticatedRequest, res: Response) {
  const parsed = casoQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Parametros invalidos", detalles: parsed.error.flatten() });
  }
  const result = await casoService.listar(parsed.data, actorDe(req));
  return res.status(200).json(result);
}

export async function obtenerCaso(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const caso = await casoService.obtener(req.params.id, actorDe(req));
    return res.status(200).json(caso);
  } catch (error) {
    return manejar(error, res, next);
  }
}

export async function asignarCaso(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const caso = await casoService.asignar(req.params.id, req.body.responsableId);
    return res.status(200).json(caso);
  } catch (error) {
    return manejar(error, res, next);
  }
}

export async function cambiarEstadoCaso(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const caso = await casoService.cambiarEstado(req.params.id, req.body.estado);
    return res.status(200).json(caso);
  } catch (error) {
    return manejar(error, res, next);
  }
}

export async function pagarCaso(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const caso = await casoService.registrarPago(req.params.id, actorDe(req));
    return res.status(200).json(caso);
  } catch (error) {
    return manejar(error, res, next);
  }
}
