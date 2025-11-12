/**
 * @module revealUtil
 * @description Provides utility functions for panel revealing in different patterns
 * and controls reveal animation process
 *
 * @warning This module is designed as a singleton and uses a global animation
 * controller (`currentController`). It does NOT support running multiple
 * reveal animations simultaneously from different component instances.
 * Calling `startReveal` will always stop any previously running animation.
 */

import { createRevealUtil } from "@/composables/useAutoReveal";
import { usePanelStore } from "../stores/panelStore";
import { generateRevealOrder } from "./revealPatterns";

/**
 * Create panel-specific reveal utilities using the generic reveal util
 */
const { startReveal, stopReveal, pauseReveal, resumeReveal, revealAll, coverAll } =
  createRevealUtil<[number, number]>({
    useStore: usePanelStore,
    generateOrder: generateRevealOrder,
    setRevealingMethod: 'setRevealing',
    addRevealedMethod: 'addRevealedPanel',

    // Custom revealAll implementation for panels
    customRevealAll: (id: string, store) => {
      const context = store.getContext(id);
      if (!context) return false;

      // Generate all possible panel coordinates based on grid size
      const { x: cols, y: rows } = context.amount;
      const allPanels: [number, number][] = [];

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          // Only add panels that are not already revealed
          if (!context.revealed.some(([rx, ry]: [number, number]) => rx === i && ry === j)) {
            allPanels.push([i, j]);
          }
        }
      }

      // If all panels are already revealed, nothing to do
      if (allPanels.length === 0) {
        return true;
      }

      // Reveal all panels at once
      allPanels.forEach((panel) => {
        store.addRevealedPanel(id, panel);
      });

      return true;
    },

    // Custom coverAll implementation for panels
    customCoverAll: (id: string, store) => {
      const context = store.getContext(id);
      if (!context) return false;

      // Clear all revealed panels
      store.clearRevealedPanels(id);

      return true;
    },
  });

export { startReveal, stopReveal, pauseReveal, resumeReveal, revealAll, coverAll };

/**
 * Re-export the type for compatibility
 */
export type { RevealParams } from "@/composables/useAutoReveal";
