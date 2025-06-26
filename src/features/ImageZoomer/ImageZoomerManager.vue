<template>
  <div>
    <input type="file" accept="image/*" @change="onFileChange" style="margin-bottom:1em;" />
    <div v-if="context && context.image">
      <ImageZoomer ref="imageZoomer" />
      <button @click="startZoomOut">Zoom Out</button>
      <button @click="handlePauseOrResumeZoomOut" :disabled="!isZooming">
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>
      <button @click="handleShowFullImage">Show Full Image</button>
      <GenericQueue
        ref="genericQueue"
        :add-item="context"
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
import { defineComponent, ref } from 'vue';
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
      // 必要なら外部同期
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
