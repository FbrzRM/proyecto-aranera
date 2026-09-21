import { Request, Response } from "express";
import { terceroService } from "../services/tercero.service";

export async function crearTercero(req: Request, res: Response) {
  const tercero = await terceroService.crear(req.body);
  return res.status(201).json(tercero);
}

export async function listarTerceros(_req: Request, res: Response) {
  const result = await terceroService.listar();
  return res.status(200).json(result);
}
