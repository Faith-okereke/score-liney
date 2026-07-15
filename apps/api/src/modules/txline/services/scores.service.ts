import type { TxLineClient } from "../client/txline.client.js";

export async function getScores(client: TxLineClient): Promise<unknown> {
  return client.get("/scores");
}
