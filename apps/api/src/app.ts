import Fastify from "fastify";
import cors from "@fastify/cors";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  void app.register(cors, {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  });

  return app;
}
