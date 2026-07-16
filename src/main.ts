import "./style.css";
import { createInitialState, playClaim } from "./game/game";
import { renderGame } from "./ui/render";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("无法找到游戏挂载点 #app");
}

const appRoot: HTMLElement = root;

let gameState = createInitialState();

function handlePlayClaim(): void {
  gameState = playClaim(gameState);
  render();
}

function render(): void {
  renderGame(appRoot, gameState, handlePlayClaim);
}

render();
