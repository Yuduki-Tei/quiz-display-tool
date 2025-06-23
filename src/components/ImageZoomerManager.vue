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
    </div>
    <div v-else style="margin:1em;color:#888;">Please select an image and select a region.</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, nextTick, watch } from 'vue';
import { loadImageFile } from './loadImageUtil';
import { useRectSelection } from './useRectSelection';
import { startZoomOut as zoomOutUtil } from './zoomOutUtil';
import type { SelectionRect } from './ImageZoomerTypes';

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
    const aspectRatio = ref(16 / 9);
    const { rect: selection, onMouseDown, onMouseMove, onMouseUp, drawSelection } = useRectSelection(aspectRatio.value);

    // ファイル選択
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

    // canvas描画
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

    // イベントハンドラ
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

    // ズームアウトアニメーション
    const startZoomOut = () => {
      if (!mainCanvas.value || !image.value) return;
      isZooming.value = true;
      zoomOutUtil({
        image: image.value,
        canvas: mainCanvas.value,
        naturalWidth: naturalWidth.value,
        naturalHeight: naturalHeight.value,
        displayWidth: displayWidth.value,
        displayHeight: displayHeight.value,
        selection: { ...selection },
        duration: 10000,
        onFinish: () => {
          isZooming.value = false;
          drawMain();
        }
      });
    };

    // ファイルや選択範囲が変わったらcanvas再描画
    watch([image, () => selection.x, () => selection.y, () => selection.w, () => selection.h], () => {
      drawMain();
    });

    return {
      mainCanvas,
      displayWidth,
      displayHeight,
      imgLoaded,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      onFileChange,
      startZoomOut
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
