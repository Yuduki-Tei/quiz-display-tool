import { defineStore } from 'pinia';
import type { ImageZoomerContext } from '../types/ImageZoomerTypes';

interface ImageZoomerState {
  context: ImageZoomerContext | null;
  isLoading: boolean;
  isZooming: boolean;
}

export const useImageZoomerStore = defineStore('imageZoomer', {
  state: (): ImageZoomerState => ({
    context: null,
    isLoading: false,
    isZooming: false
  }),
  actions: {
    setContext(ctx: ImageZoomerContext) {
      this.context = ctx;
    },
    resetContext() {
      this.context = null;
    }
  }
});
