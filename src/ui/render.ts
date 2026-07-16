import {
  CLAIM_DAMAGE,
  MAX_ROUNDS,
  OPPONENT_RESPONSE_DAMAGE,
  type GameState,
} from "../game/game";

export type PlayClaimHandler = () => void;

function createIntegrityPanel(label: string, value: number): HTMLElement {
  const panel = document.createElement("section");
  panel.className = "integrity-panel";

  const panelLabel = document.createElement("span");
  panelLabel.className = "integrity-label";
  panelLabel.textContent = label;

  const panelValue = document.createElement("strong");
  panelValue.className = "integrity-value";
  panelValue.textContent = String(value);

  panel.append(panelLabel, panelValue);
  return panel;
}

export function renderGame(
  root: HTMLElement,
  state: GameState,
  onPlayClaim: PlayClaimHandler,
): void {
  const screen = document.createElement("div");
  screen.className = "game-screen";

  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "MVP-0 · VERTICAL SLICE 02";

  const title = document.createElement("h1");
  title.textContent = "三分钟辩论";

  const description = document.createElement("p");
  description.className = "description";
  description.textContent = `五回合内击破对手。每次出牌后，对手会回应并使你损失 ${OPPONENT_RESPONSE_DAMAGE} 点完整度。`;

  const roundIndicator = document.createElement("p");
  roundIndicator.className = "round-indicator";
  roundIndicator.textContent = `第 ${state.round} / ${MAX_ROUNDS} 回合`;

  const integrityRow = document.createElement("div");
  integrityRow.className = "integrity-row";
  integrityRow.append(
    createIntegrityPanel("玩家完整度", state.playerIntegrity),
    createIntegrityPanel("对手完整度", state.opponentIntegrity),
  );

  const claimButton = document.createElement("button");
  claimButton.className = "claim-card";
  claimButton.type = "button";
  claimButton.disabled = state.status !== "playing";
  claimButton.setAttribute("aria-label", `打出主张，对手完整度减少 ${CLAIM_DAMAGE}`);
  claimButton.addEventListener("click", onPlayClaim, { once: true });

  const cardType = document.createElement("span");
  cardType.className = "card-type";
  cardType.textContent = "主张";

  const cardName = document.createElement("strong");
  cardName.textContent = "提出核心论点";

  const cardEffect = document.createElement("span");
  cardEffect.className = "card-effect";
  cardEffect.textContent = `对手完整度 −${CLAIM_DAMAGE}`;

  claimButton.append(cardType, cardName, cardEffect);

  const hint = document.createElement("p");
  hint.className = `hint status-${state.status}`;
  hint.setAttribute("role", "status");
  hint.textContent = state.message;

  screen.append(
    eyebrow,
    title,
    description,
    roundIndicator,
    integrityRow,
    claimButton,
    hint,
  );
  root.replaceChildren(screen);
}
