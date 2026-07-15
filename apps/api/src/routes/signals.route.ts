import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { agentService, matchService, signalService } from "../lib/container.js";
import { failureResponse, successResponse } from "../lib/http.js";

const signalParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const signalsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/api/v1/signals", async () => {
    return successResponse({
      signals: [],
    });
  });

  app.get("/api/v1/signals/:id", async (request, reply) => {
    const params = signalParamsSchema.safeParse(request.params);

    if (!params.success) {
      return reply.status(400).send(
        failureResponse(
          "Invalid match id",
          "The signal match id parameter must be a positive integer."
        )
      );
    }

    const match = await matchService.getMatchDetails(params.data.id);

    if (!match) {
      return reply.status(404).send(
        failureResponse(
          "Signals not found",
          `No match exists for id ${params.data.id}.`
        )
      );
    }

    const predictions = await agentService.runAgents(match.id);

    return successResponse({
      match,
      signals: signalService.buildSignals(predictions),
    });
  });
};
