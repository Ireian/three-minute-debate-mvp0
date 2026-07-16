import { getCard, type CardId } from "../game/cards";
import {
  MAX_ROUNDS,
  OPPONENT_RESPONSE_DAMAGE,
  type GameState,
} from "../game/game";

export type PlayCardHandler = (cardId: CardId) => void;
export type RestartHandler = () => void;

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

function createCardButton(
  cardId: CardId,
  isDisabled: boolean,
  onPlayCard: PlayCardHandler,
): HTMLButtonElement {
  const card = getCard(cardId);
  const button = document.createElement("button");
  button.className = "debate-card";
  button.type = "button";
  button.disabled = isDisabled;
  button.setAttribute("aria-label", `打出${card.name}：${card.description}`);
  button.addEventListener("click", () => onPlayCard(cardId), { once: true });

  const cardType = document.createElement("span");
  cardType.className = "card-type";
  cardType.textContent = card.category;

  const cardName = document.createElement("strong");
  cardName.textContent = card.name;

  const cardEffect = document.createElement("span");
  cardEffect.className = "card-effect";
  cardEffect.textContent = card.description;

  button.append(cardType, cardName, cardEffect);
  return button;
}

export function renderGame(
  root: HTMLElement,
  state: GameState,
  onPlayCard: PlayCardHandler,
  onRestart: RestartHandler,
): void {
  const screen = document.createElement("div");
  screen.className = "game-screen";

  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "MVP-0 · 三分钟辩论";

  const title = document.createElement("h1");
  title.textContent = "三分钟辩论";

  const description = document.createElement("p");
  description.className = "description";
  description.textContent = `五回合内击破对手。每回合三选一，对手通常回应 ${OPPONENT_RESPONSE_DAMAGE} 点。`;

  const roundIndicator = document.createElement("p");
  roundIndicator.className = "round-indicator";
  roundIndicator.textContent = `第 ${state.round} / ${MAX_ROUNDS} 回合`;

  const integrityRow = document.createElement("div");
  integrityRow.className = "integrity-row";
  integrityRow.append(
    createIntegrityPanel("玩家完整度", state.playerIntegrity),
    createIntegrityPanel("对手完整度", state.opponentIntegrity),
  );

  const statusPanel = document.createElement("section");
  statusPanel.className = `status-panel status-${state.status}`;
  statusPanel.setAttribute("aria-live", "polite");

  const statusLabel = document.createElement("strong");
  statusLabel.className = "status-label";
  statusLabel.textContent =
    state.status === "won"
      ? "你赢了"
      : state.status === "lost"
        ? "辩论失败"
        : "辩论进行中";

  const statusMessage = document.createElement("span");
  statusMessage.textContent = state.message;
  statusPanel.append(statusLabel, statusMessage);

  if (state.nextCardDamageBonus > 0 && state.status === "playing") {
    const bonusBadge = document.createElement("span");
    bonusBadge.className = "bonus-badge";
    bonusBadge.textContent = `区分加成：下一张 +${state.nextCardDamageBonus}`;
    statusPanel.append(bonusBadge);
  }

  const cardRow = document.createElement("section");
  cardRow.className = "card-row";
  cardRow.setAttribute("aria-label", "本回合可选卡牌");
  cardRow.append(
    ...state.hand.map((cardId) =>
      createCardButton(cardId, state.status !== "playing", onPlayCard),
    ),
  );

  const restartButton = document.createElement("button");
  restartButton.className = "restart-button";
  restartButton.type = "button";
  restartButton.textContent = "重新开始";
  restartButton.setAttribute("aria-label", "重新开始辩论");
  restartButton.addEventListener("click", onRestart, { once: true });

  screen.append(
    eyebrow,
    title,
    description,
    roundIndicator,
    integrityRow,
    statusPanel,
    cardRow,
    restartButton,
  );
  root.replaceChildren(screen);
}
