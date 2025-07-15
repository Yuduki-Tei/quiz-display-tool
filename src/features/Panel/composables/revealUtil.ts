/**
 * @module revealUtil
 * @description Provides utility functions for panel revealing in different patterns
 */

import type { PanelContext, PanelAmount } from "../types/PanelTypes";

/**
 * Generates reveal order coordinates based on the selected mode
 * @param mode Revealing pattern mode
 * @param amount Panel grid size (columns x rows)
 * @param revealed Already revealed panels
 * @returns Array of [x, y] coordinates in the order they should be revealed
 */
export function generateRevealOrder(
  mode: string,
  amount: PanelAmount,
  revealed: [number, number][]
): [number, number][] {
  // Get all non-revealed coordinates first
  const { x: cols, y: rows } = amount;
  const allCoords: [number, number][] = [];

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      // Check if this coordinate is already revealed
      if (!revealed.some(([rx, ry]) => rx === i && ry === j)) {
        allCoords.push([i, j]);
      }
    }
  }

  // No panels left to reveal
  if (allCoords.length === 0) return [];

  // Apply different revealing patterns
  switch (mode) {
    case "random":
      return shuffleArray(allCoords);
    case "topToBottom":
      return allCoords.sort((a, b) => a[1] - b[1]);
    case "bottomToTop":
      return allCoords.sort((a, b) => b[1] - a[1]);
    case "leftToRight":
      return allCoords.sort((a, b) => a[0] - b[0]);
    case "rightToLeft":
      return allCoords.sort((a, b) => b[0] - a[0]);
    case "spiral":
      return generateSpiralOrder(cols, rows, revealed);
    case "diagonal":
      return generateDiagonalOrder(cols, rows, revealed);
    default:
      return shuffleArray(allCoords); // Default to random
  }
}

/**
 * Shuffles array in place using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates a spiral reveal pattern from outside to inside
 */
function generateSpiralOrder(
  cols: number,
  rows: number,
  revealed: [number, number][]
): [number, number][] {
  const result: [number, number][] = [];
  const isRevealed = (x: number, y: number) =>
    revealed.some(([rx, ry]) => rx === x && ry === y);

  let top = 0;
  let bottom = rows - 1;
  let left = 0;
  let right = cols - 1;
  let direction = 0;

  while (top <= bottom && left <= right) {
    if (direction === 0) {
      // Top row, left to right
      for (let i = left; i <= right; i++) {
        if (!isRevealed(i, top)) result.push([i, top]);
      }
      top++;
    } else if (direction === 1) {
      // Right column, top to bottom
      for (let i = top; i <= bottom; i++) {
        if (!isRevealed(right, i)) result.push([right, i]);
      }
      right--;
    } else if (direction === 2) {
      // Bottom row, right to left
      for (let i = right; i >= left; i--) {
        if (!isRevealed(i, bottom)) result.push([i, bottom]);
      }
      bottom--;
    } else if (direction === 3) {
      // Left column, bottom to top
      for (let i = bottom; i >= top; i--) {
        if (!isRevealed(left, i)) result.push([left, i]);
      }
      left++;
    }

    direction = (direction + 1) % 4;
  }

  return result;
}

/**
 * Generates a diagonal reveal pattern
 */
function generateDiagonalOrder(
  cols: number,
  rows: number,
  revealed: [number, number][]
): [number, number][] {
  const result: [number, number][] = [];
  const isRevealed = (x: number, y: number) =>
    revealed.some(([rx, ry]) => rx === x && ry === y);

  // Generate diagonals (top-left to bottom-right orientation)
  const diagonals: [number, number][][] = [];

  // Total number of diagonals is rows + cols - 1
  for (let d = 0; d < rows + cols - 1; d++) {
    const diagonal: [number, number][] = [];

    // For each diagonal
    for (let i = 0; i <= d; i++) {
      const x = i;
      const y = d - i;

      if (x < cols && y < rows && !isRevealed(x, y)) {
        diagonal.push([x, y]);
      }
    }

    if (diagonal.length > 0) {
      diagonals.push(diagonal);
    }
  }

  // Flatten the diagonals
  return diagonals.flat();
}

/**
 * Returns a list of available reveal modes
 */
export function getRevealModes() {
  return [
    { value: "random", label: "ランダム", icon: "Sort" },
    { value: "topToBottom", label: "上から下", icon: "Bottom" },
    { value: "bottomToTop", label: "下から上", icon: "Top" },
    { value: "leftToRight", label: "左から右", icon: "Right" },
    { value: "rightToLeft", label: "右から左", icon: "Back" },
    { value: "spiral", label: "渦巻き", icon: "Loading" },
    { value: "diagonal", label: "対角線", icon: "Share" },
  ];
}
