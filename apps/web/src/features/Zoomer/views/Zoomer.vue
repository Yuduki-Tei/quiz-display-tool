<template>
  <div class="display-root">
    <div class="display-canvas-container" ref="canvasContainer">
      <canvas
        ref="mainCanvas"
        v-show="!isZooming && props.displayMode !== 'none'"
        :width="context.displayWidth"
        :height="context.displayHeight"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
      ></canvas>
      <canvas
        ref="zoomCanvas"
        v-show="isZooming"
        :width="context.displayWidth"
        :height="context.displayHeight"
        class="zoom-canvas"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import { useZoomerStore } from "../stores/zoomerStore";
import { useImageStore } from "@/stores/dataStore";
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
    displayMode?: string;
  }>(),
  {
    id: null,
    displayMode: "full",
  }
);

const zoomerStore = useZoomerStore();
const imageStore = useImageStore();
const { isZooming } = storeToRefs(zoomerStore);

const mainCanvas = ref<HTMLCanvasElement | null>(null);
const zoomCanvas = ref<HTMLCanvasElement | null>(null);
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
  if (!mainCanvas.value || !context.value?.renderable) return;
  const ctx = mainCanvas.value.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, context.value.displayWidth, context.value.displayHeight);
  if (
    props.displayMode === "selection" &&
    context.value.selection &&
    context.value.selection.w &&
    context.value.selection.h
  ) {
    // show selection area
    const sel = context.value.selection;
    const scaleX = context.value.renderable.width / context.value.displayWidth;
    const scaleY =
      context.value.renderable.height / context.value.displayHeight;
    const sourceSelection = {
      x: sel.x * scaleX,
      y: sel.y * scaleY,
      w: sel.w * scaleX,
      h: sel.h * scaleY,
    };
    ctx.drawImage(
      context.value.renderable,
      sourceSelection.x,
      sourceSelection.y,
      sourceSelection.w,
      sourceSelection.h,
      0,
      0,
      context.value.displayWidth,
      context.value.displayHeight
    );
  } else if (props.displayMode === "full" || isZooming.value) {
    // show full image
    showFullImageUtil({
      ...context.value,
      canvas: mainCanvas.value,
    });
    drawSelect();
  }
};

const handleMouseDown = (e: MouseEvent) => {
  if (isZooming.value || !mainCanvas.value || props.displayMode !== "full")
    return;
  onMouseDown(e, mainCanvas.value);
};

const handleMouseMove = (e: MouseEvent) => {
  if (isZooming.value || !mainCanvas.value || props.displayMode !== "full")
    return;
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
  if (!zoomCanvas.value || !context.value?.renderable) return;
  zoomController = zoomOutUtil({
    ...context.value,
    canvas: zoomCanvas.value,
  });
};

const pauseZoomOut = () => {
  zoomController?.pause();
};

const resumeZoomOut = () => {
  zoomController?.resume();
};

const showFullImage = () => {
  if (!mainCanvas.value || !context.value?.renderable) return;
  showFullImageUtil({
    ...context.value,
    canvas: mainCanvas.value,
  });
  drawSelect();

  if (isZooming.value) {
    zoomController = null;
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
        drawImage();
      });
    }
  },
  { immediate: true }
);

watch(
  () => props.displayMode,
  () => {
    drawImage();
  }
);
</script>
