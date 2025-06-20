<template>
  <div>
    <div v-for="(item, idx) in queue" :key="idx" :style="{margin: '4px', display: 'inline-block'}">
      <button :disabled="idx === currentIndex" @click="$emit('select', idx)">#{{ idx + 1 }}</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import type { QueueItem } from '../types';
const props = defineProps<{ queue: QueueItem[]; currentIndex: number }>();
const emit = defineEmits(['select']);
</script>
