import { defineStore } from "pinia";
import type { LetterContext } from "../types/LetterTypes";
import { useSessionStore } from '@/stores/sessionStore';
import { useTextStore } from '@/stores/dataStore';
import { emitLetterPatch } from '@/realtime/letterSync';

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
      const isNew = !this.contexts[id];
      this.contexts[id] = context;
      const session = useSessionStore();
      if (session.role === 'host') {
        if (isNew) {
          const textStore = useTextStore();
          const data = textStore.getData(id);
            if (data) {
              emitLetterPatch([
                { type: 'addContext', item: { id: data.id, name: (data as any).name || data.id, content: (data as any).content || '', thumbnailSrc: (data as any).thumbnailSrc || null, context } }
              ]);
            }
        } else {
          emitLetterPatch([
            { type: 'patchContext', id, partial: context }
          ]);
        }
      }
    },

    /**
     * Update characters per row
     */
    setCharsPerRow(id: string, charsPerRow: number): void {
      if (this.contexts[id]) {
        this.contexts[id].charsPerRow = charsPerRow;
        const session = useSessionStore();
        if (session.role === 'host') {
          emitLetterPatch([
            { type: 'patchContext', id, partial: { charsPerRow } }
          ]);
        }
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
        const session = useSessionStore();
        if (session.role === 'host') {
          emitLetterPatch([
            { type: 'appendRevealed', id, indices: [index] }
          ]);
        }
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
        const session = useSessionStore();
        if (session.role === 'host') {
          emitLetterPatch([
            { type: 'setRevealed', id, revealed: [...context.revealed] }
          ]);
        }
      }
    },

    /**
     * Cover all characters
     */
    coverAll(id: string): void {
      const context = this.getContext(id);
      if (context) {
        context.revealed = [];
        const session = useSessionStore();
        if (session.role === 'host') {
          emitLetterPatch([
            { type: 'setRevealed', id, revealed: [] }
          ]);
        }
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
      const session = useSessionStore();
      if (session.role === 'host') {
        emitLetterPatch([
          { type: 'patchContext', id, partial: { order: [...indices] } }
        ]);
      }
    },
  },
});
