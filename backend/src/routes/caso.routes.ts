import { Router } from "express";
import {
  asignarCaso,
  cambiarEstadoCaso,
  crearCaso,
  listarCasos,
  obtenerCaso,
  pagarCaso
} from "../controllers/caso.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/rbac";
import { validateBody } from "../middlewares/validate";
import { asignarCasoSchema, cambiarEstadoSchema, crearCasoSchema } from "../schemas/caso.schema";

export const casoRouter = Router();

casoRouter.use(requireAuth);

casoRouter.post("/", requireRole("cliente", "tercero"), validateBody(crearCasoSchema), crearCaso);
casoRouter.get("/", listarCasos);
casoRouter.get("/:id", obtenerCaso);
casoRouter.patch("/:id/asignar", requireRole("empleado", "jefatura"), validateBody(asignarCasoSchema), asignarCaso);
casoRouter.patch("/:id/estado", requireRole("empleado", "jefatura"), validateBody(cambiarEstadoSchema), cambiarEstadoCaso);
casoRouter.patch("/:id/pago", requireRole("cliente", "empleado"), pagarCaso);
