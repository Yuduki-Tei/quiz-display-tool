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
        style="position: absolute"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";
import { useImageStore } from "@/stores/imageStore";

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

const mainCanvas = ref<HTMLCanvasElement | null>(null);
const panelCanvas = ref<HTMLCanvasElement | null>(null);
const context = computed(() => {
  const imageData = imageStore.getData(props.id);
  return {
    ...imageData,
  };
});

const drawImage = () => {
  if (!mainCanvas.value || !context.value) return;
  const ctx = mainCanvas.value.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(
    context.value.renderable,
    0,
    0,
    context.value.displayWidth,
    context.value.displayHeight
  );
};

/**
 *
 * @param {number} x
 * @param {number} y
 */
function drawGrid(x: number, y: number) {
  if (!panelCanvas.value || !context.value) return;
  const ctx = panelCanvas.value.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, context.value.displayWidth, context.value.displayHeight);
  const w = context.value.displayWidth / x;
  const h = context.value.displayHeight / y;
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.lineWidth = 1;
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      ctx.fillRect(i * w, j * h, w, h);
      ctx.strokeRect(i * w, j * h, w, h);
    }
  }
}

watch(
  () => props.id,
  (newId) => {
    if (newId) {
      nextTick(() => {
        drawImage();
        drawGrid(5, 5);
      });
    }
  },
  { immediate: true }
);
</script>
