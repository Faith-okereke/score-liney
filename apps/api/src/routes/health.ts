import type { FastifyPluginAsync } from "fastify";
import { successResponse } from "../lib/http.js";

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get("/health", async () => {
    return successResponse({
      status: "ok",
      service: "Athena API",
    });
  });

  app.get("/api/v1/health", async () => {
    return successResponse({
      status: "ok",
      service: "Athena API",
    });
  });
};
