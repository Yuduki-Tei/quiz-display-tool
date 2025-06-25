<template>
  <div>
    <input type="file" accept="image/*" @change="onFileChange" />
    <slot :imageState="imageState" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { loadImageFile } from './loadImageUtil';

export interface ImageState {
  image: HTMLImageElement | null;
  naturalWidth: number;
  naturalHeight: number;
  displayWidth: number;
  displayHeight: number;
}

export default defineComponent({
  name: 'ImageProvider',
  setup() {
    const imageState = ref<ImageState>({
      image: null,
      naturalWidth: 0,
      naturalHeight: 0,
      displayWidth: 0,
      displayHeight: 0
    });

    const onFileChange = async (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || !files[0]) return;
      const file = files[0];
      const maxW = 1280, maxH = 720;
      try {
        const result = await loadImageFile(file, maxW, maxH);
        imageState.value = {
          image: result.image,
          naturalWidth: result.naturalWidth,
          naturalHeight: result.naturalHeight,
          displayWidth: result.width,
          displayHeight: result.height
        };
      } catch (err) {
        imageState.value = {
          image: null,
          naturalWidth: 0,
          naturalHeight: 0,
          displayWidth: 0,
          displayHeight: 0
        };
      }
    };

    return { imageState, onFileChange };
  }
});
</script>
