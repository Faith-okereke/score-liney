import type {
  TxLineActivationRequest,
  TxLineActivationResponse,
  TxLineFixtureSnapshot,
  TxLineGuestSessionResponse,
} from "../types/index.js";
import {
  txLineActivationResponseSchema,
  txLineGuestSessionResponseSchema,
} from "../txline.schema.js";
import { env } from "../../../config/env.js";

export interface TxLineClientOptions {
  jwt: string;
  apiToken?: string | null;
  baseUrl?: string;
}

export interface TxLineFixtureQuery {
  startEpochDay?: number;
  competitionId?: number;
}

export class TxLineClient {
  private readonly jwt: string;

  private readonly apiToken: string | null;

  private readonly baseUrl: string;

  constructor(options: TxLineClientOptions) {
    this.jwt = options.jwt;
    this.apiToken = options.apiToken ?? null;
    this.baseUrl = (options.baseUrl ?? env.TXLINE_API_ORIGIN ?? "https://txline.txodds.com").replace(/\/+$/, "");
  }

  async startGuestSession(): Promise<TxLineGuestSessionResponse> {
    const response = await this.requestJson<unknown>("/auth/guest/start", {
      method: "POST",
    });

    return txLineGuestSessionResponseSchema.parse(response);
  }

  async activateSubscription(body: TxLineActivationRequest): Promise<TxLineActivationResponse> {
    const response = await this.requestJson<unknown>("/api/token/activate", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return txLineActivationResponseSchema.parse(response);
  }

  async getFixtures(query: TxLineFixtureQuery = {}): Promise<TxLineFixtureSnapshot[]> {
    const url = new URL("/api/fixtures/snapshot", this.baseUrl);

    if (typeof query.startEpochDay === "number") {
      url.searchParams.set("startEpochDay", String(query.startEpochDay));
    }

    if (typeof query.competitionId === "number") {
      url.searchParams.set("competitionId", String(query.competitionId));
    }

    return this.requestJson<TxLineFixtureSnapshot[]>(url);
  }

  private async requestJson<T>(
    pathOrUrl: string | URL,
    init: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(this.resolveUrl(pathOrUrl), {
      ...init,
      headers: this.buildHeaders(init.headers, init.body),
    });

    if (!response.ok) {
      throw new Error(`TxLINE request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  }

  private resolveUrl(pathOrUrl: string | URL): string {
    if (pathOrUrl instanceof URL) {
      return pathOrUrl.toString();
    }

    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
      return pathOrUrl;
    }

    return new URL(pathOrUrl, this.baseUrl).toString();
  }

  private buildHeaders(
    headers: HeadersInit | undefined,
    body: BodyInit | null | undefined
  ): HeadersInit {
    return {
      ...(this.jwt ? { Authorization: `Bearer ${this.jwt}` } : {}),
      ...(this.apiToken ? { "X-Api-Token": this.apiToken } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(headers ?? {}),
    };
  }
}
