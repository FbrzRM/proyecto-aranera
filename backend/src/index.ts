import { createApp } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { seedAdminUser } from "./config/seed";
import { registrarObservadores } from "./observers/seguimiento.observer";

async function bootstrap() {
  await connectDatabase();
  await seedAdminUser();
  registrarObservadores();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Araneda API escuchando en el puerto ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("No se pudo iniciar la API", error);
  process.exit(1);
});
