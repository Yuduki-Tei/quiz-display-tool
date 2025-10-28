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

import { useLetterStore } from "../stores/letterStore";

// Animation controller reference
let currentController: ReturnType<typeof createRevealController> | null = null;

/**
 * Parameters for reveal animation
 */
export type RevealParams = {
  id: string;
  duration: number;
  onReveal?: (index: number) => void;
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
    const store = useLetterStore();
    store.setAutoRevealing(false);
    store.setPaused(false);
  };

  const pause = () => {
    paused = true;
    const store = useLetterStore();
    store.setPaused(true);
  };

  const resume = () => {
    paused = false;
    const store = useLetterStore();
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
 * Starts letter reveal animation
 * @param params Animation parameters
 * @returns Controller for manipulating the animation
 */
export function startReveal(params: RevealParams) {
  // Stop existing animation if any
  if (currentController) {
    currentController.stop();
  }

  const store = useLetterStore();
  const context = store.getContext(params.id);

  if (!context) return null;

  store.setAutoRevealing(true);
  store.setPaused(false);

  // Generate reveal order based on mode
  store.generateOrder(params.id, context.autoRevealMode || "sequential");

  // Create new controller
  currentController = createRevealController();
  const controller = currentController;

  let { id, duration, onReveal } = params;

  const letterId = id;
  let currentIndex = 0;

  const reveal = () => {
    if (controller.isPaused || controller.isFinished) return;

    const context = store.getContext(letterId);
    if (!context || !context.order || currentIndex >= context.order.length) {
      controller.stop();
      return;
    }

    const nextCharIndex = context.order[currentIndex];
    store.revealChar(letterId, nextCharIndex);
    currentIndex++;

    if (onReveal) onReveal(nextCharIndex);

    if (currentIndex < context.order.length) {
      window.setTimeout(reveal, duration);
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
 * Stops the current letter reveal animation
 */
export function stopReveal() {
  if (currentController) {
    currentController.stop();
    currentController = null;
  }
}

/**
 * Pauses the current letter reveal animation
 */
export function pauseReveal() {
  if (currentController && !currentController.isPaused) {
    currentController.pause();
  }
}

/**
 * Resumes the current letter reveal animation
 */
export function resumeReveal() {
  if (currentController && currentController.isPaused) {
    currentController.resume();
  }
}

/**
 * Reveals all letters at once for the given letter id
 * @param id Letter id
 * @param onComplete Optional callback to execute when all letters are revealed
 * @returns True if operation was successful, false otherwise
 */
export function revealAll(id: string, onComplete?: () => void): boolean {
  // Stop any current animation
  if (currentController) {
    currentController.stop();
    currentController = null;
  }

  const store = useLetterStore();
  const context = store.getContext(id);

  if (!context) return false;

  // Reveal all characters
  store.revealAll(id);

  // Call completion callback if provided
  if (onComplete) onComplete();

  return true;
}

/**
 * Covers all letters (hides all revealed letters) for the given letter id
 * @param id Letter id
 * @param onComplete Optional callback to execute when all letters are covered
 * @returns True if operation was successful, false otherwise
 */
export function coverAll(id: string, onComplete?: () => void): boolean {
  // Stop any current animation
  if (currentController) {
    currentController.stop();
    currentController = null;
  }

  const store = useLetterStore();
  const context = store.getContext(id);

  if (!context) return false;

  // Clear all revealed letters
  store.coverAll(id);

  // Call completion callback if provided
  if (onComplete) onComplete();

  return true;
}
