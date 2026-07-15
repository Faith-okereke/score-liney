import { env } from "../config/env.js";
import { prisma } from "./prisma.js";
import { TxLineClient } from "../services/txline/txline.client.js";
import { FixturesService } from "../services/txline/fixture.service.js";
import { OddsService } from "../services/txline/odds.service.js";
import { ScoresService } from "../services/txline/scores.service.js";
import { ProofService } from "../services/txline/proof.service.js";
import { AuthService } from "../services/txline/auth.service.js";
import { MatchService } from "../services/matches.service.js";
import { AgentService } from "../services/ai/agent.service.js";
import { ConsensusService } from "../services/ai/consensus.service.js";
import { ReasoningService } from "../services/ai/reasoning.service.js";
import { SignalService } from "../services/ai/signal.service.js";
import { ReplayService } from "../services/replay.service.js";

export const txLineClient = new TxLineClient({
  ...(env.TXLINE_API_ORIGIN ? { baseUrl: env.TXLINE_API_ORIGIN } : {}),
});

export const txlineAuthService = new AuthService(txLineClient);
export const txlineFixturesService = new FixturesService(txLineClient);
export const txlineOddsService = new OddsService(txLineClient);
export const txlineScoresService = new ScoresService(txLineClient);
export const txlineProofService = new ProofService(txLineClient);

export const matchService = new MatchService(txlineFixturesService, prisma);
export const agentService = new AgentService(matchService);
export const consensusService = new ConsensusService();
export const reasoningService = new ReasoningService();
export const signalService = new SignalService();
export const replayService = new ReplayService();
