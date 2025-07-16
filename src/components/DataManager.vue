<template>
  <div class="data-manager-btns">
    <Button
      type="primary"
      icon="PhBoxArrowUp"
      @click="triggerImport"
      :disabled="isDataExists"
    />
    <Button
      type="primary"
      icon="PhBoxArrowDown"
      @click="handleExport"
      :disabled="!isDataExists"
    />
    <input
      ref="importInput"
      type="file"
      accept=".zip"
      style="display: none"
      @change="handleImport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useImageStore } from "@/stores/imageStore";
import { useZoomerStore } from "@/features/Zoomer/stores/zoomerStore";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { loadImageFile } from "@/composables/useImageLoader";
import Button from "@/components/Button.vue";
import { randomSelection } from "@/features/Zoomer/composables/useRectSelection";
import { SelectionRect } from "@/features/Zoomer/types/ZoomerTypes";
import { useNotifier } from "@/composables/useNotifier";

const imageStore = useImageStore();
const zoomerStore = useZoomerStore();
const importInput = ref<HTMLInputElement | null>(null);
const { notify } = useNotifier();
const isDataExists = computed(() => {
  return imageStore.allData.length > 0;
});

const triggerImport = () => {
  importInput.value?.click();
};

const handleExport = async () => {
  const unselectedImageIds: string[] = [];
  imageStore.allData.forEach((imageData) => {
    if (!zoomerStore.hasSelection(imageData.id)) {
      unselectedImageIds.push(imageData.id);
    }
  });

  if (unselectedImageIds.length > 0) {
    const confirmed = await notify("export-confirm");
    if (!confirmed) {
      notify("cancel");
      return;
    }
    unselectedImageIds.forEach((id) => {
      const imageData = imageStore.allData.find((data) => data.id === id);
      if (imageData) {
        const rect: SelectionRect = randomSelection(
          imageData.displayWidth,
          imageData.displayHeight
        );
        zoomerStore.setRect(id, rect);
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
