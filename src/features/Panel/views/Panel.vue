<template>
  <div class="display-root">
    <div class="display-canvas-container" ref="canvasContainer">
      <canvas
        ref="mainCanvas"
        :width="context.displayWidth"
        :height="context.displayHeight"
        style="pointer-events: none"
      ></canvas>
      <canvas
        ref="panelCanvas"
        class="panelCanvas"
        :width="context.displayWidth"
        :height="context.displayHeight"
        style="position: absolute; cursor: pointer"
        @click="onPanelClick"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";
import { useImageStore } from "@/stores/imageStore";
import { drawGrid, handlePanelClick } from "../composables/panelUtil";
import { usePanelStore } from "../stores/panelStore";
const props = withDefaults(
  defineProps<{
    id?: string | null;
    displayMode?: string;
  }>(),
  {
    id: null,
    displayMode: "manual",
  }
);

const imageStore = useImageStore();
const panelStore = usePanelStore();

const mainCanvas = ref<HTMLCanvasElement | null>(null);
const panelCanvas = ref<HTMLCanvasElement | null>(null);
const context: any = computed(() => {
  if (!props.id) return {};
  const imageData = imageStore.getData(props.id);
  const panelContext = panelStore.getContext(props.id);
  return {
    ...imageData,
    ...panelContext,
  };
});

const onPanelClick = (e: MouseEvent) => {
  if (!panelCanvas.value || !context.value || panelStore.isRevealing) return;
  handlePanelClick(e, panelCanvas, context);
  drawGrid(panelCanvas, context);
};

// Auto reveal methods
const startAutoReveal = () => {
  if (!props.id) return false;

  const panelContext = panelStore.getContext(props.id);
  if (!panelContext || !panelStore.canReveal(panelContext)) return false;

  panelStore.startAutoReveal(props.id, panelContext.duration || 5000);
  return true;
};

const pauseAutoReveal = () => {
  panelStore.setPaused(true);
  return true;
};

const resumeAutoReveal = () => {
  panelStore.setPaused(false);
  return true;
};

const stopAutoReveal = () => {
  panelStore.stopAutoReveal();
  return true;
};

// Export methods to be used by parent component
defineExpose({
  startAutoReveal,
  pauseAutoReveal,
  resumeAutoReveal,
  stopAutoReveal,
});
watch(
  () => props.id,
  (newId) => {
    if (newId) {
      nextTick(() => {
        drawImage();
        drawGrid(panelCanvas, context);
      });
    }
  },
  { immediate: true }
);

watch(
  () => context.value?.revealed,
  () => {
    drawGrid(panelCanvas, context);
  },
  { deep: true }
);

const drawImage = () => {
  if (!mainCanvas.value || !context.value) return;
  const ctx = mainCanvas.value.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, context.value.displayWidth, context.value.displayHeight);
  ctx.drawImage(
    context.value.renderable,
    0,
    0,
    context.value.displayWidth,
    context.value.displayHeight
  );
};
</script>
