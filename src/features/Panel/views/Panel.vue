<template>
  <div class="display-root">
    <div class="display-canvas-container" ref="canvasContainer">
      <canvas
        ref="mainCanvas"
        :width="context.displayWidth"
        :height="context.displayHeight"
      ></canvas>
      <canvas ref="panelCanvas" class="panelCanvas"></canvas>
    </div>
    <slot></slot>
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
  console.log("Drawing image on main canvas", context.value);
  if (!ctx) return;
  ctx.drawImage(
    context.value.renderable,
    0,
    0,
    context.value.displayWidth,
    context.value.displayHeight
  );
};
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
</script>
