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

<script lang="ts">
import { defineComponent, ref, onMounted, watch, nextTick } from 'vue';
import { useRectSelection } from '../composables/useRectSelection';
import { startZoomOut as zoomOutUtil, showFullImage as showFullImageUtil } from '../composables/zoomOutUtil';
import type { ImageZoomerContext } from '../types/ImageZoomerTypes';

export default defineComponent({
  name: 'ImageZoomer',
  props: {
    context: {
      type: Object as () => ImageZoomerContext,
      required: true
    },
    animationDuration: {
      type: Number,
      default: 10000
    }
  },
  emits: [
    'zoom-start',
    'zoom-finish',
    'zoom-pause',
    'zoom-resume',
    'show-full-image',
    'update:selection'
  ],
  setup(props, { emit, expose }) {
    const mainCanvas = ref<HTMLCanvasElement | null>(null);
    const zoomCanvas = ref<HTMLCanvasElement | null>(null);
    const showZoomCanvas = ref(false);
    const aspect = ref(props.context.displayWidth / props.context.displayHeight || 1);
    const { rect, isDragging, onMouseDown, onMouseMove, onMouseUp, drawSelection } = useRectSelection(aspect);

    // Draw the image to the main canvas
    const drawImage = () => {
      if (!mainCanvas.value || !props.context.image) return;
      const ctx = mainCanvas.value.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, props.context.displayWidth, props.context.displayHeight);
      ctx.drawImage(
        props.context.image,
        0, 0, props.context.displayWidth, props.context.displayHeight
      );
      // Draw selection rectangle
      if (rect.w !== 0 && rect.h !== 0) {
        drawSelection(mainCanvas.value);
      }
    };

    // 框選事件
    const handleMouseDown = (e: MouseEvent) => {
      onMouseDown(e, mainCanvas.value!);
    };
    const handleMouseMove = (e: MouseEvent) => {
      onMouseMove(e, mainCanvas.value!);
      if (isDragging.value) drawImage();
    };
    const handleMouseUp = (e: MouseEvent) => {
      onMouseUp();
      emit('update:selection', { ...rect });
      drawImage();
    };

    let zoomController: ReturnType<typeof zoomOutUtil> | null = null;

    // Animate zoom out from selection to full image
    const startZoomOut = () => {
      if (!zoomCanvas.value || !props.context.image) return;
      showZoomCanvas.value = true;
      emit('zoom-start');
      zoomController = zoomOutUtil({
        ...props.context,
        selection: rect,
        canvas: zoomCanvas.value,
        duration: props.animationDuration,
        onFinish: () => {
          showZoomCanvas.value = false;
          emit('zoom-finish');
        }
      });
    };

    const pauseZoomOut = () => {
      if (zoomController && typeof zoomController.pause === 'function') {
        zoomController.pause();
        emit('zoom-pause');
      }
    };
    const resumeZoomOut = () => {
      if (zoomController && typeof zoomController.resume === 'function') {
        zoomController.resume();
        emit('zoom-resume');
      }
    };
    const showFullImage = () => {
      if (!mainCanvas.value || !props.context.image) return;
      showFullImageUtil({
        ...props.context,
        canvas: mainCanvas.value
      });
      emit('show-full-image');
    };

watch(
  () => props.context,
  (newCtx) => {
    aspect.value = newCtx.displayWidth / newCtx.displayHeight || 1;
    rect.x = newCtx.selection.x;
    rect.y = newCtx.selection.y;
    rect.w = newCtx.selection.w;
    rect.h = newCtx.selection.h;
    nextTick(() => drawImage());
  },
  { deep: true, immediate: true }
);

    onMounted(() => {
      drawImage();
    });

    // expose methods for parent
    expose({
      startZoomOut,
      pauseZoomOut,
      resumeZoomOut,
      showFullImage
    });

    return {
      mainCanvas,
      zoomCanvas,
      showZoomCanvas,
      drawImage,
      startZoomOut,
      pauseZoomOut,
      resumeZoomOut,
      showFullImage,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp
    };
  }
});
</script>

<style src="../ImageZoomer.css"></style>
