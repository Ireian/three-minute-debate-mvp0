import { describe, expect, it } from "vitest";
import { getCard } from "../src/game/cards";
import {
  MAX_ROUNDS,
  createInitialState,
  playCard,
  type RandomSource,
} from "../src/game/game";

function createSeededRandom(seed: number): RandomSource {
  let value = seed >>> 0;

  return () => {
    value = (value * 1_664_525 + 1_013_904_223) >>> 0;
    return value / 4_294_967_296;
  };
}

describe("randomized game stress check", () => {
  it("keeps 100 seeded games valid and ends each within five turns", () => {
    for (let seed = 1; seed <= 100; seed += 1) {
      const random = createSeededRandom(seed);
      let state = createInitialState(random);
      let actions = 0;

      while (state.status === "playing" && actions < MAX_ROUNDS) {
        const chosenCard = [...state.hand].sort(
          (left, right) =>
            getCard(right).baseDamage - getCard(left).baseDamage,
        )[0];

        state = playCard(state, chosenCard, random);
        actions += 1;

        expect(state.playerIntegrity).toBeGreaterThanOrEqual(0);
        expect(state.playerIntegrity).toBeLessThanOrEqual(10);
        expect(state.opponentIntegrity).toBeGreaterThanOrEqual(0);
        expect(state.opponentIntegrity).toBeLessThanOrEqual(10);
        expect(new Set(state.hand).size).toBe(3);
      }

      expect(state.status).not.toBe("playing");
      expect(actions).toBeLessThanOrEqual(MAX_ROUNDS);
    }
  });
});
