import { defineStore } from "pinia";
import type { PanelAmount } from "../types/PanelTypes";
import { PanelContext } from "../types/PanelTypes";

interface PanelState {
  contexts: Record<string, PanelContext>;
  isRevealing: boolean;
  isPaused: boolean;
}

export const usePanelStore = defineStore("panel", {
  state: (): PanelState => ({
    contexts: {},
    isPaused: false,
    isRevealing: false,
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
  },
});
