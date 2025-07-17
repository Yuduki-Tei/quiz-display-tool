/**
 * @module clickUtil
 * @description Provides flip animation functionality for a canvas.
 */

import { Ref, ComputedRef } from "vue";
import { usePanelStore } from "../stores/panelStore";
import { PanelCombinedContext } from "../types/PanelTypes";

function getDistributedSizes(
  totalLength: number,
  numDivisions: number
): number[] {
  if (numDivisions <= 0) return [];

  const baseSize = Math.floor(totalLength / numDivisions);
  const remainder = totalLength % numDivisions;

  const sizes: number[] = [];
  let numPlaced = 0;

  for (let i = 0; i < numDivisions; i++) {
    if ((i + 1) * remainder > numPlaced * numDivisions) {
      sizes.push(baseSize + 1);
      numPlaced++;
    } else {
      sizes.push(baseSize);
    }
  }

  return sizes;
}

function findIndexFromCoord(coord: number, sizes: number[]): number {
  let cumulativeSize = 0;
  for (let i = 0; i < sizes.length; i++) {
    cumulativeSize += sizes[i];
    if (coord < cumulativeSize) {
      return i;
    }
  }
  return -1;
}

function isPanelRevealed(
  ctx: PanelCombinedContext,
  i: number,
  j: number
): boolean {
  return ctx.revealed.some(([rx, ry]) => rx === i && ry === j);
}

function flipPanel(ctx: PanelCombinedContext, i: number, j: number) {
  const id = ctx.id;
  const store = usePanelStore();
  const context = store.getContext(id);
  if (!isPanelRevealed(ctx, i, j)) {
    context.revealed.push([i, j]);
  } else {
    context.revealed = ctx.revealed.filter(
      ([rx, ry]) => !(rx === i && ry === j)
    );
  }
}

export function drawGrid(
  canvas: Ref<HTMLCanvasElement | null>,
  context: ComputedRef<PanelCombinedContext | Record<string, never>>
) {
  if (!canvas.value || !context.value) return;
  const ctx = canvas.value.getContext("2d");
  if (!ctx) return;

  const contextValue = context.value as PanelCombinedContext;
  const { displayWidth, displayHeight } = contextValue;
  const { x: numCols, y: numRows } = contextValue.amount;

  ctx.clearRect(0, 0, displayWidth, displayHeight);

  const widths = getDistributedSizes(displayWidth, numCols);
  const heights = getDistributedSizes(displayHeight, numRows);

  const avgArea = (displayWidth * displayHeight) / (numCols * numRows);
  const toStroke = avgArea > 500;

  ctx.strokeStyle = "rgb(255,255,255)";
  ctx.lineWidth = 1;
  ctx.fillStyle = "rgb(66,66,66)";

  let currentY = 0;
  for (let j = 0; j < numRows; j++) {
    const rectHeight = heights[j];
    let currentX = 0;

    for (let i = 0; i < numCols; i++) {
      const rectWidth = widths[i];

      if (!isPanelRevealed(contextValue, i, j)) {
        ctx.fillRect(currentX, currentY, rectWidth, rectHeight);
        if (toStroke) {
          ctx.strokeRect(currentX, currentY, rectWidth, rectHeight);
        }
      }
      currentX += rectWidth;
    }
    currentY += rectHeight;
  }
}

export function handlePanelClick(
  e: MouseEvent,
  panelCanvas: Ref<HTMLCanvasElement | null>,
  context: ComputedRef<PanelCombinedContext | Record<string, never>>
) {
  if (!panelCanvas.value || !context.value) return;
  const contextValue = context.value as PanelCombinedContext;
  const { displayWidth, displayHeight } = contextValue;
  const { x: numCols, y: numRows } = contextValue.amount;

  const bounds = panelCanvas.value.getBoundingClientRect();
  const x = ((e.clientX - bounds.left) / bounds.width) * displayWidth;
  const y = ((e.clientY - bounds.top) / bounds.height) * displayHeight;

  const widths = getDistributedSizes(displayWidth, numCols);
  const heights = getDistributedSizes(displayHeight, numRows);

  const i = findIndexFromCoord(x, widths);
  const j = findIndexFromCoord(y, heights);

  if (i === -1 || j === -1) return;

  flipPanel(contextValue, i, j);
}
