import { useLetterStore } from "@/features/Letter/stores/letterStore";
import type { LetterContext } from "@/features/Letter/types/LetterTypes";

/**
 * LetterAdapter - Manages Letter feature state and synchronization
 *
 * Phase 2: Offline mode - wraps store operations
 * Future: Will add online sync capabilities
 */
export class LetterAdapter {
  private store = useLetterStore();

  /**
   * Get letter context by id
   */
  getContext(id: string | null): LetterContext | null {
    return this.store.getContext(id);
  }

  /**
   * Set letter context
   */
  setContext(id: string, context: LetterContext): void {
    this.store.setContext(id, context);
  }

  /**
   * Update characters per row
   */
  setCharsPerRow(id: string, charsPerRow: number): void {
    this.store.setCharsPerRow(id, charsPerRow);
  }

  /**
   * Check if letter context exists
   */
  hasContext(id: string): boolean {
    return this.store.hasContext(id);
  }

  /**
   * Set auto revealing state
   */
  setAutoRevealing(value: boolean): void {
    this.store.setAutoRevealing(value);
  }

  /**
   * Set paused state
   */
  setPaused(value: boolean): void {
    this.store.setPaused(value);
  }

  /**
   * Reveal a character at index
   */
  revealChar(id: string, index: number): void {
    this.store.revealChar(id, index);
  }

  /**
   * Reveal all characters
   */
  revealAll(id: string): void {
    this.store.revealAll(id);
  }

  /**
   * Cover all characters
   */
  coverAll(id: string): void {
    this.store.coverAll(id);
  }

  /**
   * Generate reveal order based on mode
   */
  generateOrder(id: string, mode: string): void {
    this.store.generateOrder(id, mode);
  }

  /**
   * Get auto revealing state
   */
  isAutoRevealing(): boolean {
    return this.store.isAutoRevealing;
  }

  /**
   * Get paused state
   */
  isPaused(): boolean {
    return this.store.isPaused;
  }
}

// Global singleton instance
let letterAdapterInstance: LetterAdapter | null = null;

/**
 * Get LetterAdapter singleton instance
 */
export function useLetterAdapter(): LetterAdapter {
  if (!letterAdapterInstance) {
    letterAdapterInstance = new LetterAdapter();
  }
  return letterAdapterInstance;
}
