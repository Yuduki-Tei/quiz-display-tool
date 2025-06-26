import { defineStore } from "pinia";
import type { ImageContext } from "../@types/types";

interface ImageState {
    context: ImageContext | null,
    isLoaded: boolean,
    isShaped: boolean,
}

export const useImageStore = defineStore('image', {
  state: () => ({ 
    context: null as ImageContext | null,
    isLoaded: false,
    isShaped: false,
  } as ImageState),
  actions: {
    async loadImageFile(file: File, maxWidth = 1280, maxHeight = 720) {
      return new Promise<void>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          const naturalWidth = w;
          const naturalHeight = h;
          const scale = Math.min(maxWidth / w, maxHeight / h, 1);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
          this.context = {
            canvas: null,
            image: img,
            naturalWidth,
            naturalHeight,
            displayWidth: w,
            displayHeight: h
          };
          this.isLoaded = true;
          this.isShaped = true;
          resolve();
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
    },
    resetImage() {
      this.context = null;
      this.isLoaded = false;
      this.isShaped = false;
    }
  }
});