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
import { drawGrid, handlePanelClick } from "../composables/clickUtil";
import { usePanelStore } from "../stores/panelStore";
import { PanelCombinedContext } from "../types/PanelTypes";
import {
  startReveal,
  stopReveal,
  pauseReveal,
  resumeReveal,
  revealAll,
  coverAll,
} from "../composables/revealUtil";

const props = withDefaults(
  defineProps<{
    id?: string | null;
    isManualMode?: boolean;
  }>(),
  {
    id: null,
    isManualMode: true,
  }
);

const imageStore = useImageStore();
const panelStore = usePanelStore();

const mainCanvas = ref<HTMLCanvasElement | null>(null);
const panelCanvas = ref<HTMLCanvasElement | null>(null);
const context = computed<PanelCombinedContext | Record<string, never>>(() => {
  if (!props.id) return {};
  const imageData = imageStore.getData(props.id);
  const panelContext = panelStore.getContext(props.id);
  return {
    ...imageData,
    ...panelContext,
  } as PanelCombinedContext;
});

const onPanelClick = (e: MouseEvent) => {
  if (
    !panelCanvas.value ||
    !context.value ||
    panelStore.isAutoRevealing ||
    !props.isManualMode
  )
    return;
  handlePanelClick(e, panelCanvas, context);
  drawGrid(panelCanvas, context);
};

// Auto reveal methods
const startAutoReveal = () => {
  if (!props.id) return false;

  const panelContext = panelStore.getContext(props.id);
  if (!panelContext || !panelStore.canReveal(panelContext)) return false;

  startReveal({
    id: props.id,
    duration: panelContext.duration || 5000,
    onReveal: () => {
      // Redraw grid when a panel is revealed
      drawGrid(panelCanvas, context);
    },
  });
  return true;
};

const pauseAutoReveal = () => {
  pauseReveal();
  return true;
};

const resumeAutoReveal = () => {
  resumeReveal();
  return true;
};

const stopAutoReveal = () => {
  stopReveal();
  return true;
};

const revealAllPanels = () => {
  if (!props.id) return false;

  return revealAll(props.id, () => {
    drawGrid(panelCanvas, context);
  });
};

const coverAllPanels = () => {
  if (!props.id) return false;

  return coverAll(props.id, () => {
    drawGrid(panelCanvas, context);
  });
};

defineExpose({
  startAutoReveal,
  pauseAutoReveal,
  resumeAutoReveal,
  stopAutoReveal,
  revealAllPanels,
  coverAllPanels,
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
  (data) => {
    if (data) {
      drawGrid(panelCanvas, context);
    }
  },
  { deep: true }
);

const drawImage = () => {
  if (!mainCanvas.value || !context.value) return;

  const contextValue = context.value as PanelCombinedContext;
  const ctx = mainCanvas.value.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, contextValue.displayWidth, contextValue.displayHeight);
  ctx.drawImage(
    contextValue.renderable,
    0,
    0,
    contextValue.displayWidth,
    contextValue.displayHeight
  );
};
</script>
