import { defineStore } from "pinia";
import type { ImageData } from "../@types/types";

export const useImageStore = defineStore("imageStore", {
  state: () => ({
    allData: [] as Array<ImageData>,
    currentIndex: -1,
  }),
  actions: {
    getIndexById(id: string): number {
      return this.allData.findIndex((c: ImageData) => c.id === id);
    },

    addData(data: ImageData): "added" | "updated" {
      const id = data.id;
      if (this.getIndexById(id) === -1) {
        this.allData.push(data);
        this.currentIndex = this.allData.length - 1;
        return "added";
      } else {
        this.setData(id, data);
        return "updated";
      }
    },

    removeData(id: string | number | null): boolean {
      if (id === null) {
        if (this.allData.length > 0) {
          this.allData.splice(id, 1);
          return true;
        }
        return false;
      }
      if (typeof id === "number" && id >= 0 && id < this.allData.length) {
        this.allData.splice(id, 1);
        return true;
      }
      const idx = this.getIndexById(id);
      if (idx >= 0 && idx < this.allData.length) {
        this.allData.splice(idx, 1);
        return true;
      }
      return false;
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
  },
});
