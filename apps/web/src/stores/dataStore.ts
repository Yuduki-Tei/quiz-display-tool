import { defineStore } from "pinia";
import type { BaseData, ImageData, TextData } from "@shared-types/types";

function createDataStore<T extends BaseData>(storeName: string) {
  return defineStore(storeName, {
    state: () => ({
      allData: [] as Array<T>,
      currentIndex: -1,
    }),
    getters: {
      currentData(state) {
        if (
          state.currentIndex >= 0 &&
          state.currentIndex < state.allData.length
        ) {
          return state.allData[state.currentIndex] as T;
        }
        return null as T | null;
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
        return this.currentData?.id || null;
      }
      return null;
    },
    goToPrev(): string | null {
      if (this.canGoPrev) {
        this.currentIndex--;
        return this.currentData?.id || null;
      }
      return null;
    },
    updateOrder(newOrder: T[]) {
      const currentId = this.currentData?.id;
      this.allData = newOrder;
      if (currentId) {
        this.setCurrentById(currentId);
      }
    },

    getIndexById(id: string): number {
      return this.allData.findIndex((c: T) => c.id === id);
    },

    addData(data: T): "added" | "updated" {
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

      const wasCurrentData = this.currentData?.id === id;
      const removedData = this.allData[indexToRemove];

      this.allData.splice(indexToRemove, 1);

      if (
        removedData &&
        removedData.thumbnailSrc &&
        removedData.thumbnailSrc.startsWith("blob:")
      ) {
        URL.revokeObjectURL(removedData.thumbnailSrc);
      }

      if (this.allData.length === 0) {
        this.currentIndex = -1;
        return;
      }

      if (wasCurrentData) {
        this.currentIndex = Math.min(indexToRemove, this.allData.length - 1);
      } else if (this.currentIndex > indexToRemove) {
        this.currentIndex--;
      }
    },

    getData(id: string | number | null): T | null {
      if (id === null) {
        return this.allData[this.currentIndex] || null;
      }
      if (typeof id === "number" && id >= 0 && id < this.allData.length) {
        return this.allData[id] || null;
      }
      const idx = this.getIndexById(id);
      return idx !== -1 ? this.allData[idx] : null;
    },

    setData(id: string | number, data: T): boolean {
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

    importData(data: { allData: T[]; currentIndex: number }) {
      this.allData = data.allData;
      this.currentIndex = data.currentIndex;
    },

    getAllData(): T[] {
      return this.allData;
    },
  },
  });
}

export const useImageStore = createDataStore<ImageData>("imageStore");

// Create base text store
const _useTextStore = createDataStore<TextData>("textStore");

// Extend text store with additional methods for text synchronization
export function useTextStore() {
  const store = _useTextStore();

  // Add extension methods to the store instance
  return Object.assign(store, {
    /**
     * Add a placeholder text (for viewers)
     * Creates a TextData with placeholder characters
     */
    addPlaceholderText(
      id: string,
      name: string,
      totalChars: number,
      thumbnailSrc: string | null
    ): "added" | "updated" {
      const placeholder = "■".repeat(totalChars);
      return store.addData({
        id,
        name,
        content: placeholder,
        thumbnailSrc,
      } as TextData);
    },

    /**
     * Update a specific character at index
     */
    updateCharAt(id: string, index: number, char: string): boolean {
      const idx = store.getIndexById(id);
      if (idx === -1) return false;

      const data = store.allData[idx];
      const arr = data.content.split("");
      if (index < 0 || index >= arr.length) return false;

      arr[index] = char;
      // Use setData to trigger reactivity
      store.setData(id, { ...data, content: arr.join("") });
      return true;
    },

    /**
     * Batch update multiple characters
     */
    batchUpdateChars(
      id: string,
      chars: Array<{ index: number; char: string }>
    ): boolean {
      const idx = store.getIndexById(id);
      if (idx === -1) return false;

      const data = store.allData[idx];
      const arr = data.content.split("");
      chars.forEach(({ index, char }) => {
        if (index >= 0 && index < arr.length) {
          arr[index] = char;
        }
      });
      // Use setData to trigger reactivity
      store.setData(id, { ...data, content: arr.join("") });
      return true;
    },
  });
}
