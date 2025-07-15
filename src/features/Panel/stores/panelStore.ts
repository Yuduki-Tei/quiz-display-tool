import { defineStore } from "pinia";
import type { PanelAmount } from "../types/PanelTypes";
import { PanelContext } from "../types/PanelTypes";
import { generateRevealOrder } from "../composables/revealUtil";

interface PanelState {
  contexts: Record<string, PanelContext>;
  isRevealing: boolean;
  isPaused: boolean;
  revealTimer: number | null;
  currentRevealIndex: number;
}

export const usePanelStore = defineStore("panel", {
  state: (): PanelState => ({
    contexts: {},
    isPaused: false,
    isRevealing: false,
    revealTimer: null,
    currentRevealIndex: 0,
  }),
  actions: {
    getContext(id: string | null): PanelContext | null {
      return id ? this.contexts[id] : null;
    },

    setContext(id: string, context: PanelContext): void {
      this.contexts[id] = context;
    },

    setAmount(id: string, amount: PanelAmount): void {
      if (this.contexts[id]) {
        this.contexts[id].amount = amount;
      }
    },

    hasSelection(id: string): boolean {
      const context = this.getContext(id);
      return context ? !!(context.amount.x && context.amount.y) : false;
    },

    hasContext(id: string): boolean {
      return !!this.contexts[id];
    },

    removeContext(id: string): boolean {
      if (this.contexts[id]) {
        delete this.contexts[id];
        return true;
      }
      return false;
    },

    setPaused(paused: boolean): void {
      this.isPaused = paused;
    },

    setRevealing(reavealing: boolean): void {
      this.isRevealing = reavealing;
    },

    importData(data: { contexts: Record<string, PanelContext> }) {
      this.contexts = data.contexts;
    },

    canReveal(context: PanelContext): boolean {
      if (!context) return false;

      // Check if all panels are already revealed
      const totalPanels = context.amount.x * context.amount.y;
      const revealedCount = context.revealed.length;

      return revealedCount < totalPanels;
    },

    setRevealOrder(id: string): void {
      if (!this.contexts[id]) return;

      const context = this.contexts[id];
      const revealMode = context.revealMode || "random";

      // Use the utility function to generate reveal order
      this.contexts[id].order = generateRevealOrder(
        revealMode,
        context.amount,
        context.revealed
      );

      this.currentRevealIndex = 0;
    },

    revealNextPanel(id: string): boolean {
      if (
        !this.contexts[id] ||
        !this.contexts[id].order ||
        this.currentRevealIndex >= this.contexts[id].order.length
      ) {
        return false;
      }

      const nextPanel = this.contexts[id].order[this.currentRevealIndex];
      this.contexts[id].revealed.push(nextPanel);
      this.currentRevealIndex++;

      return this.currentRevealIndex < this.contexts[id].order.length;
    },

    startAutoReveal(id: string, duration: number): void {
      if (this.isRevealing || !this.contexts[id]) return;

      this.setRevealOrder(id);
      this.isRevealing = true;
      this.isPaused = false;

      const revealNext = () => {
        if (!this.isRevealing || this.isPaused) return;

        const hasMore = this.revealNextPanel(id);
        if (hasMore) {
          this.revealTimer = window.setTimeout(revealNext, duration);
        } else {
          this.isRevealing = false;
        }
      };

      revealNext();
    },

    stopAutoReveal(): void {
      if (this.revealTimer) {
        clearTimeout(this.revealTimer);
        this.revealTimer = null;
      }
      this.isRevealing = false;
      this.isPaused = false;
    },
  },
});
