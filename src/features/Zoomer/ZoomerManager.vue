<template>
  <div>
    <div class="top-bar">
      <input type="file" accept="image/*" @change="onFileChange" />
      <div class="button-row">
        <button @click="startZoomOut" :disabled="!hasSelection">
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
          :disabled="!currentId || !(isZooming || isPaused)"
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
  <Notifier :noti="noti" />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useImageStore } from "@/stores/imageStore";
import { loadImageFile } from "@/composables/useImageLoader";
import { NotificationData } from "@/@types/types";
import Notifier from "@/components/Notifier.vue";

import Zoomer from "./views/Zoomer.vue";
import { useZoomerStore } from "./stores/zoomerStore";

export default defineComponent({
  name: "ZoomerManager",
  components: { Zoomer, Notifier },
  setup() {
    const imageStore = useImageStore();
    const zoomStore = useZoomerStore();
    const { isZooming, isPaused } = storeToRefs(zoomStore);
    const noti = ref<NotificationData>({
      message: "",
      level: "info",
      displayType: "message",
      timestamp: null,
    });
    const zoomer = ref<InstanceType<typeof Zoomer> | null>(null);
    const currentId = ref<string | null>(null);

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
        handleNotify(status);
        handleShowFullImage();
      } catch (err) {
        handleNotify("error");
      }
    };

    const startZoomOut = () => {
      zoomer.value.startZoomOut();
    };
    const handlePauseOrResumeZoomOut = () => {
      if (isPaused.value) {
        zoomer.value.resumeZoomOut();
      } else {
        zoomer.value.pauseZoomOut();
      }
    };
    const handleShowFullImage = () => {
      zoomer.value.showFullImage();
    };

    const handleNotify = (status: string) => {
      switch (status) {
        case "added":
          noti.value = {
            message: "圖片已載入",
            level: "success",
            displayType: "message",
            timestamp: Date.now(),
          };
          break;
        case "updated":
          noti.value = {
            message: "相同圖片已存在",
            level: "warning",
            displayType: "message",
            timestamp: Date.now(),
          };
          break;
        case "error":
          noti.value = {
            message: "載入圖片失敗",
            level: "error",
            displayType: "message",
            timestamp: Date.now(),
          };
          break;
        default:
          noti.value = {
            message: "未知狀態",
            level: "warning",
            displayType: "message",
            timestamp: Date.now(),
          };
      }
    };

    return {
      noti,
      zoomer,
      isZooming,
      isPaused,
      startZoomOut,
      handlePauseOrResumeZoomOut,
      handleShowFullImage,
      currentId,
      onFileChange,
      hasSelection,
    };
  },
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
