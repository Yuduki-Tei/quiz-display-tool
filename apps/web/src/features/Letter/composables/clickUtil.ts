/**
 * @module clickUtil
 * @description Provides click handling and drawing functionality for letter canvas.
 */

import { Ref, ComputedRef } from "vue";
import { useLetterAdapter } from "@/adapters/LetterAdapter";
import { LetterCombinedContext } from "../types/LetterTypes";

function isCharRevealed(ctx: LetterCombinedContext, index: number): boolean {
  return Array.isArray(ctx.revealed) && ctx.revealed.includes(index);
}

function flipChar(ctx: LetterCombinedContext, index: number) {
  const id = ctx.id;
  const adapter = useLetterAdapter();
  adapter.flipChar(id, index);
}

export function drawText(
  canvas: Ref<HTMLCanvasElement | null>,
  context: ComputedRef<LetterCombinedContext | null>,
  canvasWidth: number,
  canvasHeight: number
) {
  if (!canvas.value || !context.value || !context.value.content) return;

  const ctx = canvas.value.getContext("2d");
  if (!ctx) return;

  const contextValue = context.value as LetterCombinedContext;
  const { content, charsPerRow } = contextValue;

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Calculate layout
  const chars = content.split("");
  const totalChars = chars.length;
  const numRows = Math.ceil(totalChars / charsPerRow);

  // Calculate cell dimensions (simple equal division)
  const cellWidth = canvasWidth / charsPerRow;
  const cellHeight = canvasHeight / numRows;

  // Calculate font size (80% of cell size to leave some padding)
  const fontSize = Math.min(cellWidth, cellHeight) * 0.8;
  ctx.font = `${fontSize}px "Noto Sans TC", "Microsoft JhengHei", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw each character
  chars.forEach((char, index) => {
    const row = Math.floor(index / charsPerRow);
    const col = index % charsPerRow;

    const x = col * cellWidth + cellWidth / 2;
    const y = row * cellHeight + cellHeight / 2;

    if (isCharRevealed(contextValue, index)) {
      // Draw revealed character
      ctx.fillStyle = "#ffffff";
      ctx.fillText(char, x, y);
    } else {
      // Draw gray background
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(
        col * cellWidth + 5,
        row * cellHeight + 5,
        cellWidth - 10,
        cellHeight - 10
      );

      // Draw index number
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      const originalFont = ctx.font;
      ctx.font = `${
        fontSize * 0.5
      }px "Noto Sans TC", "Microsoft JhengHei", sans-serif`;
      ctx.fillText((index + 1).toString(), x, y);
      ctx.font = originalFont;
    }
  });

  // Draw grid lines (optional, subtle)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;

  // Vertical lines
  for (let i = 0; i <= charsPerRow; i++) {
    const x = i * cellWidth;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }

  // Horizontal lines
  for (let i = 0; i <= numRows; i++) {
    const y = i * cellHeight;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }
}

export function handleLetterClick(
  e: MouseEvent,
  letterCanvas: Ref<HTMLCanvasElement | null>,
  context: ComputedRef<LetterCombinedContext | null>,
  canvasWidth: number,
  canvasHeight: number
) {
  if (!letterCanvas.value || !context.value) return;

  const contextValue = context.value as LetterCombinedContext;
  const { content, charsPerRow } = contextValue;

  const rect = letterCanvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const totalChars = content.length;
  const numRows = Math.ceil(totalChars / charsPerRow);

  const cellWidth = canvasWidth / charsPerRow;
  const cellHeight = canvasHeight / numRows;

  const col = Math.floor(x / cellWidth);
  const row = Math.floor(y / cellHeight);

  // Calculate 1D index from 2D position
  const index = row * charsPerRow + col;

  // Check if the index is valid
  if (index >= 0 && index < totalChars) {
    flipChar(contextValue, index);
  }
}
