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
import { storeToRefs } from 'pinia';
import { useImageZoomerStore } from '../stores/imageZoomerStore';
import { useRectSelection } from '../composables/useRectSelection';
import { startZoomOut as zoomOutUtil, showFullImage as showFullImageUtil } from '../composables/zoomOutUtil';

export default defineComponent({
  name: 'ImageZoomer',
  emits: [
    'zoom-start',
    'zoom-finish',
    'zoom-pause',
    'zoom-resume',
    'show-full-image',
    'update:selection'
  ],
  setup(_, { emit, expose }) {
    const imageStore = useImageZoomerStore();
    const { context } = storeToRefs(imageStore);
    const mainCanvas = ref<HTMLCanvasElement | null>(null);
    const zoomCanvas = ref<HTMLCanvasElement | null>(null);
    const showZoomCanvas = ref(false);
    const aspect = ref(context.value?.displayWidth / context.value?.displayHeight || 1);
    const { isDragging, onMouseDown, onMouseMove, onMouseUp, drawSelection } = useRectSelection(aspect);

    // Draw the image to the main canvas
    const drawImage = () => {
      if (!mainCanvas.value || !context.value?.image) return;
      const ctx = mainCanvas.value.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, context.value.displayWidth, context.value.displayHeight);
      ctx.drawImage(
        context.value.image,
        0, 0, context.value.displayWidth, context.value.displayHeight
      );
      // Draw selection rectangle
      if (context.value.selection.w !== 0 && context.value.selection.h !== 0) {
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
      emit('update:selection', { ...context.value?.selection });
      drawImage();
    };

    let zoomController: ReturnType<typeof zoomOutUtil> | null = null;

    // Animate zoom out from selection to full image
    const startZoomOut = () => {
      if (!zoomCanvas.value || !context.value?.image) return;
      showZoomCanvas.value = true;
      emit('zoom-start');
      zoomController = zoomOutUtil({
        ...context.value,
        canvas: zoomCanvas.value,
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
      if (!mainCanvas.value || !context.value?.image) return;
      showFullImageUtil({
        ...context.value,
        canvas: mainCanvas.value
      });
      emit('show-full-image');
      showZoomCanvas.value = false;
      zoomController = null;
    };

    watch(
      () => context.value,
      (newCtx) => {
        if (!newCtx) return;
        aspect.value = newCtx.displayWidth / newCtx.displayHeight || 1;
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
      handleMouseUp,
      context
    };
  }
});
</script>

<style src="../ImageZoomer.css"></style>
