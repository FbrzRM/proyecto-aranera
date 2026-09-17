import { Router } from "express";
import { login, me, refresh } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate";
import { loginSchema } from "../schemas/auth.schema";

export const authRouter = Router();

authRouter.post("/login", validateBody(loginSchema), login);
authRouter.get("/me", requireAuth, me);
authRouter.post("/refresh", requireAuth, refresh);
