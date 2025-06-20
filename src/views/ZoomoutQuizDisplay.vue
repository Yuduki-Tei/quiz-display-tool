<template>
  <div>
    <ControlsPanel
      :speed="speed"
      @speed-change="onSpeedChange"
      @start="onStart"
      @pause="onPause"
      @next="onNext"
      @add-to-queue="onAddToQueue"
      @save-queue="onSaveQueue"
      @load-queue="onLoadQueue"
    />
    <CanvasDisplay
      :queue-item="currentQueueItem"
      :mode="displayMode"
      :speed="speed"
      @drag-complete="onDragComplete"
      @animation-end="onAnimationEnd"
    />
    <QueueManager
      :queue="queue"
      :current-index="currentIndex"
      @select="onSelectQueueItem"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import ControlsPanel from '../components/ControlsPanel.vue';
import CanvasDisplay from '../components/CanvasDisplay.vue';
import QueueManager from '../components/QueueManager.vue';
import type { QueueItem } from '../types';

const queue = ref<QueueItem[]>([]);
const currentIndex = ref(-1);
const speed = ref(30);
const displayMode = ref('zoomout'); 

const currentQueueItem = computed(() =>
  currentIndex.value >= 0 ? queue.value[currentIndex.value] : null
);

function onSpeedChange(val: number) {
  speed.value = val;
}
function onStart() {}
function onPause() {}
function onNext() {}
function onAddToQueue(item: QueueItem) {
  queue.value.push(item);
}
function onSaveQueue() {}
function onLoadQueue(newQueue: QueueItem[]) {
  queue.value = newQueue;
  currentIndex.value = newQueue.length > 0 ? 0 : -1;
}
function onSelectQueueItem(idx: number) {
  currentIndex.value = idx;
}
function onDragComplete(item: QueueItem) {
}
function onAnimationEnd() {
}
</script>
