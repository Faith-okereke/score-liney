import "./config/env.js";
import { env } from "./config/env.js";
import { buildApp } from "./app.js";
import { analysisRoutes } from "./routes/analysis.route.js";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.route.js";
import { matchesRoutes } from "./routes/matches.route.js";
import { oddsRoutes } from "./routes/odds.route.js";
import { replayRoutes } from "./routes/replay.route.js";
import { signalsRoutes } from "./routes/signals.route.js";
import { prisma } from "./lib/prisma.js";
import { redis } from "./plugin/redis.js";

async function main(): Promise<void> {
  const app = buildApp();

  app.addHook("onClose", async () => {
    await redis.close();
    await prisma.$disconnect();
  });

  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(matchesRoutes);
  await app.register(analysisRoutes);
  await app.register(signalsRoutes);
  await app.register(oddsRoutes);
  await app.register(replayRoutes);

  await app.listen({
    port: env.PORT,
    host: env.HOST,
  });
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
