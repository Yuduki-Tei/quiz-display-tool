/**
 * Letter component instance interface
 * Defines the public API exposed by the Letter component
 */
export interface LetterInstance {
  /**
   * Start automatic letter revealing
   * @returns true if started successfully, false otherwise
   */
  startAutoReveal: () => boolean;

  /**
   * Pause the automatic revealing process
   * @returns true if paused successfully
   */
  pauseAutoReveal: () => boolean;

  /**
   * Resume the paused automatic revealing process
   * @returns true if resumed successfully
   */
  resumeAutoReveal: () => boolean;

  /**
   * Stop the automatic revealing process
   * @returns true if stopped successfully
   */
  stopAutoReveal: () => boolean;

  /**
   * Reveal all letters immediately
   * @returns true if successful, false otherwise
   */
  revealAllLetters: () => boolean;

  /**
   * Cover all letters (hide all revealed letters)
   * @returns true if successful, false otherwise
   */
  coverAllLetters: () => boolean;
}
