import { Router } from "express";
import { createUser, getUser, listUsers, updateUser } from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/rbac";
import { validateBody } from "../middlewares/validate";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";

export const userRouter = Router();

userRouter.use(requireAuth);

userRouter.post("/", requireRole("administrador"), validateBody(createUserSchema), createUser);
userRouter.get("/", requireRole("administrador", "jefatura"), listUsers);
userRouter.get("/:id", requireRole("administrador", "jefatura"), getUser);
userRouter.patch("/:id", requireRole("administrador"), validateBody(updateUserSchema), updateUser);
