import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { MatchesController } from "../controllers/matches.controller.js";
import { matchService } from "../lib/container.js";
import { failureResponse } from "../lib/http.js";

const matchIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const matchesRoutes: FastifyPluginAsync = async (app) => {
  const controller = new MatchesController(matchService);

  app.get("/api/v1/matches", async () => {
    return controller.list();
  });

  app.get("/api/v1/matches/:id", async (request, reply) => {
    const params = matchIdParamsSchema.safeParse(request.params);

    if (!params.success) {
      return reply.status(400).send(
        failureResponse(
          "Invalid match id",
          "The match id parameter must be a positive integer."
        )
      );
    }

    const result = await controller.getById(params.data.id);

    if (result.success === false) {
      return reply.status(404).send(result);
    }

    return result;
  });

  app.post("/api/v1/matches/sync", async () => {
    return controller.sync();
  });
};
