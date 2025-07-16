/**
 * @module revealPatterns
 * @description パネルの公開パターンを生成する機能を提供します
 */

import type { PanelAmount } from "../types/PanelTypes";

/**
 * 選択したモードに基づいて公開順序の座標を生成します
 * @param mode 公開パターンモード
 * @param amount パネルグリッドサイズ（列×行）
 * @param revealed 既に公開されているパネル
 * @returns 公開される順序で[x, y]座標の配列
 */
export function generateRevealOrder(
  mode: string,
  amount: PanelAmount,
  revealed: [number, number][]
): [number, number][] {
  // まず、公開されていないすべての座標を取得
  const { x: cols, y: rows } = amount;
  const allCoords: [number, number][] = [];

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      // この座標が既に公開されているか確認
      if (!revealed.some(([rx, ry]) => rx === i && ry === j)) {
        allCoords.push([i, j]);
      }
    }
  }

  // 公開するパネルが残っていない
  if (allCoords.length === 0) return [];

  // 異なる公開パターンを適用
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
      return shuffleArray(allCoords); // デフォルトはランダム
  }
}

/**
 * Fisher-Yatesアルゴリズムを使って配列をシャッフルします
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
 * 外側から内側へのスパイラル表示パターンを生成します
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
      // 上の行、左から右へ
      for (let i = left; i <= right; i++) {
        if (!isRevealed(i, top)) result.push([i, top]);
      }
      top++;
    } else if (direction === 1) {
      // 右の列、上から下へ
      for (let i = top; i <= bottom; i++) {
        if (!isRevealed(right, i)) result.push([right, i]);
      }
      right--;
    } else if (direction === 2) {
      // 下の行、右から左へ
      for (let i = right; i >= left; i--) {
        if (!isRevealed(i, bottom)) result.push([i, bottom]);
      }
      bottom--;
    } else if (direction === 3) {
      // 左の列、下から上へ
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
 * 対角線の表示パターンを生成します
 */
function generateDiagonalOrder(
  cols: number,
  rows: number,
  revealed: [number, number][]
): [number, number][] {
  const result: [number, number][] = [];
  const isRevealed = (x: number, y: number) =>
    revealed.some(([rx, ry]) => rx === x && ry === y);

  // 対角線を生成（左上から右下への向き）
  const diagonals: [number, number][][] = [];

  // 対角線の合計数は行数 + 列数 - 1
  for (let d = 0; d < rows + cols - 1; d++) {
    const diagonal: [number, number][] = [];

    // 各対角線について
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

  // 対角線を平坦化
  return diagonals.flat();
}

/**
 * 利用可能な公開モードのリストを返します
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
