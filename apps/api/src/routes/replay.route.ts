import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { matchService, replayService } from "../lib/container.js";
import { failureResponse, successResponse } from "../lib/http.js";

const replayParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const replayRoutes: FastifyPluginAsync = async (app) => {
  app.get("/api/v1/replay/:id", async (request, reply) => {
    const params = replayParamsSchema.safeParse(request.params);

    if (!params.success) {
      return reply.status(400).send(
        failureResponse(
          "Invalid match id",
          "The replay match id parameter must be a positive integer."
        )
      );
    }

    const match = await matchService.getMatchDetails(params.data.id);

    if (!match) {
      return reply.status(404).send(
        failureResponse(
          "Replay not found",
          `No match exists for id ${params.data.id}.`
        )
      );
    }

    const replay = replayService.createReplay(match.id);

    return successResponse({
      match,
      replay,
    });
  });
};
