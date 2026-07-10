import { Redis } from "ioredis";
import { env } from "../config/env.js";

const redisClient = new Redis(env.REDIS_URL, {
  lazyConnect: true,
});

let connected = false;

redisClient.on("error", (error) => {
  console.log("Redis Client Error", error);
});

async function ensureConnected(): Promise<void> {
  if (connected) {
    return;
  }

  await redisClient.connect();
  connected = true;
}

export const redis = {
  async get(key: string): Promise<string | null> {
    await ensureConnected();
    return redisClient.get(key);
  },
  async set(key: string, value: string): Promise<"OK" | null> {
    await ensureConnected();
    return redisClient.set(key, value);
  },
};

