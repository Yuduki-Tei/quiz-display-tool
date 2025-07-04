<template>
  <div>
    <div class="top-bar">
      <input type="file" accept="image/*" @change="onFileChange" />
      <div class="button-row">
        <button @click="startZoomOut" :disabled="!hasSelection || isZooming">
          Zoom Out
        </button>
        <button
          @click="handlePauseOrResumeZoomOut"
          :disabled="!isZooming && !isPaused"
        >
          {{ isPaused ? "Resume" : "Pause" }}
        </button>
        <button
          @click="handleShowFullImage"
          :disabled="!currentId || !isZooming"
        >
          Show Full Image
        </button>
      </div>
    </div>
    <div>
      <Zoomer ref="zoomer" :id="currentId" />
      <div style="margin-top: 1em"></div>
    </div>
  </div>
  <Notifier :status="notificationStatus" :timestamp="notificationTimestamp" />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useImageStore } from "@/stores/imageStore";
import { useZoomerStore } from "./stores/zoomerStore";
import { loadImageFile } from "@/composables/useImageLoader";
import Zoomer from "./views/Zoomer.vue";
import Notifier from "@/components/Notifier.vue";

const imageStore = useImageStore();
const zoomStore = useZoomerStore();
const { isZooming, isPaused } = storeToRefs(zoomStore);

const zoomer = ref<InstanceType<typeof Zoomer> | null>(null);

const currentId = ref<string | null>(null);
const notificationStatus = ref<string | null>(null);
const notificationTimestamp = ref<number | null>(null);

const hasSelection = computed(() => {
  if (!currentId.value) return false;
  const ctx = zoomStore.getContext(currentId.value);
  const sel = ctx?.selection;
  return !!(ctx && sel && sel.w && sel.h);
});

const onFileChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || !files[0]) return;
  const file = files[0];

  try {
    const imgData = await loadImageFile(file);
    currentId.value = imgData.id;
    const status = imageStore.addData(imgData);

    if (status === "added") {
      zoomStore.setContext(currentId.value, {
        selection: { x: 0, y: 0, w: 0, h: 0 },
      });
    }

    notificationStatus.value = status;
    notificationTimestamp.value = Date.now();

    handleShowFullImage();
  } catch (err) {
    notificationStatus.value = "error";
    notificationTimestamp.value = Date.now();
  }
};

const startZoomOut = () => {
  zoomer.value?.startZoomOut();
};

const handlePauseOrResumeZoomOut = () => {
  if (isPaused.value) {
    zoomer.value?.resumeZoomOut();
  } else {
    zoomer.value?.pauseZoomOut();
  }
};

const handleShowFullImage = () => {
  zoomer.value?.showFullImage();
};
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
