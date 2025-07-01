import { defineStore } from "pinia";
import type { ImageContext } from "../@types/types";

export const useImageStore = defineStore("imageStore", {
  state: () => ({
    contexts: [] as Array<ImageContext>,
    currentIndex: -1,
  }),
  actions: {
    getIndexById(id: string): number {
      return this.contexts.findIndex((c: ImageContext) => c.id === id);
    },

    addContext(ctx: ImageContext): "added" | "updated" {
      const id = ctx.id;
      if (this.getIndexById(id) === -1) {
        this.contexts.push(ctx);
        this.currentIndex = this.contexts.length - 1;
        return "added";
      } else {
        this.setContext(id, ctx);
        return "updated";
      }
    },

    removeContext(id: string | number | null): boolean {
      if (id === null) {
        if (this.contexts.length > 0) {
          this.contexts.splice(id, 1);
          return true;
        }
        return false;
      }
      if (typeof id === "number" && id >= 0 && id < this.contexts.length) {
        this.contexts.splice(id, 1);
        return true;
      }
      const idx = this.getIndexById(id);
      if (idx >= 0 && idx < this.contexts.length) {
        this.contexts.splice(idx, 1);
        return true;
      }
      return false;
    },

    getContext(id: string | number | null): ImageContext | null {
      if (id === null) {
        return this.contexts[this.currentIndex] || null;
      }
      if (typeof id === "number" && id >= 0 && id < this.contexts.length) {
        return this.contexts[id] || null;
      }
      const idx = this.getIndexById(id);
      return idx !== -1 ? this.contexts[idx] : null;
    },

    setContext(id: string | number, ctx: ImageContext): boolean {
      if (typeof id === "number" && id >= 0 && id < this.contexts.length) {
        this.contexts[id] = ctx;
        return true;
      }
      const idx = this.getIndexById(id);
      if (idx !== -1) {
        this.contexts[idx] = ctx;
        return true;
      }
      return false;
    },
  },
});
