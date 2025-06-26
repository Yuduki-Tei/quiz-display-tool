<template>
  <div class="queue-panel">
    <div>
      <button @click="addToQueue" :disabled="!canAdd">Add to Queue</button>
      <button @click="goPrev" :disabled="queue.length === 0 || currentIndex <= 0">Prev</button>
      <button @click="goNext" :disabled="queue.length === 0 || currentIndex >= queue.length - 1">Next</button>
      <span v-if="queue.length > 0">{{ currentIndex + 1 }} / {{ queue.length }}</span>
      <span v-else>Queue is empty</span>
    </div>
    <!-- 預留未來匯出/載入功能 -->
    <!-- <button @click="exportQueue">Export</button>
    <button @click="importQueue">Import</button> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType, computed } from 'vue';

export default defineComponent({
  name: 'GenericQueue',
  props: {
    addItem: {
      type: Object as PropType<any>,
      required: false
    }
  },
  emits: ['update:current', 'update:queue'],
  setup(props, { emit }) {
    const queue = ref<any[]>([]);
    const currentIndex = ref(-1);

    const canAdd = computed(() => !!props.addItem);

    const addToQueue = () => {
      console.log('Adding item to queue:', props.addItem);
      if (!props.addItem) return;
      queue.value.push(props.addItem);
      currentIndex.value = queue.value.length - 1;
      emit('update:queue', queue.value);
      emit('update:current', queue.value[currentIndex.value]);
    };
    const goNext = () => {
      if (queue.value.length === 0) return;
      if (currentIndex.value < queue.value.length - 1) {
        currentIndex.value++;
        emit('update:current', queue.value[currentIndex.value]);
      }
    };
    const goPrev = () => {
      if (queue.value.length === 0) return;
      if (currentIndex.value > 0) {
        currentIndex.value--;
        emit('update:current', queue.value[currentIndex.value]);
      }
    };
    // 預留 export/import
    const exportQueue = () => {
      // TODO: 將 queue.value 輸出為 JSON
    };
    const importQueue = (data: any) => {
      // TODO: 從 JSON 載入 queue
    };

    // 外部可 watch queue 變化
    watch(queue, (val) => emit('update:queue', val));

    return {
      queue,
      currentIndex,
      canAdd,
      addToQueue,
      goNext,
      goPrev
    };
  }
});
</script>

<style scoped>
.queue-panel {
  margin: 1em 0;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style>
