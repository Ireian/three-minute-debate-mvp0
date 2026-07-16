export interface GameState {
  playerIntegrity: number;
  opponentIntegrity: number;
}

export const INITIAL_INTEGRITY = 10;
export const CLAIM_DAMAGE = 3;

export function createInitialState(): GameState {
  return {
    playerIntegrity: INITIAL_INTEGRITY,
    opponentIntegrity: INITIAL_INTEGRITY,
  };
}

export function playClaim(state: GameState): GameState {
  return {
    ...state,
    opponentIntegrity: Math.max(0, state.opponentIntegrity - CLAIM_DAMAGE),
  };
}

