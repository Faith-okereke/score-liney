import Fastify from "fastify";
import cors from "@fastify/cors";
import { failureResponse } from "./lib/http.js";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  void app.register(cors, {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  });

  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);
    const message = error instanceof Error ? error.message : "Unexpected server error";
    void reply.status(500).send(
      failureResponse(
        "Internal server error",
        message
      )
    );
  });

  return app;
}
