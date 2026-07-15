import type { TxLineClient } from "./txline.client.js";

export class OddsService {
    constructor(private txline: TxLineClient){
        this.txline = txline
    }

    async getLatestOdds(fixtureId: number): Promise<unknown> {
        return this.txline.get(`/odds/latest/${fixtureId}`)     
    }

    async getHistoricalOdds(fixtureId: number): Promise<unknown> {
        return this.txline.get(`/odds/historical/${fixtureId}`)
    }

    async getOddsTimeline(fixtureId: number): Promise<unknown> {
        return this.txline.get(`/odds/timeline/${fixtureId}`)
    }

    async getStablePrices(fixtureId: number): Promise<unknown> {
        return this.txline.get(`/odds/stable-prices/${fixtureId}`)
    }
}
