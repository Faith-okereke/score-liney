import "./config/env.js";
import { buildApp } from "./app.js";
import { healthRoutes } from "./routes/health.js";
import { txlineModule } from "./modules/txline/index.js";

async function main() {
  const app = buildApp();

  await app.register(healthRoutes);
  await app.register(txlineModule);

  await app.listen({
    port: 3001,
    host: "0.0.0.0",
  });
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
