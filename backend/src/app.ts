import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";
import { buildOpenApiDocument } from "./openapi/document";
import { authRouter } from "./routes/auth.routes";
import { casoRouter } from "./routes/caso.routes";
import { integracionRouter } from "./routes/integracion.routes";
import { metricaRouter } from "./routes/metrica.routes";
import { terceroRouter } from "./routes/tercero.routes";
import { userRouter } from "./routes/user.routes";

export function createApp() {
  const app = express();
  const openApiDocument = buildOpenApiDocument();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: env.corsOrigins.includes("*") ? true : env.corsOrigins }));
  app.use(express.json({ limit: "1mb" }));

  const apiLimiter = rateLimit({ windowMs: 60_000, max: 300, standardHeaders: true, legacyHeaders: false });
  const authLimiter = rateLimit({ windowMs: 60_000, max: 10, standardHeaders: true, legacyHeaders: false });

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
  app.get("/v1/openapi.json", (_req, res) => res.json(openApiDocument));
  app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use("/v1", apiLimiter);
  app.use("/v1/auth", authLimiter, authRouter);
  app.use("/v1/usuarios", userRouter);
  app.use("/v1/casos", casoRouter);
  app.use("/v1/terceros", terceroRouter);
  app.use("/v1/integracion", integracionRouter);
  app.use("/v1/metricas", metricaRouter);

  app.use(errorHandler);

  return app;
}
