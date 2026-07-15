import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  TXLINE_API_ORIGIN: z.string().url().optional(),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(3001),
});

function parseEnvFile(): Record<string, string> {
  const envPath = fileURLToPath(new URL("../../.env", import.meta.url));
  const entries: Record<string, string> = {};

  let fileContents: string;

  try {
    fileContents = readFileSync(envPath, "utf8");
  } catch {
    return entries;
  }

  for (const rawLine of fileContents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key) {
      entries[key] = value;
    }
  }

  return entries;
}

const parsedEnv = envSchema.parse({
  ...parseEnvFile(),
  ...process.env,
});

Object.assign(process.env, parsedEnv);

export const env = parsedEnv;
