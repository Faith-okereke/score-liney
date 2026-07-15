
import type { Match } from "../../generated/prisma/client.js";
import type { MatchService } from "../matches.service.js";

export interface AnalysisResult {
  agentName: string;
  prediction: unknown;
  confidence: number;
  reasoning: string;
}

export interface MatchContext {
  match: Match;
}

export interface ReasoningModule {
  readonly agentName: string;
  analyze(context: MatchContext): Promise<AnalysisResult>;
}

export class AgentService {
  private readonly agents: ReasoningModule[];

  constructor(
    private readonly matchService: MatchService,
    ...agents: ReasoningModule[]
  ) {
    this.agents = agents;
  }

  async runAgents(matchId: number): Promise<AnalysisResult[]> {
    const match = await this.matchService.getMatchDetails(matchId);

    if (!match) {
      throw new Error(`Match with ID ${matchId} was not found.`);
    }

    if (this.agents.length === 0) {
      return [];
    }

    const context: MatchContext = {
      match,
    };

    return Promise.all(this.agents.map((agent) => agent.analyze(context)));
  }
}
