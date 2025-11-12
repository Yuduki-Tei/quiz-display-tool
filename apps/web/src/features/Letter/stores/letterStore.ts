import { defineStore } from "pinia";
import type { LetterContext } from "../types/LetterTypes";

interface LetterState {
  contexts: Record<string, LetterContext>;
  isAutoRevealing: boolean;
  isPaused: boolean;
}

export const useLetterStore = defineStore("letter", {
  state: (): LetterState => ({
    contexts: {},
    isPaused: false,
    isAutoRevealing: false,
  }),
  actions: {
    /**
     * Get letter context by id
     */
    getContext(id: string | null): LetterContext | null {
      return id ? this.contexts[id] || null : null;
    },

    /**
     * Set letter context
     */
    setContext(id: string, context: LetterContext): void {
      this.contexts[id] = context;
    },

    /**
     * Update characters per row
     */
    setCharsPerRow(id: string, charsPerRow: number): void {
      if (this.contexts[id]) {
        this.contexts[id].charsPerRow = charsPerRow;
      }
    },

    /**
     * Check if letter context exists
     */
    hasContext(id: string): boolean {
      return !!this.contexts[id];
    },

    /**
     * Set auto revealing state
     */
    setAutoRevealing(value: boolean): void {
      this.isAutoRevealing = value;
    },

    /**
     * Set paused state
     */
    setPaused(value: boolean): void {
      this.isPaused = value;
    },

    /**
     * Reveal a character at index
     */
    revealChar(id: string, index: number): void {
      const context = this.getContext(id);
      if (context && !context.revealed.includes(index)) {
        context.revealed.push(index);
      }
    },

    /**
     * Reveal all characters
     */
    revealAll(id: string): void {
      const context = this.getContext(id);
      if (context) {
        context.revealed = Array.from(
          { length: context.totalChars },
          (_, i) => i
        );
      }
    },

    /**
     * Cover all characters
     */
    coverAll(id: string): void {
      const context = this.getContext(id);
      if (context) {
        context.revealed = [];
      }
    },

    /**
     * Generate reveal order based on mode
     */
    generateOrder(id: string, mode: string): void {
      const context = this.getContext(id);
      if (!context) return;

      const indices = Array.from({ length: context.totalChars }, (_, i) => i);

      switch (mode) {
        case "random":
          // Shuffle array
          for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
          }
          break;
        case "sequential":
          // Already in order
          break;
        case "reverse":
          indices.reverse();
          break;
      }

      context.order = indices;
    },
  },
});
