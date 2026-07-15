import type { Match } from "@prisma/client";
import { failureResponse, successResponse, type ApiFailureResponse, type ApiSuccessResponse } from "../lib/http.js";
import type { MatchService } from "../services/matches.service.js";

export interface MatchListPayload {
  matches: Match[];
}

export interface MatchDetailPayload {
  match: Match;
}

export interface MatchSyncPayload {
  count: number;
}

export class MatchesController {
  constructor(private readonly matchService: MatchService) {}

  async list(): Promise<ApiSuccessResponse<MatchListPayload>> {
    const matches = await this.matchService.getDashboardMatches();
    return successResponse({
      matches,
    });
  }

  async getById(id: number): Promise<ApiSuccessResponse<MatchDetailPayload> | ApiFailureResponse> {
    const match = await this.matchService.getMatchDetails(id);

    if (!match) {
      return failureResponse("Match not found", `No match exists for id ${id}.`);
    }

    return successResponse({
      match,
    });
  }

  async sync(): Promise<ApiSuccessResponse<MatchSyncPayload>> {
    const result = await this.matchService.syncLiveMatches();
    return successResponse(result);
  }
}
