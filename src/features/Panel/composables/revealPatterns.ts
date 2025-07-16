/**
 * @module revealPatterns
 * @description Provides functionality to generate reveal patterns for panels
 */

import type { PanelAmount } from "../types/PanelTypes";
type Coord = [number, number];

type StartPoint =
  | "topLeft"
  | "topRight"
  | "bottomRight"
  | "bottomLeft"
  | "center";
type Direction = "clockwise" | "counterClockwise";

interface SpiralOptions {
  startPoint?: StartPoint;
  direction?: Direction;
}

/**
 * Generates reveal order coordinates based on the selected mode
 * @param mode Reveal pattern mode
 * @param amount Panel grid size (columns × rows)
 * @param revealed Panels that are already revealed
 * @returns Array of [x, y] coordinates in reveal order
 */
export function generateRevealOrder(
  mode: string,
  amount: PanelAmount
): [number, number][] {
  // First, get all coordinates that have not been revealed yet
  const { x: cols, y: rows } = amount;

  if (mode.startsWith("spiral")) {
    const parts = mode.split("-"); // e.g., "spiral-topLeft-clockwise" -> ["spiral", "topLeft", "clockwise"]
    const startPoint = parts[1] as StartPoint;
    const direction = parts[2] as Direction;

    return generateSpiralCoords(rows, cols, { startPoint, direction });
  }

  const allCoords = Array.from({ length: rows }).flatMap((_, j) =>
    Array.from({ length: cols }, (_, i) => [i, j] as Coord)
  );

  // Apply different reveal patterns
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
    default:
      return shuffleArray(allCoords); // Default is random
  }
}

/**
 * Shuffles an array using the Fisher-Yates algorithm
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
 * generates spiral coordinates for a grid
 * @param rows
 * @param cols
 * @param options startpoint and direction
 * @returns Array of coordinates in spiral order
 */
function generateSpiralCoords(
  rows: number,
  cols: number,
  options: SpiralOptions = {}
): Coord[] {
  const { startPoint = "topLeft", direction = "clockwise" } = options;
  if (rows === 0 || cols === 0) return [];

  const result: Coord[] = [];
  const total = rows * cols;

  if (startPoint === "center") {
    let x = Math.floor((cols - 1) / 2);
    let y = Math.floor((rows - 1) / 2);

    result.push([x, y]);

    const dirs =
      direction === "clockwise"
        ? [
            [1, 0],
            [0, 1],
            [-1, 0],
            [0, -1],
          ] // R, D, L, U
        : [
            [1, 0],
            [0, -1],
            [-1, 0],
            [0, 1],
          ]; // R, U, L, D

    let step = 1;
    let dirIndex = 0;

    while (result.length < total) {
      for (let i = 0; i < 2; i++) {
        for (let s = 0; s < step; s++) {
          if (result.length >= total) break;
          x += dirs[dirIndex][0];
          y += dirs[dirIndex][1];
          if (x >= 0 && x < cols && y >= 0 && y < rows) {
            result.push([x, y]);
          }
        }
        if (result.length >= total) break;
        dirIndex = (dirIndex + 1) % 4;
      }
      step++;
    }
    return result;
  }

  let top = 0,
    bottom = rows - 1,
    left = 0,
    right = cols - 1;

  const traverseRight = () => {
    for (let i = left; i <= right; i++) result.push([i, top]);
    top++;
  };
  const traverseDown = () => {
    for (let j = top; j <= bottom; j++) result.push([right, j]);
    right--;
  };
  const traverseLeft = () => {
    for (let i = right; i >= left; i--) result.push([i, bottom]);
    bottom--;
  };
  const traverseUp = () => {
    for (let j = bottom; j >= top; j--) result.push([left, j]);
    left++;
  };

  let movePlan: (() => void)[] = [];

  if (direction === "clockwise") {
    switch (startPoint) {
      case "topLeft":
        movePlan = [traverseRight, traverseDown, traverseLeft, traverseUp];
        break;
      case "topRight":
        movePlan = [traverseDown, traverseLeft, traverseUp, traverseRight];
        break;
      case "bottomRight":
        movePlan = [traverseLeft, traverseUp, traverseRight, traverseDown];
        break;
      case "bottomLeft":
        movePlan = [traverseUp, traverseRight, traverseDown, traverseLeft];
        break;
    }
  } else {
    switch (startPoint) {
      case "topLeft":
        movePlan = [traverseDown, traverseRight, traverseUp, traverseLeft];
        break;
      case "topRight":
        movePlan = [traverseUp, traverseLeft, traverseDown, traverseRight];
        break;
      case "bottomRight":
        movePlan = [traverseLeft, traverseDown, traverseRight, traverseUp];
        break;
      case "bottomLeft":
        movePlan = [traverseRight, traverseUp, traverseLeft, traverseDown];
        break;
    }
  }

  let planIndex = 0;
  while (result.length < total) {
    movePlan[planIndex % 4]();
    planIndex++;
  }

  return result;
}

/**
 * return usable patterns
 */
export function getMainRevealModes() {
  return [
    { value: "random", label: "隨機", icon: "PhShuffle" },
    { value: "topToBottom", label: "由上而下", icon: "Bottom" },
    { value: "bottomToTop", label: "由下而上", icon: "Top" },
    { value: "leftToRight", label: "由左而右", icon: "Right" },
    { value: "rightToLeft", label: "由右而左", icon: "Back" },
    { value: "spiral", label: "螺旋", icon: "Loading" },
  ];
}

/**
 * Returns sub modes for spiral patterns
 */
export function getSpiralSubModes() {
  const startPointLabels: Record<StartPoint, string> = {
    topLeft: "左上角",
    topRight: "右上角",
    bottomRight: "右下角",
    bottomLeft: "左下角",
    center: "中心",
  };
  const directionLabels: Record<Direction, string> = {
    clockwise: "順時針",
    counterClockwise: "逆時針",
  };

  const subModes: { value: string; label: string }[] = [];
  for (const sp in startPointLabels) {
    for (const dir in directionLabels) {
      subModes.push({
        value: `${sp}-${dir}`,
        label: `${startPointLabels[sp as StartPoint]}開始, ${
          directionLabels[dir as Direction]
        }
        `,
      });
    }
  }
  return subModes;
}
