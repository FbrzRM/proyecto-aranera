import { Request, Response } from "express";
import { metricaService } from "../services/metrica.service";

export async function resumen(_req: Request, res: Response) {
  return res.status(200).json(await metricaService.resumen());
}

export async function empleados(_req: Request, res: Response) {
  return res.status(200).json(await metricaService.empleados());
}

export async function vencidos(_req: Request, res: Response) {
  return res.status(200).json(await metricaService.vencidos());
}
