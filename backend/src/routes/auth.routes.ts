import { Router } from "express";
import { login, me } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate";
import { loginSchema } from "../schemas/auth.schema";

export const authRouter = Router();

authRouter.post("/login", validateBody(loginSchema), login);
authRouter.get("/me", requireAuth, me);
