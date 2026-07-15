import type { TxLineClient } from "../client/txline.client.js";

export async function getOdds(client: TxLineClient): Promise<unknown> {
  return client.get("/odds");
}
