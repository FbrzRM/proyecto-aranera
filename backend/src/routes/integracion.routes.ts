import { Router } from "express";
import { crearPedido, emitirToken, listarPedidos, obtenerPedido } from "../controllers/integracion.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/rbac";
import { validateBody } from "../middlewares/validate";
import { crearPedidoSchema } from "../schemas/integracion.schema";

export const integracionRouter = Router();

integracionRouter.post("/token", emitirToken);
integracionRouter.post("/pedidos", requireAuth, requireRole("tercero"), validateBody(crearPedidoSchema), crearPedido);
integracionRouter.get("/pedidos", requireAuth, requireRole("tercero"), listarPedidos);
integracionRouter.get("/pedidos/:id", requireAuth, requireRole("tercero"), obtenerPedido);
