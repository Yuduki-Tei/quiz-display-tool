<template>
  <div class="image-zoomer">
    <input type="file" accept="image/*" @change="onFileChange" />
    <div class="canvas-container" ref="canvasContainer">
      <canvas ref="mainCanvas" :width="canvasWidth" :height="canvasHeight" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp"></canvas>
      <canvas ref="zoomCanvas" v-show="showZoomCanvas" :width="canvasWidth" :height="canvasHeight" class="zoom-canvas"></canvas>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, nextTick } from 'vue';
import { startZoomOut as zoomOutUtil, ZoomOutParams } from './zoomOutUtil';

// Rectangle for drag selection
interface DragRect {
  startX: number;
  startY: number;
  w: number;
  h: number;
}

export default defineComponent({
  name: 'ImageZoomer',
  setup() {
    // Canvas and image refs
    const mainCanvas = ref<HTMLCanvasElement | null>(null);
    const zoomCanvas = ref<HTMLCanvasElement | null>(null);
    const canvasContainer = ref<HTMLDivElement | null>(null);
    const image = ref<HTMLImageElement | null>(null);
    // Displayed canvas size
    const canvasWidth = ref(1280);
    const canvasHeight = ref(720);
    // Animation and state
    const showZoomCanvas = ref(false);
    const isDragging = ref(false);
    const dragRect = reactive<DragRect>({ startX: 0, startY: 0, w: 0, h: 0 });
    const aspectRatio = ref(16 / 9);
    const imgLoaded = ref(false);
    const animationFrame = ref<number | null>(null);
    const animationDuration = 10000; // ms
    // Store original image size for correct cropping
    const imgNaturalWidth = ref(0);
    const imgNaturalHeight = ref(0);

    // Handle image file input and resize to fit canvas
    const onFileChange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || !files[0]) return;
      const img = new window.Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        imgNaturalWidth.value = w;
        imgNaturalHeight.value = h;
        // Scale down to fit max canvas size
        const maxW = 1280, maxH = 720;
        const scale = Math.min(maxW / w, maxH / h, 1);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
        canvasWidth.value = w;
        canvasHeight.value = h;
        image.value = img;
        imgLoaded.value = true;
        aspectRatio.value = w / h;
        nextTick(() => drawImage());
      };
      img.src = URL.createObjectURL(files[0]);
    };

    // Draw the image to the main canvas
    const drawImage = () => {
      if (!mainCanvas.value || !image.value) return;
      const ctx = mainCanvas.value.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
      ctx.drawImage(image.value, 0, 0, canvasWidth.value, canvasHeight.value);
    };

    // Mouse down: start drag selection
    const onMouseDown = (e: MouseEvent) => {
      if (!imgLoaded.value) return;
      const rect = mainCanvas.value!.getBoundingClientRect();
      dragRect.startX = e.clientX - rect.left;
      dragRect.startY = e.clientY - rect.top;
      dragRect.w = 0;
      dragRect.h = 0;
      isDragging.value = true;
    };

    // Mouse move: update drag rectangle, keep aspect ratio
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.value || !imgLoaded.value) return;
      const rect = mainCanvas.value!.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const dx = mx - dragRect.startX;
      const dy = dx / aspectRatio.value;
      dragRect.w = dx;
      dragRect.h = dy;
      drawImage();
      drawSelection();
    };

    // Mouse up: finish drag and start zoom out if selection is big enough
    const onMouseUp = () => {
      if (!isDragging.value) return;
      isDragging.value = false;
      drawImage();
      drawSelection();
      if (Math.abs(dragRect.w) > 10 && Math.abs(dragRect.h) > 10) {
        showZoomCanvas.value = true;
        startZoomOut();
      }
    };

    // Draw the selection rectangle on the main canvas
    const drawSelection = () => {
      if (!mainCanvas.value) return;
      const ctx = mainCanvas.value.getContext('2d');
      if (!ctx) return;
      ctx.save();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(
        dragRect.startX,
        dragRect.startY,
        dragRect.w,
        dragRect.h
      );
      ctx.restore();
    };

    // Animate zoom out from selection to full image
    const startZoomOut = () => {
      if (!zoomCanvas.value || !image.value) return;
      zoomOutUtil({
        image: image.value,
        canvas: zoomCanvas.value,
        naturalWidth: imgNaturalWidth.value,
        naturalHeight: imgNaturalHeight.value,
        displayWidth: canvasWidth.value,
        displayHeight: canvasHeight.value,
        selection: {
          x: dragRect.startX,
          y: dragRect.startY,
          w: dragRect.w,
          h: dragRect.h
        },
        duration: animationDuration,
        onFinish: () => { showZoomCanvas.value = false; }
      });
    };

    // Draw image on mount
    onMounted(() => {
      drawImage();
    });

    return {
      mainCanvas,
      zoomCanvas,
      canvasContainer,
      canvasWidth,
      canvasHeight,
      onFileChange,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      showZoomCanvas
    };
  }
});
</script>

<style src="./ImageZoomer.css"></style>
