<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, defineProps, defineEmits } from 'vue';
import type { QueueItem } from '../types';

const props = defineProps<{
  queueItem: QueueItem | null;
  mode: string;
  speed: number;
}>();
const emit = defineEmits(['drag-complete', 'animation-end']);

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;

watch(() => props.queueItem, (item) => {
  if (item && canvasRef.value) {
    drawItem(item);
  }
});

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d');
  }
});

function drawItem(item: QueueItem) {
  if (!ctx || !canvasRef.value) return;
  const img = new window.Image();
  img.onload = () => {
    ctx!.clearRect(0, 0, item.canvasWidth, item.canvasHeight);
    ctx!.drawImage(img, 0, 0, item.canvasWidth, item.canvasHeight);
  };
  img.src = item.imgSrc;
}
</script>

<style scoped>
canvas {
  border: 1px solid #000;
  display: block;
  margin: 10px auto;
  cursor: crosshair;
}
</style>
