import { defineStore } from "pinia";
import type { ZoomerContext } from "../types/ZoomerTypes";

interface ZoomerState {
  contexts: Record<string, ZoomerContext>;
  isPaused: boolean;
  isZooming: boolean;
}

export const useZoomerStore = defineStore("zoomer", {
  state: (): ZoomerState => ({
    contexts: {},
    isPaused: false,
    isZooming: false,
  }),
  actions: {
    getContext(id: string | null): ZoomerContext | null {
      return id ? this.contexts[id] : null;
    },

    setContext(id: string, context: ZoomerContext): void {
      this.contexts[id] = context;
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

    setZooming(zooming: boolean): void {
      this.isZooming = zooming;
    },
  },
});
