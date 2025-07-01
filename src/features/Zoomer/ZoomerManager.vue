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
          :disabled="!currentImageContext || (!isZooming && !isPaused)"
        >
          Show Full Image
        </button>
        <!-- <button @click="addToQueue" :disabled="!hasSelection">
          Add to Queue
        </button>
        <button @click="goPrev" :disabled="!canGoPrev">Prev</button>
        <button @click="goNext" :disabled="!canGoNext">Next</button>
        <button @click="handleExportQueue">Export Queue</button>
        <input
          type="file"
          accept="application/json"
          @change="handleImportQueue"
        /> -->
      </div>
    </div>
    <div v-if="currentZoomContext && currentImageContext">
      <Zoomer ref="Zoomer" :id="currentId" />
      <!-- <GenericQueue ref="genericQueue" /> -->
      <div style="margin-top: 1em"></div>
    </div>
    <div v-else style="margin: 1em; color: #888">
      Please select an image and select a region.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useImageStore } from "@/stores/imageStore";
import { useZoomerStore } from "./stores/zoomerStore";
import { loadImageFile } from "@/composables/useImageLoader";
import Zoomer from "./views/Zoomer.vue";

export default defineComponent({
  name: "ZoomerManager",
  components: { Zoomer },
  setup() {
    const imageStore = useImageStore();
    const zoomStore = useZoomerStore();
    const { isZooming, isPaused } = storeToRefs(zoomStore);
    const zoomer = ref();
    // const genericQueue = ref();
    const currentId = ref<string | null>(null);

    const currentZoomContext = computed(() =>
      currentId.value ? zoomStore.getContext(currentId.value) : null
    );
    const currentImageContext = computed(() =>
      currentId.value ? imageStore.getContext(currentId.value) : null
    );
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
        imageStore.addContext(imgData);
        currentId.value = imgData.id;
      } catch (err) {
        alert("Failed to load image: " + (err as Error).message);
      }
    };

    const startZoomOut = () => {
      if (!currentId.value) return;
      zoomer.value?.startZoomOut(currentId.value);
    };
    const handlePauseOrResumeZoomOut = () => {
      if (!currentId.value) return;
      if (isPaused.value) {
        zoomer.value?.resumeZoomOut(currentId.value);
      } else {
        zoomer.value?.pauseZoomOut(currentId.value);
      }
    };
    const handleShowFullImage = () => {
      if (!currentId.value) return;
      zoomer.value?.showFullImage();
    };

    // const handleExportQueue = () => {
    //   genericQueue.value?.exportQueue();
    // };
    // const handleImportQueue = (e: Event) => {
    //   const input = e.target as HTMLInputElement;
    //   if (!input.files || !input.files[0]) return;
    //   const file = input.files[0];
    //   const reader = new FileReader();
    //   reader.onload = (evt) => {
    //     try {
    //       const data = evt.target?.result as string;
    //       genericQueue.value?.importQueue(data);
    //     } catch (err) {
    //       alert("Failed to import queue");
    //     }
    //   };
    //   reader.readAsText(file);
    // };

    // const addToQueue = () => {
    //   if (!currentId.value) return;
    //   const ctx = zoomStore.getContext(currentId.value);
    //   if (ctx) genericQueue.value?.addToQueue(ctx);
    // };
    // const goPrev = () => genericQueue.value?.goPrev();
    // const goNext = () => genericQueue.value?.goNext();
    // const canGoPrev = computed(
    //   () =>
    //     genericQueue.value?.queue?.length > 0 &&
    //     genericQueue.value?.currentIndex > 0
    // );
    // const canGoNext = computed(
    //   () =>
    //     genericQueue.value?.queue?.length > 0 &&
    //     genericQueue.value?.currentIndex < genericQueue.value?.queue.length - 1
    // );

    return {
      zoomer,
      // genericQueue,
      isZooming,
      isPaused,
      startZoomOut,
      handlePauseOrResumeZoomOut,
      handleShowFullImage,
      currentId,
      currentZoomContext,
      currentImageContext,
      // handleExportQueue,
      // handleImportQueue,
      onFileChange,
      // addToQueue,
      // goPrev,
      // goNext,
      // canGoPrev,
      // canGoNext,
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
