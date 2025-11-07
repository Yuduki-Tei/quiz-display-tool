/**
 * Zoomer component instance interface
 * Defines the public API exposed by the Zoomer component
 */
export interface ZoomerInstance {
  /**
   * Start zoom out animation
   */
  startZoomOut: () => void;

  /**
   * Pause the zoom out animation
   */
  pauseZoomOut: () => void;

  /**
   * Resume the paused zoom out animation
   */
  resumeZoomOut: () => void;

  /**
   * Show the full image
   */
  showFullImage: () => void;
}
