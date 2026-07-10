export interface TxLineGuestSessionResponse {
  token: string;
}

export interface TxLineActivationRequest {
  txSig: string;
  walletSignature: string;
  leagues: number[];
}

export interface TxLineActivationResponse {
  token: string;
}

export interface TxLineFixtureSnapshot {
  Ts: number;
  StartTime: number;
  Competition: string;
  CompetitionId: number;
  FixtureGroupId: number;
  Participant1Id: number;
  Participant1: string;
  Participant2Id: number;
  Participant2: string;
  FixtureId: number;
  Participant1IsHome: boolean;
  [key: string]: unknown;
}

