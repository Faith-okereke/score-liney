import type { FastifyPluginAsync, FastifyReply } from "fastify";
import { redis } from "../../plugin/redis.js";
import { TxLineClient } from "./client/txline.client.js";
import { activateSubscription } from "./auth/activate.js";
import { startGuestSession } from "./auth/guest.js";
import { getFixtures } from "./services/fixtures.service.js";
import {
  txLineActivationRequestSchema,
  txLineAuthStatusSchema,
  type TxLineActivationRequest,
} from "./txline.schema.js";
import { env } from "../../config/env.js";

interface TxLineModuleOptions {
  apiOrigin?: string;
  apiTokenKey?: string;
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface ApiFailureResponse {
  success: false;
  message: string;
  error: string;
}

interface GuestSessionData {
  token: string;
}

interface ActivationData {
  token: string;
}

interface TestData {
  fixtures: unknown[];
}

interface AuthStatusData {
  guestSessionActive: boolean;
  apiTokenStored: boolean;
  ready: boolean;
}

const DEFAULT_API_TOKEN_KEY = "txline:api-token";
const V1_PREFIX = "/api/v1/txline";

function successResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

function failureResponse(message: string, error: string): ApiFailureResponse {
  return {
    success: false,
    message,
    error,
  };
}

export const txlineModule: FastifyPluginAsync<TxLineModuleOptions> = async (
  app,
  options
) => {
  const apiOrigin = options.apiOrigin ?? env.TXLINE_API_ORIGIN ?? "https://txline.txodds.com";
  const apiTokenKey = options.apiTokenKey ?? DEFAULT_API_TOKEN_KEY;

  let guestJwt: string | null = null;

  async function getStoredApiToken(): Promise<string | null> {
    const token = await redis.get(apiTokenKey);
    return token ?? null;
  }

  function createClient(apiToken?: string | null): TxLineClient {
    if (!guestJwt) {
      throw new Error("TxLINE guest session has not been started yet.");
    }

    return new TxLineClient({
      jwt: guestJwt,
      apiToken: apiToken ?? null,
      baseUrl: apiOrigin,
    });
  }

  async function startGuestSessionRoute(): Promise<ApiSuccessResponse<GuestSessionData>> {
    const client = new TxLineClient({
      jwt: "",
      baseUrl: apiOrigin,
    });

    const response = await startGuestSession(client);
    guestJwt = response.token;
    app.log.info("TxLINE guest session started");

    return successResponse<GuestSessionData>(response);
  }

  async function activateTokenRoute(
    body: TxLineActivationRequest,
    reply: FastifyReply
  ): Promise<ApiSuccessResponse<ActivationData> | void> {
    if (!guestJwt) {
      reply.status(409).send(
        failureResponse(
          "Guest session required",
          "Start a guest session before activating a token."
        )
      );
      return;
    }

    const client = createClient();
    const response = await activateSubscription(client, body);

    await redis.set(apiTokenKey, response.token);
    app.log.info("TxLINE token activated and stored");

    return successResponse<ActivationData>(response);
  }

  async function testRoute(
    reply: FastifyReply
  ): Promise<ApiSuccessResponse<TestData> | void> {
    const apiToken = await getStoredApiToken();

    if (!guestJwt || !apiToken) {
      reply.status(409).send(
        failureResponse(
          "TxLINE auth incomplete",
          "Start a guest session and activate a token first."
        )
      );
      return;
    }

    const client = createClient(apiToken);
    const fixtures = await getFixtures(client);

    return successResponse<TestData>({
      fixtures,
    });
  }

  async function authStatusRoute(): Promise<ApiSuccessResponse<AuthStatusData>> {
    const apiToken = await getStoredApiToken();
    const status = txLineAuthStatusSchema.parse({
      guestSessionActive: guestJwt !== null,
      apiTokenStored: apiToken !== null,
      ready: guestJwt !== null && apiToken !== null,
    });

    return successResponse<AuthStatusData>(status);
  }

  app.post(`${V1_PREFIX}/auth/guest/start`, async () => {
    return startGuestSessionRoute();
  });

  app.post(`${V1_PREFIX}/token/activate`, async (request, reply) => {
    const parsedBody = txLineActivationRequestSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send(
        failureResponse(
          "Invalid activation payload",
          "Expected txSig, walletSignature, and leagues[]"
        )
      );
    }

    return activateTokenRoute(parsedBody.data, reply);
  });

  app.get(`${V1_PREFIX}/auth/status`, async () => {
    return authStatusRoute();
  });

  app.get("/api/v1/test", async (_request, reply) => {
    return testRoute(reply);
  });

  app.post("/api/txline/auth/guest/start", async () => {
    return startGuestSessionRoute();
  });

  app.post("/api/txline/token/activate", async (request, reply) => {
    const parsedBody = txLineActivationRequestSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send(
        failureResponse(
          "Invalid activation payload",
          "Expected txSig, walletSignature, and leagues[]"
        )
      );
    }

    return activateTokenRoute(parsedBody.data, reply);
  });

  app.get("/api/test", async (_request, reply) => {
    return testRoute(reply);
  });
};
