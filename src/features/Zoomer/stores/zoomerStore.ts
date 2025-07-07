import { defineStore } from "pinia";
import type { ZoomerContext } from "../types/ZoomerTypes";
import type { SelectionRect } from "../types/ZoomerTypes";

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

    setRect(id: string, rect: SelectionRect): void {
      if (this.contexts[id]) {
        this.contexts[id].selection = rect;
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

    setZooming(zooming: boolean): void {
      this.isZooming = zooming;
    },

    hasSelection(id: string): boolean {
      const context = this.getContext(id);
      return context ? !!(context.selection.w && context.selection.h) : false;
    },

    importData(data: { contexts: Record<string, ZoomerContext> }) {
      this.contexts = data.contexts;
    },
  },
});
