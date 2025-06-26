<template>
  <div class="image-zoomer">
    <div class="canvas-container" ref="canvasContainer">
      <canvas
        ref="mainCanvas"
        :width="context.displayWidth"
        :height="context.displayHeight"
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
import { startZoomOut as zoomOutUtil } from '../hooks/zoomOutUtil';
import type { ImageDisplayContext } from '../types/ImageZoomerTypes';

export default defineComponent({
  name: 'ImageZoomer',
  props: {
    context: {
      type: Object as () => ImageDisplayContext,
      required: true
    },
    animationDuration: {
      type: Number,
      default: 10000
    }
  },
  setup(props) {
    const mainCanvas = ref<HTMLCanvasElement | null>(null);
    const zoomCanvas = ref<HTMLCanvasElement | null>(null);
    const showZoomCanvas = ref(false);

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
      ctx.save();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      const sel = props.context.selection;
      ctx.strokeRect(sel.x, sel.y, sel.w, sel.h);
      ctx.restore();
    };

    // Animate zoom out from selection to full image
    const startZoomOut = () => {
      if (!zoomCanvas.value || !props.context.image) return;
      showZoomCanvas.value = true;
      zoomOutUtil({
        ...props.context,
        canvas: zoomCanvas.value,
        duration: props.animationDuration,
        onFinish: () => { showZoomCanvas.value = false; }
      });
    };

    // Watch for context changes and redraw
    watch(() => props.context, () => {
      nextTick(() => drawImage());
    }, { deep: true, immediate: true });

    onMounted(() => {
      drawImage();
    });

    return {
      mainCanvas,
      zoomCanvas,
      showZoomCanvas,
      drawImage,
      startZoomOut
    };
  }
});
</script>

<style src="./ImageZoomer.css"></style>
