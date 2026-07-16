import { CLAIM_DAMAGE, type GameState } from "../game/game";

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
  eyebrow.textContent = "MVP-0 · VERTICAL SLICE 01";

  const title = document.createElement("h1");
  title.textContent = "三分钟辩论";

  const description = document.createElement("p");
  description.className = "description";
  description.textContent = "先验证最短链路：点击卡牌，改变游戏状态，再更新界面。";

  const integrityRow = document.createElement("div");
  integrityRow.className = "integrity-row";
  integrityRow.append(
    createIntegrityPanel("玩家完整度", state.playerIntegrity),
    createIntegrityPanel("对手完整度", state.opponentIntegrity),
  );

  const claimButton = document.createElement("button");
  claimButton.className = "claim-card";
  claimButton.type = "button";
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
  hint.className = "hint";
  hint.textContent = "点击卡牌，观察对手完整度的变化。";

  screen.append(eyebrow, title, description, integrityRow, claimButton, hint);
  root.replaceChildren(screen);
}

