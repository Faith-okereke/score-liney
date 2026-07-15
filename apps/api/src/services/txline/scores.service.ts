import type { TxLineClient } from "./txline.client.js";

export class ScoresService {
    constructor(private txline: TxLineClient) { }

    async getLiveScore(fixtureId: number): Promise<unknown> {
        return this.txline.get(`/scores/${fixtureId}`);
    }

    async getScoreTimeline(fixtureId: number): Promise<unknown> {
        return this.txline.get(`/scores/${fixtureId}`)
    }

    async getHistoricalScores(fixtureId: number): Promise<unknown> {
        return this.txline.get(`/scores/${fixtureId}`)

    }
}
