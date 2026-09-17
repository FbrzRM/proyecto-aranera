import { NextFunction, Request, Response } from "express";
import { paginationSchema } from "../schemas/user.schema";
import { EmailEnUsoError, UsuarioNoEncontradoError, userService } from "../services/user.service";

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    if (error instanceof EmailEnUsoError) {
      return res.status(409).json({ error: error.message });
    }
    return next(error);
  }
}

export async function listUsers(req: Request, res: Response) {
  const parsed = paginationSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Parametros invalidos", detalles: parsed.error.flatten() });
  }
  const result = await userService.list(parsed.data);
  return res.status(200).json(result);
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof UsuarioNoEncontradoError) {
      return res.status(404).json({ error: error.message });
    }
    return next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.update(req.params.id, req.body);
    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof UsuarioNoEncontradoError) {
      return res.status(404).json({ error: error.message });
    }
    return next(error);
  }
}
