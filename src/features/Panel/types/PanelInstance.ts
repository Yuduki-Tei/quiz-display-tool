/**
 * Panel component instance interface
 * Defines the public API exposed by the Panel component
 */
export interface PanelInstance {
  /**
   * Start automatic panel revealing
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
   * Reveal all panels immediately
   * @returns true if successful, false otherwise
   */
  revealAllPanels: () => boolean;

  /**
   * Cover all panels (hide all revealed panels)
   * @returns true if successful, false otherwise
   */
  coverAllPanels: () => boolean;
}
