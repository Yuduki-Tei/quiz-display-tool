<template>
  <div>
    <div v-if="imageState.image">
      <div class="canvas-container">
        <canvas
          ref="mainCanvas"
          :width="imageState.displayWidth"
          :height="imageState.displayHeight"
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
import { defineComponent, ref, watch, PropType } from 'vue';
import { useRectSelection } from './hooks/useRectSelection';
import { startZoomOut as zoomOutUtil, showFullImage } from './hooks/zoomOutUtil';
import type { CanvasImageContext } from './types/ImageZoomerTypes';
import type { ImageState } from '../ImageProvider.vue';

export default defineComponent({
  name: 'ImageZoomerManager',
  props: {
    imageState: {
      type: Object as PropType<ImageState>,
      required: true
    }
  },
  setup(props) {
    const mainCanvas = ref<HTMLCanvasElement | null>(null);
    const isZooming = ref(false);
    const isPaused = ref(false);
    const aspectRatio = ref(16/9);
    watch(
      [() => props.imageState.displayWidth, () => props.imageState.displayHeight],
      ([w, h]) => {
        if (w > 0 && h > 0) aspectRatio.value = w / h;
      },
      { immediate: true }
    );
    const { rect: selection, onMouseDown, onMouseMove, onMouseUp, drawSelection } = useRectSelection(aspectRatio);

    // 共通のcontext生成関数
    function getCanvasContext(): CanvasImageContext | null {
      if (!mainCanvas.value || !props.imageState.image) return null;
      return {
        image: props.imageState.image,
        canvas: mainCanvas.value,
        naturalWidth: props.imageState.naturalWidth,
        naturalHeight: props.imageState.naturalHeight,
        displayWidth: props.imageState.displayWidth,
        displayHeight: props.imageState.displayHeight,
        selection: { ...selection }
      };
    }

    // canvas rendering
    const drawMain = () => {
      if (!mainCanvas.value || !props.imageState.image) return;
      const ctx = mainCanvas.value.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, props.imageState.displayWidth, props.imageState.displayHeight);
      ctx.drawImage(props.imageState.image, 0, 0, props.imageState.displayWidth, props.imageState.displayHeight);
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
    watch([
      () => props.imageState.image,
      () => selection.x, () => selection.y, () => selection.w, () => selection.h
    ], () => {
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
      isZooming,
      isPaused,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      startZoomOut,
      handlePauseOrResumeZoomOut,
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
