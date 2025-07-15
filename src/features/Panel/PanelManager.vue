<template>
  <el-container class="manager-layout">
    <el-main class="manager-main">
      <div class="manager-top-bar">
        <div class="manager-top-bar-left">
          <Button
            type="primary"
            @click="isSidebarVisible = true"
            icon="Expand"
          />
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="onFileChange"
            style="display: none"
          />
          <Button type="primary" @click="triggerFileInput" icon="Plus" />
          <el-divider direction="vertical" />
          <el-button-group>
            <Button
              type="info"
              @click="goToPrev"
              :disabled="!canGoPrev"
              icon="Back"
            />
            <Button
              type="info"
              @click="goToNext"
              :disabled="!canGoNext"
              icon="Right"
            />
          </el-button-group>
        </div>
        <div
          style="
            display: flex;
            align-items: center;
            gap: 0.5em;
            margin-left: 1em;
          "
        >
          <el-select v-model="gridX" size="small" style="width: 60px">
            <el-option v-for="n in 100" :key="`x-${n}`" :value="n" :label="n" />
          </el-select>
          <Icon name="Close" />
          <el-select v-model="gridY" size="small" style="width: 60px">
            <el-option v-for="n in 100" :key="`y-${n}`" :value="n" :label="n" />
          </el-select>
        </div>
      </div>
      <div class="display-area">
        <Panel :id="currentId" />
      </div>
    </el-main>
  </el-container>
  <Notifier :status="notificationStatus" :timestamp="notificationTimestamp" />
  <el-drawer
    v-model="isSidebarVisible"
    direction="ltr"
    size="280px"
    :with-header="false"
  >
    <ImageSidebar
      :current-id="currentId"
      :extra-store="panelStore"
      @select-image="handleImageSelect"
    />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useImageStore } from "@/stores/imageStore";
import { usePanelStore } from "./stores/panelStore";
import { loadImageFile } from "@/composables/useImageLoader";
import Panel from "../Panel/views/Panel.vue";
import Notifier from "@/components/Notifier.vue";
import ImageSidebar from "@/components/ImageSidebar.vue";
import Button from "@/components/Button.vue";
import Icon from "@/components/Icon.vue";

const imageStore = useImageStore();
const panelStore = usePanelStore();
const { canGoPrev, canGoNext, currentImage } = storeToRefs(imageStore);

const fileInput = ref<HTMLInputElement | null>(null);
const currentId = computed(() => currentImage.value?.id || null);
const notificationStatus = ref<string | null>(null);
const notificationTimestamp = ref<number | null>(null);
const isSidebarVisible = ref(false);
const gridX = ref(5);
const gridY = ref(5);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const onFileChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || !files[0]) return;
  const file = files[0];
  try {
    const imgData = await loadImageFile(file);
    const status = imageStore.addData(imgData);
    if (status === "added" && currentId.value) {
      panelStore.setContext(currentId.value, {
        revealed: [],
        revealType: "manual",
        amount: { x: gridX.value, y: gridY.value },
      });
    }
    notificationStatus.value = status;
    notificationTimestamp.value = Date.now();
  } catch (err) {
    notificationStatus.value = "error";
    notificationTimestamp.value = Date.now();
  }
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleImageSelect = (id: string) => {
  imageStore.setCurrentById(id);
  isSidebarVisible.value = false;
};

const goToPrev = () => {
  imageStore.goToPrev();
};

const goToNext = () => {
  imageStore.goToNext();
};

watch([gridX, gridY, currentId], ([x, y, id]) => {
  if (id) {
    panelStore.setAmount(id, { x, y });
  }
});

onMounted(() => {
  const images = imageStore.getAllImages();
  if (images.length > 0) {
    images.forEach((image) => {
      if (!panelStore.hasContext(image.id)) {
        panelStore.setContext(image.id, {
          revealed: [],
          revealType: "manual",
          amount: { x: gridX.value, y: gridY.value },
        });
      }
    });
  }
});
</script>
