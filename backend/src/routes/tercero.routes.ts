import { Router } from "express";
import { crearTercero, listarTerceros } from "../controllers/tercero.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/rbac";
import { validateBody } from "../middlewares/validate";
import { crearTerceroSchema } from "../schemas/tercero.schema";

export const terceroRouter = Router();

terceroRouter.use(requireAuth);

terceroRouter.post("/", requireRole("administrador"), validateBody(crearTerceroSchema), crearTercero);
terceroRouter.get("/", requireRole("administrador", "jefatura"), listarTerceros);
