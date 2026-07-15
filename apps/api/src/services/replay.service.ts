export interface ReplayFrame {
  minute: number;
  label: string;
  details?: string;
}

export interface ReplayState {
  matchId: number;
  isPlaying: boolean;
  currentMinute: number;
  frames: ReplayFrame[];
}

export class ReplayService {
  createReplay(matchId: number, frames: ReplayFrame[] = []): ReplayState {
    return {
      matchId,
      isPlaying: false,
      currentMinute: 0,
      frames,
    };
  }

  startReplay(replay: ReplayState): ReplayState {
    return {
      ...replay,
      isPlaying: true,
    };
  }

  pauseReplay(replay: ReplayState): ReplayState {
    return {
      ...replay,
      isPlaying: false,
    };
  }

  seekToMinute(replay: ReplayState, minute: number): ReplayState {
    return {
      ...replay,
      currentMinute: Math.max(0, minute),
    };
  }
}
