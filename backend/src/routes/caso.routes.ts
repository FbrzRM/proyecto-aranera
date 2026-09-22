import { Router } from "express";
import {
  agregarEvidencia,
  asignarCaso,
  cambiarEstadoCaso,
  crearCaso,
  listarCasos,
  listarEvidencias,
  listarSeguimientos,
  obtenerCaso,
  pagarCaso
} from "../controllers/caso.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/rbac";
import { validateBody } from "../middlewares/validate";
import { asignarCasoSchema, cambiarEstadoSchema, crearCasoSchema } from "../schemas/caso.schema";
import { crearEvidenciaSchema } from "../schemas/evidencia.schema";

export const casoRouter = Router();

const rolesInternos = requireRole("cliente", "empleado", "jefatura", "administrador");

casoRouter.use(requireAuth);

casoRouter.post("/", requireRole("cliente"), validateBody(crearCasoSchema), crearCaso);
casoRouter.get("/", rolesInternos, listarCasos);
casoRouter.get("/:id", rolesInternos, obtenerCaso);
casoRouter.patch("/:id/asignar", requireRole("empleado", "jefatura"), validateBody(asignarCasoSchema), asignarCaso);
casoRouter.patch("/:id/estado", requireRole("empleado", "jefatura"), validateBody(cambiarEstadoSchema), cambiarEstadoCaso);
casoRouter.patch("/:id/pago", requireRole("cliente", "empleado"), pagarCaso);
casoRouter.get("/:id/seguimientos", rolesInternos, listarSeguimientos);
casoRouter.post("/:id/evidencias", requireRole("empleado", "jefatura"), validateBody(crearEvidenciaSchema), agregarEvidencia);
casoRouter.get("/:id/evidencias", rolesInternos, listarEvidencias);
