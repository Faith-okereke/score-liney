import type { TxLineClient } from "./txline.client.js";

export class ProofService{
    constructor (private txline: TxLineClient){
        this.txline = txline
     }
     async getFixtureProof(fixtureId: string): Promise<unknown> {
        return this.txline.get(`/proofs/fixture/${fixtureId}`);
     }

    async getOddsProof(fixtureId: string): Promise<unknown> {
        return this.txline.get(`/proofs/odds/${fixtureId}`);
    }

    async getScoreProof(fixtureId: string): Promise<unknown> {
        return this.txline.get(`/proofs/score/${fixtureId}`)
    }
}
