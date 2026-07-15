import type { AnalysisResult } from "./agent.service.js";

export interface Signal {
  label: string;
  confidence: number;
  reasoning: string;
}

export class SignalService {
  buildSignals(results: AnalysisResult[]): Signal[] {
    return results.map((result) => ({
      label: result.agentName,
      confidence: result.confidence,
      reasoning: result.reasoning,
    }));
  }
}
