import { env } from "../../config/env.js";

export interface TxLineClientOptions {
  baseUrl?: string;
  apiToken?: string | null;
  jwt?: string | null;
}

export class TxLineClient {
  private readonly baseUrl: string;

  private readonly apiToken: string | null;

  private readonly jwt: string | null;

  constructor(options: TxLineClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? env.TXLINE_API_ORIGIN ?? "https://txline.txodds.com").replace(/\/+$/, "");
    this.apiToken = options.apiToken ?? null;
    this.jwt = options.jwt ?? null;
  }

  async get<T>(path: string): Promise<T> {
    return this.requestJson<T>(path, {
      method: "GET",
    });
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return this.requestJson<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async refreshToken(): Promise<void> {
    throw new Error("Generic TxLINE client does not manage token refresh.");
  }

  private async requestJson<T>(pathOrUrl: string, init: RequestInit): Promise<T> {
    const response = await fetch(this.resolveUrl(pathOrUrl), {
      ...init,
      headers: this.buildHeaders(init.headers, init.body),
    });

    if (!response.ok) {
      throw new Error(`TxLINE request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  }

  private resolveUrl(pathOrUrl: string): string {
    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
      return pathOrUrl;
    }

    return new URL(pathOrUrl, this.baseUrl).toString();
  }

  private buildHeaders(headers: HeadersInit | undefined, body: BodyInit | null | undefined): HeadersInit {
    return {
      ...(this.jwt ? { Authorization: `Bearer ${this.jwt}` } : {}),
      ...(this.apiToken ? { "X-Api-Token": this.apiToken } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(headers ?? {}),
    };
  }
}
