import { Router } from "express";
import { empleados, resumen, vencidos } from "../controllers/metrica.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/rbac";

export const metricaRouter = Router();

metricaRouter.use(requireAuth, requireRole("jefatura", "administrador"));

metricaRouter.get("/resumen", resumen);
metricaRouter.get("/empleados", empleados);
metricaRouter.get("/vencidos", vencidos);
