import type { Match } from "@prisma/client";
import type { TxLineFixture } from "./txline/fixture.service.js";

export interface MatchFindManyArgs {
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

export interface MatchFindUniqueArgs {
  where: {
    id: number;
  };
}

export interface MatchUpsertArgs {
  where: {
    externalId: number;
  };
  update: Partial<Omit<Match, "id" | "externalId" | "createdAt" | "updatedAt">>;
  create: Omit<Match, "id" | "createdAt" | "updatedAt">;
}

export interface PrismaLike {
  match: {
    findMany(args: MatchFindManyArgs): Promise<Match[]>;
    findUnique(args: MatchFindUniqueArgs): Promise<Match | null>;
    upsert(args: MatchUpsertArgs): Promise<Match>;
  };
  $transaction<T>(operations: Promise<T>[]): Promise<T[]>;
}

export interface MatchSyncResult {
  count: number;
}

export class MatchService {
  constructor(
    private readonly fixtures: {
      getLiveFixtures(): Promise<TxLineFixture[]>;
    },
    private readonly prisma: PrismaLike
  ) {}

  async syncLiveMatches(): Promise<MatchSyncResult> {
    const liveFixtures = await this.fixtures.getLiveFixtures();

    if (liveFixtures.length === 0) {
      return { count: 0 };
    }

    const upserts = liveFixtures.map((fixture) =>
      this.prisma.match.upsert({
        where: {
          externalId: fixture.id,
        },
        update: {
          name: fixture.name,
          homeTeamName: fixture.homeTeam.name,
          awayTeamName: fixture.awayTeam.name,
          startTime: new Date(fixture.date),
          status: fixture.status,
        },
        create: {
          externalId: fixture.id,
          name: fixture.name,
          homeTeamName: fixture.homeTeam.name,
          awayTeamName: fixture.awayTeam.name,
          startTime: new Date(fixture.date),
          status: fixture.status,
        },
      })
    );

    const results = await this.prisma.$transaction(upserts);
    return { count: results.length };
  }

  async getDashboardMatches(): Promise<Match[]> {
    return this.prisma.match.findMany({
      where: {
        status: {
          in: ["LIVE", "UPCOMING", "IN_PLAY"],
        },
      },
      orderBy: {
        startTime: "asc",
      },
      take: 20,
    });
  }

  async getMatchDetails(id: number): Promise<Match | null> {
    return this.prisma.match.findUnique({
      where: {
        id,
      },
    });
  }
}
