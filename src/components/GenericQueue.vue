<template>
  <div class="queue-panel">
    <span v-if="qLength > 0">{{ currentIndex + 1 }} / {{ qLength }}</span>
    <span v-else>Queue is empty</span>
  </div>
</template>

<script lang="ts">
import { useImageStore } from "@/stores/imageStore";
import { useZoomerStore } from "@/features/Zoomer/stores/zoomerStore";
import { storeToRefs } from "pinia";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "GenericQueue",
  setup(expose) {
    const imageStore = useImageStore();
    const zoomStore = useZoomerStore();
    const { currentIndex } = storeToRefs(imageStore);
    const qLength = computed(() => imageStore.contexts.length);

    function imageToBase64(img: HTMLImageElement): Promise<string> {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("No canvas context");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
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
      const arr = await Promise.all(
        imageStore.contexts.map(async (item) => {
          const base64 = await imageToBase64(item.image);
          return {
            ...item,
            image: base64,
          };
        })
      );
      const dataStr = JSON.stringify(arr, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "queue.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    const importQueue = async (data: any) => {
      try {
        const arr = typeof data === "string" ? JSON.parse(data) : data;
        if (Array.isArray(arr)) {
          const restored = await Promise.all(
            arr.map(async (item) => {
              const img = await base64ToImage(item.image);
              return {
                ...item,
                image: img,
              };
            })
          );
        }
      } catch (e) {
        alert("Invalid queue data");
      }
    };

    expose({
      exportQueue,
      importQueue,
    });

    return {
      currentIndex,
      qLength,
    };
  },
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
