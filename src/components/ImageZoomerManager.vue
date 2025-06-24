<template>
  <div>
    <input type="file" accept="image/*" @change="onFileChange" />
    <div v-if="imgLoaded">
      <div class="canvas-container">
        <canvas
          ref="mainCanvas"
          :width="displayWidth"
          :height="displayHeight"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
        ></canvas>
      </div>
      <button @click="startZoomOut">Zoom Out</button>
      <button @click="handlePauseOrResumeZoomOut" :disabled="!isZooming">
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>
      <button @click="handleShowFullImage">Show Full Image</button>
    </div>
    <div v-else style="margin:1em;color:#888;">Please select an image and select a region.</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, nextTick, watch } from 'vue';
import { loadImageFile } from './loadImageUtil';
import { useRectSelection } from './useRectSelection';
import { startZoomOut as zoomOutUtil, showFullImage, stopZoomOut } from './zoomOutUtil';
import type { CanvasImageContext } from './ImageZoomerTypes';

export default defineComponent({
  name: 'ImageZoomerManager',
  setup() {
    const mainCanvas = ref<HTMLCanvasElement | null>(null);
    const image = ref<HTMLImageElement | null>(null);
    const displayWidth = ref(0);
    const displayHeight = ref(0);
    const naturalWidth = ref(0);
    const naturalHeight = ref(0);
    const imgLoaded = ref(false);
    const isZooming = ref(false);
    const isPaused = ref(false);
    const aspectRatio = ref(16 / 9);
    const { rect: selection, onMouseDown, onMouseMove, onMouseUp, drawSelection } = useRectSelection(aspectRatio.value);

    // 共通のcontext生成関数
    function getCanvasContext(): CanvasImageContext | null {
      if (!mainCanvas.value || !image.value) return null;
      return {
        image: image.value,
        canvas: mainCanvas.value,
        naturalWidth: naturalWidth.value,
        naturalHeight: naturalHeight.value,
        displayWidth: displayWidth.value,
        displayHeight: displayHeight.value,
        selection: { ...selection }
      };
    }

    // file choosing
    const onFileChange = async (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || !files[0]) return;
      const file = files[0];
      const maxW = 1280, maxH = 720;
      try {
        const result = await loadImageFile(file, maxW, maxH);
        image.value = result.image;
        displayWidth.value = result.width;
        displayHeight.value = result.height;
        naturalWidth.value = result.naturalWidth;
        naturalHeight.value = result.naturalHeight;
        imgLoaded.value = true;
        await nextTick();
        drawMain();
      } catch (err) {
        imgLoaded.value = false;
      }
    };

    // canvas rendering
    const drawMain = () => {
      if (!mainCanvas.value || !image.value) return;
      const ctx = mainCanvas.value.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, displayWidth.value, displayHeight.value);
      ctx.drawImage(image.value, 0, 0, displayWidth.value, displayHeight.value);
      if (!isZooming.value) {
        drawSelection(mainCanvas.value);
      }
    };

    // event handler
    const handleMouseDown = (e: MouseEvent) => {
      if (isZooming.value) return;
      onMouseDown(e, mainCanvas.value!);
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (isZooming.value) return;
      onMouseMove(e, mainCanvas.value!);
      drawMain();
    };
    const handleMouseUp = () => {
      if (isZooming.value) return;
      onMouseUp();
      drawMain();
    };

    // zoomout animation
    let zoomController: ReturnType<typeof zoomOutUtil> | null = null;
    const startZoomOut = () => {
      const ctx = getCanvasContext();
      if (!ctx) return;
      isZooming.value = true;
      isPaused.value = false;
      zoomController = zoomOutUtil({
        ...ctx,
        duration: 10000,
        onFinish: () => {
          isZooming.value = false;
          isPaused.value = false;
          zoomController = null;
          showFullImage(ctx);
        }
      });
    };

    // pause/resume toggle
    const handlePauseOrResumeZoomOut = () => {
      if (!zoomController) return;
      if (isPaused.value) {
        zoomController.resume();
        isPaused.value = false;
      } else {
        zoomController.pause();
        isPaused.value = true;
      }
    };

    // rerender the canvas when selection changes
    watch([image, () => selection.x, () => selection.y, () => selection.w, () => selection.h], () => {
      drawMain();
    });

    // show full image without zooming
    const handleShowFullImage = () => {
      const ctx = getCanvasContext();
      if (!ctx) return;
      showFullImage(ctx);
    };

    return {
      mainCanvas,
      displayWidth,
      displayHeight,
      imgLoaded,
      isZooming,
      isPaused,
      handlePauseOrResumeZoomOut,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      onFileChange,
      startZoomOut,
      handleShowFullImage
    };
  }
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
</style>
