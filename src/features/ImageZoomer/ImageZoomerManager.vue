<template>
  <div>
    <input type="file" accept="image/*" @change="onFileChange" style="margin-bottom:1em;" />
    <div v-if="imageState && imageState.image">
      <ImageZoomer
        ref="imageZoomer"
        :context="currentContext"
        :animationDuration="10000"
        @update:selection="onSelectionUpdate"
        @zoom-start="isZooming = true; isPaused = false"
        @zoom-finish="isZooming = false; isPaused = false"
        @zoom-pause="isPaused = true"
        @zoom-resume="isPaused = false"
        @show-full-image="isZooming = false; isPaused = false"
      />
      <button @click="startZoomOut">Zoom Out</button>
      <button @click="handlePauseOrResumeZoomOut" :disabled="!isZooming">
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>
      <button @click="handleShowFullImage">Show Full Image</button>
      <GenericQueue
        ref="genericQueue"
        :add-item="currentContext"
        @update:current="onQueueCurrentChange"
        @update:queue="onQueueChange"
      />
      <div style="margin-top:1em;">
        <button @click="handleExportQueue">Export Queue</button>
        <input type="file" accept="application/json" @change="handleImportQueue" />
      </div>
    </div>
    <div v-else style="margin:1em;color:#888;">Please select an image and select a region.</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useImageStore } from '../../stores/imageStore';
import ImageZoomer from './views/ImageZoomer.vue';
import GenericQueue from '../../components/GenericQueue.vue';
import type { ImageZoomerContext } from './types/ImageZoomerTypes';

export default defineComponent({
  name: 'ImageZoomerManager',
  components: { ImageZoomer, GenericQueue },
  setup() {
    const imageStore = useImageStore();
    const { context: imageState } = storeToRefs(imageStore);
    const imageZoomer = ref();
    const genericQueue = ref();
    const isZooming = ref(false);
    const isPaused = ref(false);
    const aspectRatio = ref(1);
    watch(
      [() => imageState.value?.displayWidth, () => imageState.value?.displayHeight],
      ([w, h]) => {
        if (w > 0 && h > 0) aspectRatio.value = w / h;
      },
      { immediate: true }
    );
    const selection = ref({ x: 0, y: 0, w: 0, h: 0 });
    const onSelectionUpdate = (rect: any) => {
      selection.value = rect;
    };
    // context
    const currentContext = computed<ImageZoomerContext>(() => {
      if (!imageState.value || !imageState.value.image) return null as any;
      return {
        image: imageState.value.image,
        naturalWidth: imageState.value.naturalWidth,
        naturalHeight: imageState.value.naturalHeight,
        displayWidth: imageState.value.displayWidth,
        displayHeight: imageState.value.displayHeight,
        selection: selection.value
      };
    });

    const onQueueCurrentChange = (ctx: ImageZoomerContext) => {
      if (!ctx) return;
      if (!imageState.value) return;
      imageState.value.image = ctx.image;
      imageState.value.naturalWidth = ctx.naturalWidth;
      imageState.value.naturalHeight = ctx.naturalHeight;
      imageState.value.displayWidth = ctx.displayWidth;
      imageState.value.displayHeight = ctx.displayHeight;
      selection.value = { ...ctx.selection };
    };
    const onQueueChange = (queue: ImageZoomerContext[]) => {
      // TODO: 需要時可同步 queue 狀態到外部
    };

    const handleExportQueue = () => {
      genericQueue.value?.exportQueue();
    };
    const handleImportQueue = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (!input.files || !input.files[0]) return;
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = evt.target?.result as string;
          genericQueue.value?.importQueue(data);
        } catch (err) {
          alert('Failed to import queue');
        }
      };
      reader.readAsText(file);
    };

    // zoomout animation
    const startZoomOut = () => {
      imageZoomer.value?.startZoomOut();
    };
    const handlePauseOrResumeZoomOut = () => {
      if (isPaused.value) {
        imageZoomer.value?.resumeZoomOut();
      } else {
        imageZoomer.value?.pauseZoomOut();
      }
    };
    const handleShowFullImage = () => {
      imageZoomer.value?.showFullImage();
    };

    // 画像ファイル選択
    const onFileChange = async (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || !files[0]) return;
      const file = files[0];
      try {
        await imageStore.loadImageFile(file);
      } catch (err) {
        imageStore.resetImage();
      }
    };

    return {
      imageZoomer,
      genericQueue,
      isZooming,
      isPaused,
      startZoomOut,
      handlePauseOrResumeZoomOut,
      handleShowFullImage,
      currentContext,
      onSelectionUpdate,
      onQueueCurrentChange,
      onQueueChange,
      handleExportQueue,
      handleImportQueue,
      imageState,
      onFileChange
    };
  }
});
</script>

<style scoped>
.canvas-container {
  position: relative;
  margin-top: 1em;
}
canvas {
  border: 1px solid #ccc;
  background: #222;
}
</style>
