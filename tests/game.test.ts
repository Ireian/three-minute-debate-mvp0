import { describe, expect, it } from "vitest";
import { CARD_IDS, type CardId } from "../src/game/cards";
import {
  createInitialState,
  drawHand,
  playCard,
  restartGame,
  type GameState,
} from "../src/game/game";

const fixedRandom = () => 0;

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...createInitialState(fixedRandom),
    hand: ["supported-claim", "distinction", "clarify-terms"],
    ...overrides,
  };
}

describe("card draw", () => {
  it("draws three distinct cards from the six-card pool", () => {
    const hand = drawHand(fixedRandom);

    expect(hand).toHaveLength(3);
    expect(new Set(hand).size).toBe(3);
    expect(hand.every((cardId) => CARD_IDS.includes(cardId))).toBe(true);
  });
});

describe("MVP-0 turn resolution", () => {
  it("creates the first round with a three-card hand", () => {
    const state = createInitialState(fixedRandom);

    expect(state).toMatchObject({
      playerIntegrity: 10,
      opponentIntegrity: 10,
      round: 1,
      status: "playing",
      nextCardDamageBonus: 0,
    });
    expect(state.hand).toHaveLength(3);
  });

  it("restarts with full integrity and clears transient state", () => {
    expect(restartGame(fixedRandom)).toMatchObject({
      playerIntegrity: 10,
      opponentIntegrity: 10,
      round: 1,
      status: "playing",
      nextCardDamageBonus: 0,
    });
  });

  it("resolves a supported claim, opponent response, and new hand", () => {
    expect(
      playCard(makeState(), "supported-claim", fixedRandom),
    ).toMatchObject({
      playerIntegrity: 8,
      opponentIntegrity: 7,
      round: 2,
      status: "playing",
    });
  });

  it("applies both self-risk and opponent response for a bold claim", () => {
    const state = makeState({
      hand: ["bold-claim", "supported-claim", "distinction"],
    });

    expect(playCard(state, "bold-claim", fixedRandom)).toMatchObject({
      playerIntegrity: 7,
      opponentIntegrity: 6,
    });
  });

  it("heals before the opponent responds when questioning a premise", () => {
    const state = makeState({
      playerIntegrity: 5,
      hand: ["question-premise", "supported-claim", "distinction"],
    });

    expect(playCard(state, "question-premise", fixedRandom)).toMatchObject({
      playerIntegrity: 4,
      opponentIntegrity: 8,
    });
  });

  it("strengthens a counterexample when the opponent is not weaker", () => {
    const strongState = makeState({
      playerIntegrity: 6,
      opponentIntegrity: 8,
      hand: ["counterexample", "supported-claim", "distinction"],
    });
    const weakState = makeState({
      playerIntegrity: 8,
      opponentIntegrity: 6,
      hand: ["counterexample", "supported-claim", "distinction"],
    });

    expect(
      playCard(strongState, "counterexample", fixedRandom).opponentIntegrity,
    ).toBe(5);
    expect(
      playCard(weakState, "counterexample", fixedRandom).opponentIntegrity,
    ).toBe(4);
  });

  it("stores and consumes the distinction bonus on the next card", () => {
    const afterDistinction = playCard(
      makeState(),
      "distinction",
      fixedRandom,
    );
    const nextState = {
      ...afterDistinction,
      hand: ["supported-claim", "bold-claim", "question-premise"] as CardId[],
    };
    const afterClaim = playCard(nextState, "supported-claim", fixedRandom);

    expect(afterDistinction.nextCardDamageBonus).toBe(2);
    expect(afterClaim.opponentIntegrity).toBe(4);
    expect(afterClaim.nextCardDamageBonus).toBe(0);
  });

  it("reduces the current opponent response after clarifying terms", () => {
    expect(playCard(makeState(), "clarify-terms", fixedRandom)).toMatchObject({
      playerIntegrity: 9,
      opponentIntegrity: 8,
    });
  });

  it("wins before the opponent can respond", () => {
    const state = makeState({ opponentIntegrity: 1, round: 4 });

    expect(playCard(state, "supported-claim", fixedRandom)).toMatchObject({
      playerIntegrity: 10,
      opponentIntegrity: 0,
      round: 4,
      status: "won",
    });
  });

  it("loses when the opponent response removes the player's integrity", () => {
    const state = makeState({ playerIntegrity: 2, round: 2 });

    expect(playCard(state, "supported-claim", fixedRandom)).toMatchObject({
      playerIntegrity: 0,
      opponentIntegrity: 7,
      round: 2,
      status: "lost",
    });
  });

  it("loses after the fifth round if the opponent remains standing", () => {
    const state = makeState({ round: 5 });

    expect(playCard(state, "supported-claim", fixedRandom)).toMatchObject({
      playerIntegrity: 8,
      opponentIntegrity: 7,
      round: 5,
      status: "lost",
    });
  });

  it("ignores cards that are not in the current hand", () => {
    const state = makeState();

    expect(playCard(state, "bold-claim", fixedRandom)).toBe(state);
  });

  it("ignores input after the debate has ended", () => {
    const endedState = makeState({ status: "won", opponentIntegrity: 0 });

    expect(playCard(endedState, "supported-claim", fixedRandom)).toBe(
      endedState,
    );
  });
});
