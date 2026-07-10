import type { TxLineClient } from "../client/txline.client.js";
import type {
  TxLineActivationRequest,
  TxLineActivationResponse,
} from "../types/index.js";

export async function activateSubscription(
  client: TxLineClient,
  body: TxLineActivationRequest
): Promise<TxLineActivationResponse> {
  return client.activateSubscription(body);
}

