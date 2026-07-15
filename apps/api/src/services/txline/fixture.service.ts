import type { TxLineClient } from "./txline.client.js";

export interface TxLineFixture {
  id: number;
  name: string;
  homeTeam: {
    name: string;
  };
  awayTeam: {
    name: string;
  };
  date: string;
  status: string;
}

export class FixturesService {
    constructor(private txline: TxLineClient) {
        this.txline = txline;

    }

    async getLiveFixtures(): Promise<TxLineFixture[]> {
        return this.txline.get("/fixtures/live");
    }

    async getFixtureById(fixtureId: number): Promise<TxLineFixture> {
        return this.txline.get(`/fixtures/${fixtureId}`)
    }

    async getUpcomingFixtures(): Promise<TxLineFixture[]> {
        return this.txline.get("/fixtures/upcoming");
    }

    async getHistoricalFixtures(): Promise<TxLineFixture[]> {
        return this.txline.get("/fixtures/historical");

    }
}
