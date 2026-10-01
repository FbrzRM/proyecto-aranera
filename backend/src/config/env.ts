import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV ?? "development";
const jwtSecret = process.env.JWT_SECRET ?? "dev-secret-change-me";

if (nodeEnv === "production" && jwtSecret === "dev-secret-change-me") {
  throw new Error("JWT_SECRET debe definirse con un valor propio en produccion");
}

export const env = {
  nodeEnv,
  port: Number(process.env.PORT ?? 3000),
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
  mongoUri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/araneda",
  corsOrigins: (process.env.CORS_ORIGINS ?? "*").split(",").map((origin) => origin.trim())
};
