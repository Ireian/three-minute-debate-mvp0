import "./style.css";
import type { CardId } from "./game/cards";
import { createInitialState, playCard } from "./game/game";
import { renderGame } from "./ui/render";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("无法找到游戏挂载点 #app");
}

const appRoot: HTMLElement = root;

let gameState = createInitialState();

function handlePlayCard(cardId: CardId): void {
  gameState = playCard(gameState, cardId);
  render();
}

function render(): void {
  renderGame(appRoot, gameState, handlePlayCard);
}

render();
