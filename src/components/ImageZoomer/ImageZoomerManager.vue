<template>
  <div>
    <div v-if="imageState.image">
      <ImageZoomer
        ref="imageZoomer"
        :context="currentContext"
        :animationDuration="10000"
        @update:selection="onSelectionUpdate"
        @zoom-start="isZooming = true; isPaused = false"
        @zoom-finish="isZooming = false; isPaused = false"
        @zoom-pause="isPaused = true"
        @zoom-resume="isPaused = false"
        @show-full-image="isZooming = false; isPaused = false"
      />
      <button @click="startZoomOut">Zoom Out</button>
      <button @click="handlePauseOrResumeZoomOut" :disabled="!isZooming">
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>
      <button @click="handleShowFullImage">Show Full Image</button>
      <GenericQueue
        :add-item="currentContext"
        @update:current="onQueueCurrentChange"
        @update:queue="onQueueChange"
      />
    </div>
    <div v-else style="margin:1em;color:#888;">Please select an image and select a region.</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, PropType } from 'vue';
import ImageZoomer from './views/ImageZoomer.vue';
import GenericQueue from '../GenericQueue.vue';
import type { ImageDisplayContext } from './types/ImageZoomerTypes';
import type { ImageState } from '../ImageProvider.vue';

export default defineComponent({
  name: 'ImageZoomerManager',
  components: { ImageZoomer, GenericQueue },
  props: {
    imageState: {
      type: Object as PropType<ImageState>,
      required: true
    }
  },
  setup(props) {
    const imageZoomer = ref();
    const isZooming = ref(false);
    const isPaused = ref(false);
    const aspectRatio = ref(1);
    watch(
      [() => props.imageState.displayWidth, () => props.imageState.displayHeight],
      ([w, h]) => {
        if (w > 0 && h > 0) aspectRatio.value = w / h;
      },
      { immediate: true }
    );
    const selection = ref({ x: 0, y: 0, w: 0, h: 0 });
    const onSelectionUpdate = (rect: any) => {
      selection.value = rect;
    };
    // context
    const currentContext = computed<ImageDisplayContext>(() => {
      if (!props.imageState.image) return null as any;
      return {
        image: props.imageState.image,
        naturalWidth: props.imageState.naturalWidth,
        naturalHeight: props.imageState.naturalHeight,
        displayWidth: props.imageState.displayWidth,
        displayHeight: props.imageState.displayHeight,
        selection: selection.value
      };
    });

    const onQueueCurrentChange = (ctx: ImageDisplayContext) => {
      console.log('Current context changed:', ctx);
      if (!ctx) return;
      props.imageState.image = ctx.image;
      props.imageState.naturalWidth = ctx.naturalWidth;
      props.imageState.naturalHeight = ctx.naturalHeight;
      props.imageState.displayWidth = ctx.displayWidth;
      props.imageState.displayHeight = ctx.displayHeight;
      selection.value = { ...ctx.selection };
    };
    const onQueueChange = (queue: ImageDisplayContext[]) => {
      // TODO: 需要時可同步 queue 狀態到外部
      // console.log('Queue changed:', queue);
    };

    // zoomout animation
    const startZoomOut = () => {
      imageZoomer.value?.startZoomOut();
    };
    const handlePauseOrResumeZoomOut = () => {
      if (isPaused.value) {
        imageZoomer.value?.resumeZoomOut();
      } else {
        imageZoomer.value?.pauseZoomOut();
      }
    };
    const handleShowFullImage = () => {
      imageZoomer.value?.showFullImage();
    };

    return {
      imageZoomer,
      isZooming,
      isPaused,
      startZoomOut,
      handlePauseOrResumeZoomOut,
      handleShowFullImage,
      currentContext,
      onSelectionUpdate,
      onQueueCurrentChange,
      onQueueChange
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
