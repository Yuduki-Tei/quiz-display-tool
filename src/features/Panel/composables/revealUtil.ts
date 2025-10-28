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

import { usePanelStore } from "../stores/panelStore";
import { generateRevealOrder } from "./revealPatterns";

// Animation controller reference
let currentController: ReturnType<typeof createRevealController> | null = null;

/**
 * Parameters for reveal animation
 */
export type RevealParams = {
  id: string;
  duration: number;
  onReveal?: (coord: [number, number]) => void;
};

/**
 * Creates a controller for reveal animation
 */
function createRevealController() {
  let timeoutId: number | null = null;
  let paused = false;
  let finished = false;

  // Will be defined later in startReveal
  let revealFn: () => void = () => {};

  const stop = () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }

    finished = true;
    const store = usePanelStore();
    store.setRevealing(false);
    store.setPaused(false);
  };

  const pause = () => {
    paused = true;
    const store = usePanelStore();
    store.setPaused(true);
  };

  const resume = () => {
    paused = false;
    const store = usePanelStore();
    store.setPaused(false);
    revealFn();
  };

  const setRevealFn = (fn: () => void) => {
    revealFn = fn;
  };

  return {
    stop,
    pause,
    resume,
    setRevealFn,
    get isPaused() {
      return paused;
    },
    get isFinished() {
      return finished;
    },
  };
}

/**
 * Starts panel reveal animation
 * @param params Animation parameters
 * @returns Controller for manipulating the animation
 */
export function startReveal(params: RevealParams) {
  // Stop existing animation if any
  if (currentController) {
    currentController.stop();
  }

  const store = usePanelStore();
  const context = store.getContext(params.id);

  if (!context) return null;

  store.setRevealing(true);
  store.setPaused(false);

  const order = generateRevealOrder(context.autoRevealMode, context.amount);
  store.setOrder(params.id, order);

  // Create new controller
  currentController = createRevealController();
  const controller = currentController;

  let { id, duration, onReveal } = params;

  const panelId = id;
  let currentIndex = 0; // Define reveal function
  const reveal = () => {
    if (controller.isPaused || controller.isFinished) return;

    const context = store.getContext(panelId);
    if (!context || !context.order || currentIndex >= context.order.length) {
      controller.stop();
      return;
    }

    // Reveal next panel
    const nextPanel = context.order[currentIndex];
    store.addRevealedPanel(panelId, nextPanel);
    currentIndex++;

    // Call reveal callback if provided
    if (onReveal) onReveal(nextPanel);

    // Continue to next panel if more to reveal
    if (currentIndex < context.order.length) {
      const timeoutId = window.setTimeout(reveal, duration);
    } else {
      controller.stop();
    }
  };

  // Start the first reveal
  controller.setRevealFn(reveal);
  reveal();

  return controller;
}

/**
 * Stops the current panel reveal animation
 */
export function stopReveal() {
  if (currentController) {
    currentController.stop();
    currentController = null;
  }
}

/**
 * Pauses the current panel reveal animation
 */
export function pauseReveal() {
  if (currentController && !currentController.isPaused) {
    currentController.pause();
  }
}

/**
 * Resumes the current panel reveal animation
 */
export function resumeReveal() {
  if (currentController && currentController.isPaused) {
    currentController.resume();
  }
}

/**
 * Reveals all panels at once for the given panel id
 * @param id Panel id
 * @param onComplete Optional callback to execute when all panels are revealed
 * @returns True if operation was successful, false otherwise
 */
export function revealAll(id: string, onComplete?: () => void): boolean {
  // Stop any current animation
  if (currentController) {
    currentController.stop();
    currentController = null;
  }

  const store = usePanelStore();
  const context = store.getContext(id);

  if (!context) return false;

  // Generate all possible panel coordinates based on grid size
  const { x: cols, y: rows } = context.amount;
  const allPanels: [number, number][] = [];

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      // Only add panels that are not already revealed
      if (!context.revealed.some(([rx, ry]) => rx === i && ry === j)) {
        allPanels.push([i, j]);
      }
    }
  }

  // If all panels are already revealed, nothing to do
  if (allPanels.length === 0) {
    if (onComplete) onComplete();
    return true;
  }

  // Reveal all panels at once
  allPanels.forEach((panel) => {
    store.addRevealedPanel(id, panel);
  });

  // Call completion callback if provided
  if (onComplete) onComplete();

  return true;
}

/**
 * Covers all panels (hides all revealed panels) for the given panel id
 * @param id Panel id
 * @param onComplete Optional callback to execute when all panels are covered
 * @returns True if operation was successful, false otherwise
 */
export function coverAll(id: string, onComplete?: () => void): boolean {
  // Stop any current animation
  if (currentController) {
    currentController.stop();
    currentController = null;
  }

  const store = usePanelStore();
  const context = store.getContext(id);

  if (!context) return false;

  // Clear all revealed panels
  store.clearRevealedPanels(id);

  // Call completion callback if provided
  if (onComplete) onComplete();

  return true;
}
