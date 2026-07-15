import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { OddsController } from "../controllers/odd.controller.js";
import { txlineOddsService } from "../lib/container.js";
import { failureResponse } from "../lib/http.js";

const fixtureIdParamsSchema = z.object({
  fixtureId: z.coerce.number().int().positive(),
});

export const oddsRoutes: FastifyPluginAsync = async (app) => {
  const controller = new OddsController(txlineOddsService);

  app.get("/api/v1/odds/latest/:fixtureId", async (request, reply) => {
    const params = fixtureIdParamsSchema.safeParse(request.params);

    if (!params.success) {
      return reply.status(400).send(
        failureResponse(
          "Invalid fixture id",
          "The fixture id parameter must be a positive integer."
        )
      );
    }

    return controller.getLatest(params.data.fixtureId);
  });

  app.get("/api/v1/odds/historical/:fixtureId", async (request, reply) => {
    const params = fixtureIdParamsSchema.safeParse(request.params);

    if (!params.success) {
      return reply.status(400).send(
        failureResponse(
          "Invalid fixture id",
          "The fixture id parameter must be a positive integer."
        )
      );
    }

    return controller.getHistorical(params.data.fixtureId);
  });

  app.get("/api/v1/odds/timeline/:fixtureId", async (request, reply) => {
    const params = fixtureIdParamsSchema.safeParse(request.params);

    if (!params.success) {
      return reply.status(400).send(
        failureResponse(
          "Invalid fixture id",
          "The fixture id parameter must be a positive integer."
        )
      );
    }

    return controller.getTimeline(params.data.fixtureId);
  });

  app.get("/api/v1/odds/stable-prices/:fixtureId", async (request, reply) => {
    const params = fixtureIdParamsSchema.safeParse(request.params);

    if (!params.success) {
      return reply.status(400).send(
        failureResponse(
          "Invalid fixture id",
          "The fixture id parameter must be a positive integer."
        )
      );
    }

    return controller.getStablePrices(params.data.fixtureId);
  });
};
