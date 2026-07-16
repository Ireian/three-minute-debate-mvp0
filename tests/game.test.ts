import { describe, expect, it } from "vitest";
import {
  createInitialState,
  playClaim,
  type GameState,
} from "../src/game/game";

describe("MVP-0 turn resolution", () => {
  it("creates the first of five rounds with both sides at full integrity", () => {
    expect(createInitialState()).toEqual({
      playerIntegrity: 10,
      opponentIntegrity: 10,
      round: 1,
      status: "playing",
      message: "选择主张，开始第一回合。",
    });
  });

  it("resolves the claim, opponent response, and advances the round", () => {
    expect(playClaim(createInitialState())).toMatchObject({
      playerIntegrity: 8,
      opponentIntegrity: 7,
      round: 2,
      status: "playing",
    });
  });

  it("wins before the opponent can respond", () => {
    const state: GameState = {
      playerIntegrity: 4,
      opponentIntegrity: 1,
      round: 4,
      status: "playing",
      message: "",
    };

    expect(playClaim(state)).toMatchObject({
      playerIntegrity: 4,
      opponentIntegrity: 0,
      round: 4,
      status: "won",
    });
  });

  it("loses when the opponent response removes the player's integrity", () => {
    const state: GameState = {
      playerIntegrity: 2,
      opponentIntegrity: 10,
      round: 2,
      status: "playing",
      message: "",
    };

    expect(playClaim(state)).toMatchObject({
      playerIntegrity: 0,
      opponentIntegrity: 7,
      round: 2,
      status: "lost",
    });
  });

  it("loses after the fifth round if the opponent remains standing", () => {
    const state: GameState = {
      playerIntegrity: 10,
      opponentIntegrity: 10,
      round: 5,
      status: "playing",
      message: "",
    };

    expect(playClaim(state)).toMatchObject({
      playerIntegrity: 8,
      opponentIntegrity: 7,
      round: 5,
      status: "lost",
    });
  });

  it("ignores input after the debate has ended", () => {
    const endedState: GameState = {
      playerIntegrity: 4,
      opponentIntegrity: 0,
      round: 4,
      status: "won",
      message: "辩论结束",
    };

    expect(playClaim(endedState)).toBe(endedState);
  });
});
