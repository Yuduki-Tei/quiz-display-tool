<template>
  <div class="image-zoomer">
    <div class="canvas-container" ref="canvasContainer">
      <canvas
        ref="mainCanvas"
        :width="context.displayWidth"
        :height="context.displayHeight"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
      ></canvas>
      <canvas
        ref="zoomCanvas"
        v-show="showZoomCanvas"
        :width="context.displayWidth"
        :height="context.displayHeight"
        class="zoom-canvas"
      ></canvas>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import { useZoomerStore } from "../stores/zoomerStore";
import { useImageStore } from "@/stores/imageStore";
import { useRectSelection } from "../composables/useRectSelection";
import {
  startZoomOut as zoomOutUtil,
  showFullImage as showFullImageUtil,
} from "../composables/zoomOutUtil";
import { storeToRefs } from "pinia";
import type { SelectionRect } from "../types/ZoomerTypes";

const props = withDefaults(
  defineProps<{
    id: string | null;
  }>(),
  {
    id: null,
  }
);

const zoomerStore = useZoomerStore();
const imageStore = useImageStore();
const { isZooming } = storeToRefs(zoomerStore);

const mainCanvas = ref<HTMLCanvasElement | null>(null);
const zoomCanvas = ref<HTMLCanvasElement | null>(null);
const showZoomCanvas = ref(false);

const context: any = computed(() => {
  if (!props.id) return {};
  const imageData = imageStore.getData(props.id);
  const zoomerCtx = zoomerStore.getContext(props.id);
  return {
    ...imageData,
    ...zoomerCtx,
  };
});

const aspect = computed(
  () => context.value?.displayWidth / context.value?.displayHeight || 1
);
const setRect = (rect: SelectionRect) => {
  if (props.id) {
    zoomerStore.setRect(props.id, rect);
  }
};
const { isDragging, onMouseDown, onMouseMove, onMouseUp, drawSelection } =
  useRectSelection(aspect, context, setRect);

const drawSelect = () => {
  if (
    context.value.selection &&
    context.value.selection.w !== 0 &&
    context.value.selection.h !== 0
  ) {
    drawSelection(mainCanvas.value);
  }
};

const drawImage = () => {
  if (!mainCanvas.value || !context.value?.image) return;
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
  drawSelect();
};

const handleMouseDown = (e: MouseEvent) => {
  if (isZooming.value || !mainCanvas.value) return;
  onMouseDown(e, mainCanvas.value);
};

const handleMouseMove = (e: MouseEvent) => {
  if (isZooming.value || !mainCanvas.value) return;
  onMouseMove(e, mainCanvas.value);
  if (isDragging.value) {
    drawImage();
  }
};

const handleMouseUp = () => {
  onMouseUp();
  drawImage();
};

let zoomController: ReturnType<typeof zoomOutUtil> | null = null;

const startZoomOut = () => {
  if (!zoomCanvas.value || !context.value?.image) return;
  showZoomCanvas.value = true;
  zoomController = zoomOutUtil({
    ...context.value,
    canvas: zoomCanvas.value,
    onFinish: () => {
      showZoomCanvas.value = false;
    },
  });
};

const pauseZoomOut = () => {
  zoomController?.pause();
};

const resumeZoomOut = () => {
  zoomController?.resume();
};

const showFullImage = () => {
  if (!mainCanvas.value || !context.value?.image) return;
  showFullImageUtil({
    ...context.value,
    canvas: mainCanvas.value,
  });
  drawSelect();

  if (showZoomCanvas.value) {
    zoomController = null;
    showZoomCanvas.value = false;
  }
};
defineExpose({
  startZoomOut,
  pauseZoomOut,
  resumeZoomOut,
  showFullImage,
});

watch(
  () => props.id,
  (newId) => {
    if (newId) {
      nextTick(() => {
        showFullImage();
      });
    }
  },
  { immediate: true }
);
</script>

<style src="../Zoomer.css"></style>
