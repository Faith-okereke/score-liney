import type { Match } from "@prisma/client";

type MatchRecord = Match & {
  createdAt: Date;
  updatedAt: Date;
};

interface MatchFindManyArgs {
  where?: {
    status?: {
      in?: string[];
    };
  };
  orderBy?: {
    startTime?: "asc" | "desc";
  };
  take?: number;
}

interface MatchFindUniqueArgs {
  where: {
    id: number;
  };
}

interface MatchUpsertArgs {
  where: {
    externalId: number;
  };
  update: Partial<Omit<MatchRecord, "id" | "externalId" | "createdAt" | "updatedAt">>;
  create: Omit<MatchRecord, "id" | "createdAt" | "updatedAt">;
}

interface InMemoryPrisma {
  match: {
    findMany(args: MatchFindManyArgs): Promise<MatchRecord[]>;
    findUnique(args: MatchFindUniqueArgs): Promise<MatchRecord | null>;
    upsert(args: MatchUpsertArgs): Promise<MatchRecord>;
  };
  $transaction<T>(operations: Promise<T>[]): Promise<T[]>;
  $disconnect(): Promise<void>;
}

const matchStore = new Map<number, MatchRecord>();
let nextMatchId = 1;

function toMatchRecord(value: Omit<MatchRecord, "id" | "createdAt" | "updatedAt">, id: number): MatchRecord {
  const now = new Date();

  return {
    ...value,
    id,
    createdAt: now,
    updatedAt: now,
  };
}

function cloneRecord(record: MatchRecord): MatchRecord {
  return {
    ...record,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  };
}

export const prisma: InMemoryPrisma = {
  match: {
    async findMany(args) {
      const records = Array.from(matchStore.values());
      const filtered = args.where?.status?.in
        ? records.filter((record) => args.where?.status?.in?.includes(record.status))
        : records;

      const sorted = [...filtered].sort((left, right) => {
        if (args.orderBy?.startTime === "desc") {
          return right.startTime.getTime() - left.startTime.getTime();
        }

        return left.startTime.getTime() - right.startTime.getTime();
      });

      const take = args.take ?? sorted.length;
      return sorted.slice(0, take).map(cloneRecord);
    },
    async findUnique(args) {
      const match = Array.from(matchStore.values()).find((record) => record.id === args.where.id);
      return match ? cloneRecord(match) : null;
    },
    async upsert(args) {
      const existing = Array.from(matchStore.values()).find(
        (record) => record.externalId === args.where.externalId
      );

      if (existing) {
        const updated: MatchRecord = {
          ...existing,
          ...args.update,
          updatedAt: new Date(),
        };

        matchStore.set(existing.id, updated);
        return cloneRecord(updated);
      }

      const record = toMatchRecord(
        {
          ...args.create,
        },
        nextMatchId++
      );

      matchStore.set(record.id, record);
      return cloneRecord(record);
    },
  },
  async $transaction<T>(operations: Promise<T>[]): Promise<T[]> {
    return Promise.all(operations);
  },
  async $disconnect(): Promise<void> {
    return undefined;
  },
};
