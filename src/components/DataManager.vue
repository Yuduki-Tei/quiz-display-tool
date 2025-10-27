<template>
  <input
    ref="importInput"
    type="file"
    accept=".zip"
    style="display: none"
    @change="handleImport"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { BaseData, ImageData, TextData } from "@/@types/types";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { loadImageFile } from "@/composables/useImageLoader";
import { randomSelection } from "@/features/Zoomer/composables/useRectSelection";
import { SelectionRect } from "@/features/Zoomer/types/ZoomerTypes";
import { useNotifier } from "@/composables/useNotifier";

interface Props {
  dataStore: any;
  extraStore: any;
  dataType: "image" | "text";
}

const props = defineProps<Props>();

const dataStore = props.dataStore;
const extraStore = props.extraStore;

const importInput = ref<HTMLInputElement | null>(null);
const { notify } = useNotifier();

const triggerImport = () => {
  importInput.value?.click();
};

const selectionCheck = async (): Promise<boolean> => {
  const unselectedDataIds: string[] = [];
  dataStore.allData.forEach((data: BaseData) => {
    if (!extraStore.hasSelection(data.id)) {
      unselectedDataIds.push(data.id);
    }
  });

  if (unselectedDataIds.length > 0) {
    const confirmed = await notify("export-confirm");
    if (!confirmed) {
      notify("cancel");
      return false;
    }
    unselectedDataIds.forEach((id) => {
      const data = dataStore.allData.find((d: BaseData) => d.id === id);
      if (data && extraStore.$id === "zoomer" && props.dataType === "image") {
        const imageData = data as any; // Cast to access image-specific properties
        const rect: SelectionRect = randomSelection(
          imageData.displayWidth,
          imageData.displayHeight
        );
        extraStore.setRect(id, rect);
      }
    });
  }
  return true;
};

const handleExport = async () => {
  if (extraStore.$id === "zoomer") {
    const conti = await selectionCheck();
    if (!!!conti) return;
  }
  try {
    const zip = new JSZip();

    const extraData = extraStore.contexts;

    const header = {
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      mode: extraStore.$id,
      dataType: props.dataType,
      appName: "quiz-display-tool",
    };

    let allDataSerialized;
    if (props.dataType === "image") {
      allDataSerialized = (dataStore.allData as ImageData[]).map((d) => ({
        id: d.id,
        name: d.name,
        naturalWidth: d.naturalWidth,
        naturalHeight: d.naturalHeight,
        displayWidth: d.displayWidth,
        displayHeight: d.displayHeight,
      }));
    } else {
      allDataSerialized = (dataStore.allData as TextData[]).map((d) => ({
        id: d.id,
        name: d.name,
        content: d.content,
      }));
    }

    const sessionData = {
      header,
      dataStore: {
        allData: allDataSerialized,
        currentIndex: dataStore.currentIndex,
      },
      extraStore: extraData,
    };

    zip.file("session.json", JSON.stringify(sessionData, null, 2));

    if (props.dataType === "image") {
      const imageFolder = zip.folder("images");
      (dataStore.allData as ImageData[]).forEach((data) => {
        if (data.image) {
          imageFolder!.file(data.name, data.image);
        }
      });
    } else {
      const textFolder = zip.folder("texts");
      (dataStore.allData as TextData[]).forEach((data) => {
        if (data.content) {
          textFolder!.file(data.name, data.content);
        }
      });
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `session_${new Date().toISOString().slice(0, 10)}.zip`);
    notify("exported");
  } catch (e) {
    notify("error");
  }
};

const importImageData = async (zip: JSZip, sessionData: any) => {
  const imageFiles = zip.folder("images");
  if (!imageFiles) throw new Error("images folder not found");

  const newImageData = await Promise.all(
    sessionData.dataStore.allData.map(async (item: any) => {
      const imageFile = imageFiles.file(item.name);
      if (!imageFile) return null;
      const blob = await imageFile.async("blob");
      const file = new File([blob], item.name, { type: blob.type });
      return await loadImageFile(file);
    })
  );

  const validImageData = newImageData.filter(Boolean) as ImageData[];
  return validImageData;
};

const importTextData = async (zip: JSZip, sessionData: any) => {
  const textFiles = zip.folder("texts");
  if (!textFiles) throw new Error("texts folder not found");
  const { getTextPreview } = await import("@/composables/useTextLoader");

  const newTextData: TextData[] = [];
  for (const item of sessionData.dataStore.allData) {
    const textFile = textFiles.file(item.name);
    if (!textFile) continue;
    const content = await textFile.async("string");
    newTextData.push({
      id: item.id,
      name: item.name,
      content: content,
      thumbnailSrc: getTextPreview(content),
    });
  }
  return newTextData;
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
      const header = sessionData.header;
      const importedMode = header.mode;
      const importedDataType = header.dataType || "image";
      const currentMode = extraStore.$id;

      if (importedMode !== currentMode || importedDataType !== props.dataType) {
        notify("mode-mismatch");
        return;
      }

      if (sessionData.dataStore) {
        dataStore.allData.forEach((data: BaseData) => {
          if (data.thumbnailSrc && data.thumbnailSrc.startsWith("blob:")) {
            URL.revokeObjectURL(data.thumbnailSrc);
          }
        });

        const newData =
          props.dataType === "image"
            ? await importImageData(zip, sessionData)
            : await importTextData(zip, sessionData);

        dataStore.importData({
          allData: newData,
          currentIndex: sessionData.dataStore.currentIndex,
        });
        extraStore.importData({ contexts: sessionData.extraStore });
        notify("imported");
      }
    } catch (error) {
      notify("error");
    }
  };
  reader.readAsArrayBuffer(file);

  if (importInput.value) {
    importInput.value.value = "";
  }
};

defineExpose({
  triggerImport,
  handleExport,
});
</script>
