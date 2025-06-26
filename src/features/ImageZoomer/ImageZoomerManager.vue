<template>
  <div>
    <div class="top-bar">
      <input type="file" accept="image/*" @change="onFileChange" />
      <div class="button-row">
        <button @click="startZoomOut" :disabled="!hasSelection">Zoom Out</button>
        <button @click="handlePauseOrResumeZoomOut" :disabled="!isZooming && !isPaused">
          {{ isPaused ? 'Resume' : 'Pause' }}
        </button>
        <button @click="handleShowFullImage" :disabled = "!context || !isZooming && !isPaused">Show Full Image</button>
        <button @click="addToQueue" :disabled="!hasSelection">Add to Queue</button>
        <button @click="goPrev" :disabled="!canGoPrev">Prev</button>
        <button @click="goNext" :disabled="!canGoNext">Next</button>
        <button @click="handleExportQueue">Export Queue</button>
        <input type="file" accept="application/json" @change="handleImportQueue" />
      </div>
    </div>
    <div v-if="context && context.image">
      <ImageZoomer ref="imageZoomer" @update:selection="onSelectionUpdate" />
      <GenericQueue ref="genericQueue" :add-item="context" @update:current="onQueueCurrentChange" @update:queue="onQueueChange" />
      <div style="margin-top:1em;">
      </div>
    </div>
    <div v-else style="margin:1em;color:#888;">Please select an image and select a region.</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useImageZoomerStore } from './stores/imageZoomerStore';
import { loadImageFile } from '../../composables/useImageLoader';
import ImageZoomer from './views/ImageZoomer.vue';
import GenericQueue from '../../components/GenericQueue.vue';
import type { ImageZoomerContext, SelectionRect } from './types/ImageZoomerTypes';

export default defineComponent({
  name: 'ImageZoomerManager',
  components: { ImageZoomer, GenericQueue },
  setup() {
    const imageStore = useImageZoomerStore();
    const { context } = storeToRefs(imageStore);
    const imageZoomer = ref();
    const genericQueue = ref();
    const isZooming = ref(false);
    const isPaused = ref(false);

    // ファイル選択
    const onFileChange = async (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || !files[0]) return;
      const file = files[0];
      try {
        const imgData = await loadImageFile(file);
        imageStore.setContext({ ...imgData, selection: { x: 0, y: 0, w: 0, h: 0 }, duration: 10000 });
      } catch (err) {
        imageStore.resetContext();
      }
    };

    // selection更新
    const onSelectionUpdate = (rect: SelectionRect) => {
      if (!context.value) return;
      imageStore.setContext({ ...context.value, selection: rect });
    };

    // queue操作
    const onQueueCurrentChange = (ctx: ImageZoomerContext) => {
      if (!ctx) return;
      imageStore.setContext(ctx);
    };
    const onQueueChange = (queue: ImageZoomerContext[]) => {
      // 可選：外部同步 queue 狀態
    };

    // queueエクスポート/インポート
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
      isZooming.value = true;
      isPaused.value = false;
    };
    const handlePauseOrResumeZoomOut = () => {
      if (isPaused.value) {
        imageZoomer.value?.resumeZoomOut();
        isPaused.value = false;
        isZooming.value = true;
      } else {
        imageZoomer.value?.pauseZoomOut();
        isPaused.value = true;
        isZooming.value = false;
      }
    };
    const handleShowFullImage = () => {
      imageZoomer.value?.showFullImage();
      isZooming.value = false;
      isPaused.value = false;
    };

    // queue 操作按鈕
    const addToQueue = () => genericQueue.value?.addToQueue();
    const goPrev = () => genericQueue.value?.goPrev();
    const goNext = () => genericQueue.value?.goNext();
    const canGoPrev = computed(() => genericQueue.value?.queue?.length > 0 && genericQueue.value?.currentIndex > 0);
    const canGoNext = computed(() => genericQueue.value?.queue?.length > 0 && genericQueue.value?.currentIndex < genericQueue.value?.queue.length - 1);
    const hasSelection = computed(() => {
      const sel = context.value?.selection;
      return !!(context.value && sel && sel.w && sel.h);
    });

    return {
      imageZoomer,
      genericQueue,
      isZooming,
      isPaused,
      startZoomOut,
      handlePauseOrResumeZoomOut,
      handleShowFullImage,
      context,
      onSelectionUpdate,
      onQueueCurrentChange,
      onQueueChange,
      handleExportQueue,
      handleImportQueue,
      onFileChange,
      addToQueue,
      goPrev,
      goNext,
      canGoPrev,
      canGoNext,
      hasSelection
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
.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  align-items: center;
}
.top-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1em;
  margin-bottom: 1em;
}
</style>
