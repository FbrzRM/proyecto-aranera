import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
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

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
  app.get("/v1/openapi.json", (_req, res) => res.json(openApiDocument));
  app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.use("/v1/auth", authRouter);
  app.use("/v1/usuarios", userRouter);
  app.use("/v1/casos", casoRouter);
  app.use("/v1/terceros", terceroRouter);
  app.use("/v1/integracion", integracionRouter);
  app.use("/v1/metricas", metricaRouter);

  app.use(errorHandler);

  return app;
}
