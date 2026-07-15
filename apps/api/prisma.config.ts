import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";

function loadDatabaseUrl(): string | undefined {
  const envPath = fileURLToPath(new URL("./.env", import.meta.url));

  try {
    const fileContents = readFileSync(envPath, "utf8");

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

      if (key === "DATABASE_URL" && value) {
        return value;
      }
    }
  } catch {
    return undefined;
  }

  return undefined;
}

const databaseUrl = process.env.DATABASE_URL ?? loadDatabaseUrl();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    ...(databaseUrl ? { url: databaseUrl } : {}),
  },
});
