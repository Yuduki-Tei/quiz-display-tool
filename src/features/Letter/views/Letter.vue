<template>
  <div class="display-root">
    <div class="display-canvas-container" ref="canvasContainer">
      <canvas
        ref="letterCanvas"
        class="letterCanvas"
        :width="canvasWidth"
        :height="canvasHeight"
        style="position: absolute; cursor: pointer"
        @click="onLetterClick"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from "vue";
import { useTextStore } from "@/stores/imageStore";
import { useLetterStore } from "../stores/letterStore";
import { LetterCombinedContext } from "../types/LetterTypes";
import { drawText, handleLetterClick } from "../composables/clickUtil";

const props = withDefaults(
  defineProps<{
    id?: string | null;
    isManualMode?: boolean;
  }>(),
  {
    id: null,
    isManualMode: true,
  }
);

const textStore = useTextStore();
const letterStore = useLetterStore();

const canvasContainer = ref<HTMLElement | null>(null);
const letterCanvas = ref<HTMLCanvasElement | null>(null);
const canvasWidth = ref<number>(800);
const canvasHeight = ref<number>(600);

const context = computed<LetterCombinedContext | Record<string, never>>(() => {
  if (!props.id) return {};
  const textData = textStore.getData(props.id);
  const letterContext = letterStore.getContext(props.id);
  return {
    ...textData,
    ...letterContext,
  } as LetterCombinedContext;
});

// Calculate canvas dimensions based on container
const updateCanvasDimensions = () => {
  if (!canvasContainer.value) return;
  const rect = canvasContainer.value.getBoundingClientRect();
  canvasWidth.value = rect.width;
  canvasHeight.value = rect.height;
};

// Draw text wrapper
const draw = () => {
  drawText(letterCanvas, context, canvasWidth.value, canvasHeight.value);
};

// Handle click on letter
const onLetterClick = (e: MouseEvent) => {
  if (
    !letterCanvas.value ||
    !context.value ||
    letterStore.isAutoRevealing ||
    !props.isManualMode
  )
    return;

  handleLetterClick(e, letterCanvas, context, canvasWidth.value, canvasHeight.value);
  draw();
};

// Exposed methods for parent component
const startAutoReveal = () => {
  if (!props.id) return false;

  const letterContext = letterStore.getContext(props.id);
  if (!letterContext) return false;

  // TODO: Implement auto reveal logic
  console.log("startAutoReveal");
  return true;
};

const pauseAutoReveal = () => {
  // TODO: Implement pause logic
  console.log("pauseAutoReveal");
  return true;
};

const resumeAutoReveal = () => {
  // TODO: Implement resume logic
  console.log("resumeAutoReveal");
  return true;
};

const stopAutoReveal = () => {
  // TODO: Implement stop logic
  console.log("stopAutoReveal");
  return true;
};

const revealAllLetters = () => {
  if (!props.id) return false;

  letterStore.revealAll(props.id);
  draw();
  return true;
};

const coverAllLetters = () => {
  if (!props.id) return false;

  letterStore.coverAll(props.id);
  draw();
  return true;
};

defineExpose({
  startAutoReveal,
  pauseAutoReveal,
  resumeAutoReveal,
  stopAutoReveal,
  revealAllLetters,
  coverAllLetters,
});

// Watch for changes
watch(
  () => props.id,
  (newId) => {
    if (newId) {
      nextTick(() => {
        updateCanvasDimensions();
        draw();
      });
    }
  },
  { immediate: true }
);

watch(
  () => context.value?.revealed,
  () => {
    draw();
  },
  { deep: true }
);

watch(
  () => context.value?.charsPerRow,
  () => {
    draw();
  }
);

onMounted(() => {
  updateCanvasDimensions();
  draw();

  // Handle window resize
  window.addEventListener("resize", () => {
    updateCanvasDimensions();
    nextTick(() => {
      draw();
    });
  });
});
</script>

<style scoped>
.display-root {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--el-bg-color);
}

.display-canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.letterCanvas {
  background-color: #1a1a1a;
}
</style>
