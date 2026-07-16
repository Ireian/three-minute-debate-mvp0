import { CARD_IDS, getCard, type CardId } from "./cards";

export type GameStatus = "playing" | "won" | "lost";
export type RandomSource = () => number;

export interface GameState {
  playerIntegrity: number;
  opponentIntegrity: number;
  round: number;
  status: GameStatus;
  message: string;
  hand: CardId[];
  nextCardDamageBonus: number;
}

export const INITIAL_INTEGRITY = 10;
export const OPPONENT_RESPONSE_DAMAGE = 2;
export const MAX_ROUNDS = 5;
export const HAND_SIZE = 3;

export function drawHand(random: RandomSource = Math.random): CardId[] {
  const pool = [...CARD_IDS];

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  return pool.slice(0, HAND_SIZE);
}

export function createInitialState(
  random: RandomSource = Math.random,
): GameState {
  return {
    playerIntegrity: INITIAL_INTEGRITY,
    opponentIntegrity: INITIAL_INTEGRITY,
    round: 1,
    status: "playing",
    message: "从三张卡中选择一张，开始第一回合。",
    hand: drawHand(random),
    nextCardDamageBonus: 0,
  };
}

export function restartGame(random: RandomSource = Math.random): GameState {
  return createInitialState(random);
}
export function playCard(
  state: GameState,
  cardId: CardId,
  random: RandomSource = Math.random,
): GameState {
  if (state.status !== "playing" || !state.hand.includes(cardId)) {
    return state;
  }

  const card = getCard(cardId);
  const conditionalBonus =
    card.bonusDamageWhenOpponentNotWeaker !== undefined &&
    state.opponentIntegrity >= state.playerIntegrity
      ? card.bonusDamageWhenOpponentNotWeaker
      : 0;
  const damage =
    card.baseDamage + conditionalBonus + state.nextCardDamageBonus;
  const opponentIntegrity = Math.max(0, state.opponentIntegrity - damage);
  const playerAfterCard = Math.min(
    INITIAL_INTEGRITY,
    Math.max(
      0,
      state.playerIntegrity - (card.selfDamage ?? 0) + (card.selfHeal ?? 0),
    ),
  );
  const nextCardDamageBonus = card.nextCardDamageBonus ?? 0;

  if (playerAfterCard === 0) {
    return {
      ...state,
      playerIntegrity: 0,
      opponentIntegrity,
      status: "lost",
      nextCardDamageBonus,
      message: `${card.name}使你的论证先崩溃了。`,
    };
  }

  if (opponentIntegrity === 0) {
    return {
      ...state,
      playerIntegrity: playerAfterCard,
      opponentIntegrity,
      status: "won",
      nextCardDamageBonus,
      message: `${card.name}造成 ${damage} 点影响；你在第 ${state.round} 回合获胜。`,
    };
  }

  const responseDamage = Math.max(
    0,
    OPPONENT_RESPONSE_DAMAGE - (card.responseReduction ?? 0),
  );
  const playerIntegrity = Math.max(0, playerAfterCard - responseDamage);

  if (playerIntegrity === 0) {
    return {
      ...state,
      playerIntegrity,
      opponentIntegrity,
      status: "lost",
      nextCardDamageBonus,
      message: `${card.name}造成 ${damage} 点影响，但对手的回应击破了你。`,
    };
  }

  if (state.round >= MAX_ROUNDS) {
    return {
      ...state,
      playerIntegrity,
      opponentIntegrity,
      status: "lost",
      nextCardDamageBonus,
      message: "五回合结束，你未能击破对方论证。",
    };
  }

  const bonusMessage =
    nextCardDamageBonus > 0
      ? ` 下一张卡额外造成 ${nextCardDamageBonus} 点影响。`
      : "";

  return {
    ...state,
    playerIntegrity,
    opponentIntegrity,
    round: state.round + 1,
    hand: drawHand(random),
    nextCardDamageBonus,
    message: `${card.name}造成 ${damage} 点影响；对手回应 −${responseDamage}。${bonusMessage}`,
  };
}
