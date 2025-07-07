'''<template>
  <div>
    <el-dropdown>
      <Button type="primary" size="small" circle plain icon="MoreFilled" icon-size="16" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleExport">匯出</el-dropdown-item>
          <el-dropdown-item @click="triggerImport">匯入</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <input ref="importInput" type="file" accept=".zip" style="display: none" @change="handleImport" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useImageStore } from "@/stores/imageStore";
import { useZoomerStore } from "@/features/Zoomer/stores/zoomerStore";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { loadImageFile } from '@/composables/useImageLoader';
import Button from "@/components/Button.vue";
import { useMessageBox } from "@/composables/useMessageBox";

const imageStore = useImageStore();
const zoomerStore = useZoomerStore();

const importInput = ref<HTMLInputElement | null>(null);

const triggerImport = () => {
  importInput.value?.click();
};

import { generateRandomSelection } from "@/features/Zoomer/composables/zoomOutUtil";

const { confirm } = useMessageBox();

const handleExport = async () => {
  const unselectedImageIds: string[] = [];
  imageStore.allData.forEach((imageData) => {
    let { x, y, w, h } = zoomerStore.getContext(imageData.id)?.selection
    if (!x && !y) {
      unselectedImageIds.push(imageData.id);
    }
  });

  if (unselectedImageIds.length > 0) {
    try {
      await confirm(
        `有 ${unselectedImageIds.length} 張圖片尚未框選區域。是否要為這些圖片隨機選取一塊區域？`,
        "警告"
      );

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
    } catch (error) {
      // User cancelled the operation
      console.log("Export cancelled by user.");
      return;
    }
  }

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
        imageStore.allData.forEach(data => {
          if (data.thumbnailSrc && data.thumbnailSrc.startsWith('blob:')) {
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
      }
    } catch (error) {
      console.error("Error processing zip file:", error);
    }
  };
  reader.readAsArrayBuffer(file);
};
</script>
'''