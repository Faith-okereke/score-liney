import type { TxLineClient, TxLineFixtureQuery } from "../client/txline.client.js";
import type { TxLineFixtureSnapshot } from "../types/index.js";

export async function getFixtures(
  client: TxLineClient,
  query: TxLineFixtureQuery = {}
): Promise<TxLineFixtureSnapshot[]> {
  return client.getFixtures(query);
}

