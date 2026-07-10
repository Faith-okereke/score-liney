import type { TxLineClient } from "../client/txline.client.js";
import type { TxLineGuestSessionResponse } from "../types/index.js";

export async function startGuestSession(
  client: TxLineClient
): Promise<TxLineGuestSessionResponse> {
  return client.startGuestSession();
}

