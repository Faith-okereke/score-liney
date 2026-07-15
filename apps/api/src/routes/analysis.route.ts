import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { agentService, consensusService, matchService, reasoningService, signalService } from "../lib/container.js";
import { failureResponse, successResponse } from "../lib/http.js";

const analysisParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const analysisRoutes: FastifyPluginAsync = async (app) => {
  app.get("/api/v1/analysis/:id", async (request, reply) => {
    const params = analysisParamsSchema.safeParse(request.params);

    if (!params.success) {
      return reply.status(400).send(
        failureResponse(
          "Invalid match id",
          "The analysis match id parameter must be a positive integer."
        )
      );
    }

    const match = await matchService.getMatchDetails(params.data.id);

    if (!match) {
      return reply.status(404).send(
        failureResponse(
          "Analysis not found",
          `No match exists for id ${params.data.id}.`
        )
      );
    }

    const predictions = await agentService.runAgents(match.id);
    const consensus = consensusService.calculate(predictions);

    return successResponse({
      match,
      reasoning: reasoningService.summarize(predictions),
      predictions,
      consensus,
      signals: signalService.buildSignals(predictions),
    });
  });
};
