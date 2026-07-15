import { successResponse, type ApiSuccessResponse } from "../lib/http.js";
import type { OddsService } from "../services/txline/odds.service.js";

export interface OddsFixturePayload {
  fixtureId: number;
  data: unknown;
}

export class OddsController {
  constructor(private readonly oddsService: OddsService) {}

  async getLatest(fixtureId: number): Promise<ApiSuccessResponse<OddsFixturePayload>> {
    const data = await this.oddsService.getLatestOdds(fixtureId);
    return successResponse({
      fixtureId,
      data,
    });
  }

  async getHistorical(fixtureId: number): Promise<ApiSuccessResponse<OddsFixturePayload>> {
    const data = await this.oddsService.getHistoricalOdds(fixtureId);
    return successResponse({
      fixtureId,
      data,
    });
  }

  async getTimeline(fixtureId: number): Promise<ApiSuccessResponse<OddsFixturePayload>> {
    const data = await this.oddsService.getOddsTimeline(fixtureId);
    return successResponse({
      fixtureId,
      data,
    });
  }

  async getStablePrices(fixtureId: number): Promise<ApiSuccessResponse<OddsFixturePayload>> {
    const data = await this.oddsService.getStablePrices(fixtureId);
    return successResponse({
      fixtureId,
      data,
    });
  }
}
