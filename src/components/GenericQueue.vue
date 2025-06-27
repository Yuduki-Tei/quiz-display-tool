<template>
  <div class="queue-panel">
    <span v-if="queue.length > 0">{{ currentIndex + 1 }} / {{ queue.length }}</span>
    <span v-else>Queue is empty</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'GenericQueue',
  emits: ['update:current', 'update:queue'],
  setup(_, { emit, expose }) {
    const queue = ref<any[]>([]);
    const currentIndex = ref(-1);

    const addToQueue = (addItem: any) => {
      queue.value.push(addItem);
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
    function imageToBase64(img: HTMLImageElement): Promise<string> {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No canvas context');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      });
    }
    function base64ToImage(base64: string): Promise<HTMLImageElement> {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = base64;
      });
    }

    const exportQueue = async () => {
      const arr = await Promise.all(queue.value.map(async (item) => {
        const base64 = await imageToBase64(item.image);
        return {
          ...item,
          image: base64
        };
      }));
      const dataStr = JSON.stringify(arr, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'queue.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    const importQueue = async (data: any) => {
      try {
        const arr = typeof data === 'string' ? JSON.parse(data) : data;
        if (Array.isArray(arr)) {
          const restored = await Promise.all(arr.map(async (item) => {
            const img = await base64ToImage(item.image);
            return {
              ...item,
              image: img
            };
          }));
          queue.value = restored;
          currentIndex.value = restored.length > 0 ? 0 : -1;
          emit('update:current', queue.value[currentIndex.value]);
        }
      } catch (e) {
        alert('Invalid queue data');
      }
    };

    // 外部可 watch queue 變化
    watch(queue, (val) => emit('update:queue', val));

    expose({
      addToQueue,
      goNext,
      goPrev,
      exportQueue,
      importQueue,
      queue,
      currentIndex
    });

    return {
      queue,
      currentIndex
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
