<template>
  <div class="data-manager-btns">
    <Button type="primary" icon="DocumentAdd" @click="triggerImport" />
    <Button type="primary" icon="Download" @click="handleExport" />
    <input
      ref="importInput"
      type="file"
      accept=".zip"
      style="display: none"
      @change="handleImport"
    />
  </div>
  <Notifier :status="status" :timestamp="timestamp" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useImageStore } from "@/stores/imageStore";
import { useZoomerStore } from "@/features/Zoomer/stores/zoomerStore";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { loadImageFile } from "@/composables/useImageLoader";
import Button from "@/components/Button.vue";
import Notifier from "@/components/Notifier.vue";
import { generateRandomSelection } from "@/features/Zoomer/composables/zoomOutUtil";

const imageStore = useImageStore();
const zoomerStore = useZoomerStore();
const importInput = ref<HTMLInputElement | null>(null);
const status = ref<string | null>(null);
const timestamp = ref<number | null>(null);
let confirmResolver: ((result: boolean) => void) | null = null;

const triggerImport = () => {
  importInput.value?.click();
};

const notify = (type: string) => {
  status.value = type;
  timestamp.value = Date.now();
};

const showConfirm = (type: string) => {
  status.value = type;
  timestamp.value = Date.now();
  return new Promise<boolean>((resolve) => {
    confirmResolver = resolve;
  });
};

const onConfirm = (result: boolean) => {
  if (confirmResolver) {
    confirmResolver(result);
    confirmResolver = null;
  }
};

const handleExport = async () => {
  const unselectedImageIds: string[] = [];
  imageStore.allData.forEach((imageData) => {
    if (!zoomerStore.hasSelection(imageData.id)) {
      unselectedImageIds.push(imageData.id);
    }
  });

  if (unselectedImageIds.length > 0) {
    const confirmed = await showConfirm("export-confirm");
    if (!confirmed) {
      notify("cancel");
      return;
    }
    unselectedImageIds.forEach((id) => {
      const imageData = imageStore.allData.find((data) => data.id === id);
      if (imageData) {
        const randomSelection = generateRandomSelection(
          imageData.displayWidth,
          imageData.displayHeight
        );
        zoomerStore.setRect(id, randomSelection);
      }
    });
  }

  try {
    const zip = new JSZip();
    const sessionData = {
      imageStore: {
        allData: imageStore.allData.map((d) => ({
          id: d.id,
          name: d.name,
          naturalWidth: d.naturalWidth,
          naturalHeight: d.naturalHeight,
          displayWidth: d.displayWidth,
          displayHeight: d.displayHeight,
        })),
        currentIndex: imageStore.currentIndex,
      },
      zoomerStore: {
        contexts: zoomerStore.contexts,
      },
    };
    zip.file("session.json", JSON.stringify(sessionData, null, 2));
    const imageFolder = zip.folder("images");
    imageStore.allData.forEach((data) => {
      if (data.image) {
        imageFolder.file(data.name, data.image);
      }
    });
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `session_${new Date().toISOString().slice(0, 10)}.zip`);
    notify("exported");
  } catch (e) {
    notify("error");
  }
};

const handleImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const zip = await JSZip.loadAsync(e.target?.result as ArrayBuffer);
      const sessionFile = zip.file("session.json");
      if (!sessionFile) throw new Error("session.json not found in zip");

      const sessionData = JSON.parse(await sessionFile.async("string"));
      const imageFiles = zip.folder("images");

      if (sessionData.imageStore && imageFiles) {
        // Revoke existing object URLs before importing new data
        imageStore.allData.forEach((data) => {
          if (data.thumbnailSrc && data.thumbnailSrc.startsWith("blob:")) {
            URL.revokeObjectURL(data.thumbnailSrc);
          }
        });

        const newImageData = await Promise.all(
          sessionData.imageStore.allData.map(async (item: any) => {
            const imageFile = imageFiles.file(item.name);
            if (!imageFile) return null;
            const blob = await imageFile.async("blob");
            const file = new File([blob], item.name, { type: blob.type });
            return await loadImageFile(file);
          })
        );

        const validImageData = newImageData.filter(Boolean);

        imageStore.importData({
          allData: validImageData,
          currentIndex: sessionData.imageStore.currentIndex,
        });
        zoomerStore.importData(sessionData.zoomerStore);
        notify("imported");
      }
    } catch (error) {
      notify("error");
      console.error("Error processing zip file:", error);
    }
  };
  reader.readAsArrayBuffer(file);
};
</script>

<style scoped>
.data-manager-btns {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
