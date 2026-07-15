import type { FastifyPluginAsync, FastifyReply } from "fastify";
import { env } from "../../config/env.js";
import { redis } from "../../plugin/redis.js";
import { failureResponse, successResponse, type ApiSuccessResponse } from "../../lib/http.js";
import { TxLineClient } from "./client/txline.client.js";
import { activateSubscription } from "./auth/activate.js";
import { startGuestSession } from "./auth/guest.js";
import { getFixtures } from "./services/fixtures.service.js";
import {
  txLineActivationRequestSchema,
  txLineAuthStatusSchema,
  type TxLineActivationRequest,
} from "./txline.schema.js";

interface TxLineModuleOptions {
  apiOrigin?: string;
  apiTokenKey?: string;
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

async function sendFailure(
  reply: FastifyReply,
  statusCode: number,
  message: string,
  error: string
): Promise<void> {
  await reply.status(statusCode).send(failureResponse(message, error));
}

export const txlineModule: FastifyPluginAsync<TxLineModuleOptions> = async (app, options) => {
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

    return successResponse(response);
  }

  async function activateTokenRoute(
    body: TxLineActivationRequest,
    reply: FastifyReply
  ): Promise<ApiSuccessResponse<ActivationData> | void> {
    if (!guestJwt) {
      await sendFailure(
        reply,
        409,
        "Guest session required",
        "Start a guest session before activating a token."
      );
      return;
    }

    const client = createClient();
    const response = await activateSubscription(client, body);

    await redis.set(apiTokenKey, response.token);
    app.log.info("TxLINE token activated and stored");

    return successResponse(response);
  }

  async function testRoute(reply: FastifyReply): Promise<ApiSuccessResponse<TestData> | void> {
    const apiToken = await getStoredApiToken();

    if (!guestJwt || !apiToken) {
      await sendFailure(
        reply,
        409,
        "TxLINE auth incomplete",
        "Start a guest session and activate a token first."
      );
      return;
    }

    const client = createClient(apiToken);
    const fixtures = await getFixtures(client);

    return successResponse({
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

    return successResponse(status);
  }

  app.post(`${V1_PREFIX}/auth/guest/start`, async () => {
    return startGuestSessionRoute();
  });

  app.post(`${V1_PREFIX}/token/activate`, async (request, reply) => {
    const parsedBody = txLineActivationRequestSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return sendFailure(
        reply,
        400,
        "Invalid activation payload",
        "Expected txSig, walletSignature, and leagues[]."
      );
    }

    return activateTokenRoute(parsedBody.data, reply);
  });

  app.get(`${V1_PREFIX}/auth/status`, async () => {
    return authStatusRoute();
  });

  app.get(`${V1_PREFIX}/test`, async (_request, reply) => {
    return testRoute(reply);
  });
};
