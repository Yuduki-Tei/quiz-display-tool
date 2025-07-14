/**
 * @module panelUtil
 * @description Provides flip animation functionality for a canvas.
 */

import { Ref } from "vue";

export function drawGrid(
  canvas: Ref<HTMLCanvasElement | null>,
  context: Ref<any>
) {
  if (!canvas.value || !context.value) return;
  const ctx = canvas.value.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, context.value.displayWidth, context.value.displayHeight);
  const { x, y } = context.value.amount;
  const w = context.value.displayWidth / x;
  const h = context.value.displayHeight / y;
  ctx.strokeStyle = "rgb(255,255,255)";
  ctx.lineWidth = 1;
  ctx.fillStyle = "rgb(66,66,66)";
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      if (isPanelRevealed(context.value, i, j)) continue;
      ctx.fillRect(i * w, j * h, w, h);
      ctx.strokeRect(i * w, j * h, w, h);
    }
  }
}

export function handlePanelClick(
  e: MouseEvent,
  panelCanvas: Ref<HTMLCanvasElement | null>,
  context: Ref<any>
) {
  if (!panelCanvas.value || !context.value) return;
  const bounds = panelCanvas.value.getBoundingClientRect();
  const x =
    ((e.clientX - bounds.left) / bounds.width) * context.value.displayWidth;
  const y =
    ((e.clientY - bounds.top) / bounds.height) * context.value.displayHeight;
  const w = context.value.displayWidth / context.value.amount.x;
  const h = context.value.displayHeight / context.value.amount.y;
  const i = Math.floor(x / w);
  const j = Math.floor(y / h);
  if (isPanelRevealed(context.value, i, j)) return;
  revealPanel(context.value, i, j);
}

export function isPanelRevealed(ctx: any, i: number, j: number): boolean {
  return ctx.revealed.some(([rx, ry]) => rx === i && ry === j);
}

export function revealPanel(ctx: any, i: number, j: number) {
  if (!isPanelRevealed(ctx, i, j)) {
    ctx.revealed.push([i, j]);
  }
}

export function resetRevealed(ctx: any) {
  ctx.revealed.length = 0;
}
