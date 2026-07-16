export interface GameState {
  playerIntegrity: number;
  opponentIntegrity: number;
  round: number;
  status: GameStatus;
  message: string;
}

export type GameStatus = "playing" | "won" | "lost";

export const INITIAL_INTEGRITY = 10;
export const CLAIM_DAMAGE = 3;
export const OPPONENT_RESPONSE_DAMAGE = 2;
export const MAX_ROUNDS = 5;

export function createInitialState(): GameState {
  return {
    playerIntegrity: INITIAL_INTEGRITY,
    opponentIntegrity: INITIAL_INTEGRITY,
    round: 1,
    status: "playing",
    message: "选择主张，开始第一回合。",
  };
}

export function playClaim(state: GameState): GameState {
  if (state.status !== "playing") {
    return state;
  }

  const opponentIntegrity = Math.max(0, state.opponentIntegrity - CLAIM_DAMAGE);

  if (opponentIntegrity === 0) {
    return {
      ...state,
      opponentIntegrity,
      status: "won",
      message: `你在第 ${state.round} 回合击破了对方论证。`,
    };
  }

  const playerIntegrity = Math.max(
    0,
    state.playerIntegrity - OPPONENT_RESPONSE_DAMAGE,
  );

  if (playerIntegrity === 0) {
    return {
      ...state,
      playerIntegrity,
      opponentIntegrity,
      status: "lost",
      message: `对手在第 ${state.round} 回合击破了你的论证。`,
    };
  }

  if (state.round >= MAX_ROUNDS) {
    return {
      ...state,
      playerIntegrity,
      opponentIntegrity,
      status: "lost",
      message: "五回合结束，你未能击破对方论证。",
    };
  }

  return {
    ...state,
    playerIntegrity,
    opponentIntegrity,
    round: state.round + 1,
    message: `主张命中，对手回应：你的完整度 −${OPPONENT_RESPONSE_DAMAGE}。`,
  };
}
