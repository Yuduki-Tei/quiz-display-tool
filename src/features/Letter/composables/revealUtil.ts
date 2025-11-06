/**
 * @module revealUtil
 * @description Provides utility functions for letter revealing in different patterns
 * and controls reveal animation process
 *
 * @warning This module is designed as a singleton and uses a global animation
 * controller (`currentController`). It does NOT support running multiple
 * reveal animations simultaneously from different component instances.
 * Calling `startReveal` will always stop any previously running animation.
 */

import { createRevealUtil } from "@/composables/useAutoReveal";
import { useLetterStore } from "../stores/letterStore";

/**
 * Create letter-specific reveal utilities using the generic reveal util
 */
const { startReveal, stopReveal, pauseReveal, resumeReveal, revealAll, coverAll } =
  createRevealUtil<number>({
    useStore: () => {
      const store = useLetterStore();
      return {
        ...store,
        // Map store methods to expected interface
        addRevealed: (id: string, index: number) => store.revealChar(id, index),
      };
    },
    setRevealingMethod: 'setAutoRevealing',
    addRevealedMethod: 'revealChar',
  });

export { startReveal, stopReveal, pauseReveal, resumeReveal, revealAll, coverAll };

/**
 * Re-export the type for compatibility
 */
export type { RevealParams } from "@/composables/useAutoReveal";
