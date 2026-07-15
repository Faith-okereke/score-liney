import type { AnalysisResult } from "./agent.service.js";

export interface ConsensusResult {
  confidence: number;
  recommendation: unknown;
  summary: string;
  signals: string[];
}

export class ConsensusService {
  calculate(predictions: AnalysisResult[]): ConsensusResult {
    if (predictions.length === 0) {
      return {
        confidence: 0,
        recommendation: null,
        summary: "No agent predictions are available yet.",
        signals: [],
      };
    }

    const rankedPredictions = [...predictions].sort((left, right) => right.confidence - left.confidence);
    const totalConfidence = predictions.reduce((sum, prediction) => sum + prediction.confidence, 0);
    const averageConfidence = totalConfidence / predictions.length;

    return {
      confidence: Number(averageConfidence.toFixed(2)),
      recommendation: rankedPredictions[0]?.prediction ?? null,
      summary: `Consensus built from ${predictions.length} agent predictions.`,
      signals: rankedPredictions.map((prediction) => `${prediction.agentName}: ${prediction.reasoning}`),
    };
  }
}
