import { NextFunction, Request, Response } from "express";
import { TerceroNoEncontradoError, terceroService } from "../services/tercero.service";

export async function crearTercero(req: Request, res: Response) {
  const tercero = await terceroService.crear(req.body);
  return res.status(201).json(tercero);
}

export async function listarTerceros(_req: Request, res: Response) {
  const result = await terceroService.listar();
  return res.status(200).json(result);
}

export async function actualizarTercero(req: Request, res: Response, next: NextFunction) {
  try {
    const tercero = await terceroService.actualizar(req.params.id, req.body);
    return res.status(200).json(tercero);
  } catch (error) {
    if (error instanceof TerceroNoEncontradoError) {
      return res.status(404).json({ error: error.message });
    }
    return next(error);
  }
}
