import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/error.middleware";
import { authRouter } from "./routes/auth.routes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
  app.use("/v1/auth", authRouter);

  app.use(errorHandler);

  return app;
}
