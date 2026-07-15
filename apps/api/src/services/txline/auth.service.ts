import type { TxLineClient } from "./txline.client.js";

export interface ActivateTokenDto {
    txSig: string;
    walletSignature: string;
    leagues: number[];
}
export class AuthService {
    constructor(private txline: TxLineClient) {
        this.txline = txline
    }
    async startGuestSession(): Promise<unknown> {
        return this.txline.get("/auth/guest/start")

    }

    async activateToken(payload: ActivateTokenDto): Promise<unknown> {
        return this.txline.post("/token/activate", payload);
    }
    async getApiToken(): Promise<unknown> {
        return this.txline.get("/token")
    }

    async refreshGuestToken(): Promise<unknown> {
        return this.txline.get("/auth/guest/refresh")

    }



}
