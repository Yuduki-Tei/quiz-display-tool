/**
 * @module useAutoReveal
 * @description Generic utility for creating auto-reveal animations
 * Provides a reusable pattern for sequential item revealing with pause/resume/stop controls
 *
 * @template T The type of items being revealed (e.g., [number, number] for grid coords, number for indices)
 *
 * @warning The returned utilities use a singleton controller and do NOT support
 * running multiple reveal animations simultaneously. Calling `startReveal` will
 * always stop any previously running animation.
 */

/**
 * Configuration for creating reveal utilities
 */
export interface RevealUtilConfig<T> {
  /**
   * Factory function that returns the store instance
   * Store must implement these methods:
   * - setRevealing/setAutoRevealing: (val: boolean) => void
   * - setPaused: (val: boolean) => void
   * - getContext: (id: string | null) => any
   * - setOrder?: (id: string, order: T[]) => void (for Panel)
   * - generateOrder?: (id: string, mode: string) => void (for Letter)
   * - addRevealed: (id: string, item: T) => void
   * - revealAll: (id: string) => void
   * - coverAll: (id: string) => void
   */
  useStore: () => any;

  /**
   * Optional function to generate reveal order
   * Required for Panel-style reveals, not needed if store has generateOrder method
   */
  generateOrder?: (mode: string, context: any) => T[];

  /**
   * Name of the method to call for setting reveal state
   * Default: 'setAutoRevealing' (for Letter)
   * Can be: 'setRevealing' (for Panel)
   */
  setRevealingMethod?: 'setRevealing' | 'setAutoRevealing';

  /**
   * Name of the method to call for revealing an item
   * Default: 'addRevealed'
   * Can be: 'revealChar', 'addRevealedPanel', etc.
   */
  addRevealedMethod?: string;

  /**
   * Custom revealAll implementation
   * If not provided, will call store.revealAll()
   */
  customRevealAll?: (id: string, store: any) => boolean;

  /**
   * Custom coverAll implementation
   * If not provided, will call store.coverAll()
   */
  customCoverAll?: (id: string, store: any) => boolean;
}

/**
 * Parameters for reveal animation
 */
export interface RevealParams<T> {
  id: string;
  duration: number;
  onReveal?: (item: T) => void;
}

/**
 * Creates a set of reveal utility functions with shared animation logic
 */
export function createRevealUtil<T>(config: RevealUtilConfig<T>) {
  const {
    useStore,
    generateOrder: externalGenerateOrder,
    setRevealingMethod = 'setAutoRevealing',
    addRevealedMethod = 'addRevealed',
    customRevealAll,
    customCoverAll,
  } = config;

  // Animation controller reference (singleton)
  let currentController: ReturnType<typeof createRevealController> | null = null;

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
      const store = useStore();
      store[setRevealingMethod](false);
      store.setPaused(false);
    };

    const pause = () => {
      paused = true;
      const store = useStore();
      store.setPaused(true);
    };

    const resume = () => {
      paused = false;
      const store = useStore();
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
   * Starts reveal animation
   * @param params Animation parameters
   * @returns Controller for manipulating the animation
   */
  function startReveal(params: RevealParams<T>) {
    // Stop existing animation if any
    if (currentController) {
      currentController.stop();
    }

    const store = useStore();
    const context = store.getContext(params.id);

    if (!context) return null;

    store[setRevealingMethod](true);
    store.setPaused(false);

    // Generate or retrieve order
    if (externalGenerateOrder && store.setOrder) {
      // Panel-style: generate externally and set to store
      const order = externalGenerateOrder(context.autoRevealMode, context.amount);
      store.setOrder(params.id, order);
    } else if (store.generateOrder) {
      // Letter-style: store generates order internally
      store.generateOrder(params.id, context.autoRevealMode || 'sequential');
    }

    // Create new controller
    currentController = createRevealController();
    const controller = currentController;

    const { id, duration, onReveal } = params;
    let currentIndex = 0;

    // Define reveal function
    const reveal = () => {
      if (controller.isPaused || controller.isFinished) return;

      const context = store.getContext(id);
      if (!context || !context.order || currentIndex >= context.order.length) {
        controller.stop();
        return;
      }

      // Reveal next item
      const nextItem = context.order[currentIndex];

      // Call the appropriate method to add revealed item
      if (store[addRevealedMethod]) {
        store[addRevealedMethod](id, nextItem);
      } else {
        // Fallback for generic addRevealed
        store.addRevealed(id, nextItem);
      }

      currentIndex++;

      // Call reveal callback if provided
      if (onReveal) onReveal(nextItem);

      // Continue to next item if more to reveal
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
   * Stops the current reveal animation
   */
  function stopReveal() {
    if (currentController) {
      currentController.stop();
      currentController = null;
    }
  }

  /**
   * Pauses the current reveal animation
   */
  function pauseReveal() {
    if (currentController && !currentController.isPaused) {
      currentController.pause();
    }
  }

  /**
   * Resumes the current reveal animation
   */
  function resumeReveal() {
    if (currentController && currentController.isPaused) {
      currentController.resume();
    }
  }

  /**
   * Reveals all items at once for the given id
   * @param id Item id
   * @param onComplete Optional callback to execute when all items are revealed
   * @returns True if operation was successful, false otherwise
   */
  function revealAll(id: string, onComplete?: () => void): boolean {
    // Stop any current animation
    if (currentController) {
      currentController.stop();
      currentController = null;
    }

    const store = useStore();

    // Use custom implementation if provided, otherwise use store method
    const result = customRevealAll
      ? customRevealAll(id, store)
      : (() => {
          const context = store.getContext(id);
          if (!context) return false;
          store.revealAll(id);
          return true;
        })();

    // Call completion callback if provided
    if (onComplete) onComplete();

    return result;
  }

  /**
   * Covers all items (hides all revealed items) for the given id
   * @param id Item id
   * @param onComplete Optional callback to execute when all items are covered
   * @returns True if operation was successful, false otherwise
   */
  function coverAll(id: string, onComplete?: () => void): boolean {
    // Stop any current animation
    if (currentController) {
      currentController.stop();
      currentController = null;
    }

    const store = useStore();

    // Use custom implementation if provided, otherwise use store method
    const result = customCoverAll
      ? customCoverAll(id, store)
      : (() => {
          const context = store.getContext(id);
          if (!context) return false;
          store.coverAll(id);
          return true;
        })();

    // Call completion callback if provided
    if (onComplete) onComplete();

    return result;
  }

  return {
    startReveal,
    stopReveal,
    pauseReveal,
    resumeReveal,
    revealAll,
    coverAll,
  };
}
