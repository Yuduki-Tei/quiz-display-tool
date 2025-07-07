import { defineStore } from "pinia";
import type { ImageData } from "../@types/types";

export const useImageStore = defineStore("imageStore", {
  state: () => ({
    allData: [] as Array<ImageData>,
    currentIndex: -1,
  }),
  getters: {
    currentImage(state): ImageData | null {
      if (
        state.currentIndex >= 0 &&
        state.currentIndex < state.allData.length
      ) {
        return state.allData[state.currentIndex];
      }
      return null;
    },
    canGoPrev(state): boolean {
      return state.currentIndex > 0;
    },
    canGoNext(state): boolean {
      return state.currentIndex < state.allData.length - 1;
    },
  },
  actions: {
    setCurrentById(id: string) {
      const index = this.allData.findIndex((data) => data.id === id);
      if (index !== -1) {
        this.currentIndex = index;
      }
    },
    goToNext(): string | null {
      if (this.canGoNext) {
        this.currentIndex++;
        return this.currentImage?.id || null;
      }
      return null;
    },
    goToPrev(): string | null {
      if (this.canGoPrev) {
        this.currentIndex--;
        return this.currentImage?.id || null;
      }
      return null;
    },
    updateOrder(newOrder: ImageData[]) {
      const currentId = this.currentImage?.id;
      this.allData = newOrder;
      if (currentId) {
        this.setCurrentById(currentId);
      }
    },

    getIndexById(id: string): number {
      return this.allData.findIndex((c: ImageData) => c.id === id);
    },

    addData(data: ImageData): "added" | "updated" {
      const existingIndex = this.getIndexById(data.id);
      if (existingIndex === -1) {
        this.allData.push(data);
        this.currentIndex = this.allData.length - 1;
        return "added";
      } else {
        this.allData[existingIndex] = data;
        return "updated";
      }
    },

    removeData(id: string) {
      const indexToRemove = this.allData.findIndex((data) => data.id === id);
      if (indexToRemove === -1) return;

      const wasCurrentImage = this.currentImage?.id === id;
      const removedImage = this.allData[indexToRemove];

      this.allData.splice(indexToRemove, 1);

      if (
        removedImage &&
        removedImage.thumbnailSrc &&
        removedImage.thumbnailSrc.startsWith("blob:")
      ) {
        URL.revokeObjectURL(removedImage.thumbnailSrc);
      }

      if (this.allData.length === 0) {
        this.currentIndex = -1;
        return;
      }

      if (wasCurrentImage) {
        this.currentIndex = Math.min(indexToRemove, this.allData.length - 1);
      } else if (this.currentIndex > indexToRemove) {
        this.currentIndex--;
      }
      // No need to call setCurrentById(oldCurrentId) if current index is not changed or already adjusted.
    },

    getData(id: string | number | null): ImageData | null {
      if (id === null) {
        return this.allData[this.currentIndex] || null;
      }
      if (typeof id === "number" && id >= 0 && id < this.allData.length) {
        return this.allData[id] || null;
      }
      const idx = this.getIndexById(id);
      return idx !== -1 ? this.allData[idx] : null;
    },

    setData(id: string | number, data: ImageData): boolean {
      if (typeof id === "number" && id >= 0 && id < this.allData.length) {
        this.allData[id] = data;
        return true;
      }
      const idx = this.getIndexById(id);
      if (idx !== -1) {
        this.allData[idx] = data;
        return true;
      }
      return false;
    },

    importData(data: { allData: ImageData[]; currentIndex: number }) {
      this.allData = data.allData;
      this.currentIndex = data.currentIndex;
    },
  },
});
