<template>
  <div id="controls">
    <label for="imageLoader" class="file-label">Choose Picture</label>
    <input type="file" id="imageLoader" accept="image/*" multiple class="file-input-hidden" @change="onImageChange">
    <button @click="$emit('add-to-queue', dragRect)">Queue</button>
    <button @click="$emit('start')">Start</button>
    <button @click="$emit('pause')">Pause</button>
    <button @click="$emit('next')">Next</button>
    <label for="speedInput">Speed (seconds):</label>
    <input type="number" id="speedInput" :value="speed" min="1" max="100" step="1" @input="onSpeedInput">
    <button @click="$emit('save-queue')">Save Queue</button>
    <label for="loadQueueInput" class="file-label">Load Queue</label>
    <input type="file" id="loadQueueInput" accept=".json,.txt" class="file-input-hidden" @change="onLoadQueue">
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps<{ speed: number }>();
const emit = defineEmits([
  'speed-change', 'start', 'pause', 'next', 'add-to-queue', 'save-queue', 'load-queue'
]);

function onSpeedInput(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  emit('speed-change', val);
}
function onImageChange(e: Event) {
}
function onLoadQueue(e: Event) {
}
</script>

<style scoped>
#controls {
  text-align: center;
  margin: 10px;
}
button, .file-label {
  height: 30px;
  padding: 0 12px;
  font-size: 14px;
  margin: 5px;
  cursor: pointer;
  border: 1px solid #ccc;
  background-color: #eee;
  display: inline-block;
  text-align: center;
  line-height: 30px;
  vertical-align: middle;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}
.file-input-hidden {
  display: none;
}
input[type="number"] {
  height: 30px;
  font-size: 14px;
  margin: 5px;
  padding: 0 10px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  text-align: center;
}
</style>
