import { defineStore } from "pinia";
import type { PanelAmount, PanelContext } from "../types/PanelTypes";

interface PanelState {
  contexts: Record<string, PanelContext>;
  isAutoRevealing: boolean;
  isPaused: boolean;
}

export const usePanelStore = defineStore("panel", {
  state: (): PanelState => ({
    contexts: {},
    isPaused: false,
    isAutoRevealing: false,
  }),
  actions: {
    /**
     * Get panel context by id
     */
    getContext(id: string | null): PanelContext | null {
      return id ? this.contexts[id] : null;
    },

    /**
     * Set panel context
     */
    setContext(id: string, context: PanelContext): void {
      this.contexts[id] = context;
    },

    /**
     * Set panel grid dimensions
     */
    setAmount(id: string, amount: PanelAmount): void {
      if (this.contexts[id]) {
        this.contexts[id].amount = amount;
      }
    },

    /**
     * Check if panel has grid dimensions set
     */
    hasSelection(id: string): boolean {
      const context = this.getContext(id);
      return context ? !!(context.amount.x && context.amount.y) : false;
    },

    /**
     * Check if panel context exists
     */
    hasContext(id: string): boolean {
      return !!this.contexts[id];
    },

    /**
     * Remove panel context
     */
    removeContext(id: string): boolean {
      if (this.contexts[id]) {
        delete this.contexts[id];
        return true;
      }
      return false;
    },

    /**
     * Set reveal animation pause state
     */
    setPaused(paused: boolean): void {
      this.isPaused = paused;
    },

    /**
     * Set reveal animation active state
     */
    setRevealing(revealing: boolean): void {
      this.isAutoRevealing = revealing;
    },

    /**
     * Import panel contexts data
     */
    importData(data: { contexts: Record<string, PanelContext> }) {
      this.contexts = data.contexts;
    },

    /**
     * Check if more panels can be revealed
     */
    canReveal(context: PanelContext): boolean {
      if (!context) return false;

      // Check if all panels are already revealed
      const totalPanels = context.amount.x * context.amount.y;
      const revealedCount = context.revealed.length;

      return revealedCount < totalPanels;
    },

    /**
     * Set the reveal order for a panel
     */
    setOrder(id: string, order: [number, number][]): void {
      if (this.contexts[id]) {
        this.contexts[id].order = order;
      }
    },

    /**
     * Add a panel to the revealed list
     */
    addRevealedPanel(id: string, panel: [number, number]): void {
      if (this.contexts[id]) {
        this.contexts[id].revealed.push(panel);
      }
    },

    /**
     * Clear all revealed panels for a specific panel context
     */
    clearRevealedPanels(id: string): void {
      if (this.contexts[id]) {
        this.contexts[id].revealed = [];
      }
    },
  },
});
