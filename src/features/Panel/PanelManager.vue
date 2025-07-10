<template>
  <el-container class="manager-container">
    <el-main class="main-content">
      <div class="top-bar">
        <div class="top-bar-left">
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
      </div>
      <div class="panel-area">
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
      storeType="panel"
      @select-image="handleImageSelect"
    />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useImageStore } from "@/stores/imageStore";
import { loadImageFile } from "@/composables/useImageLoader";
import Panel from "../Panel/views/Panel.vue";
import Notifier from "@/components/Notifier.vue";
import ImageSidebar from "@/components/ImageSidebar.vue";
import Button from "@/components/Button.vue";

const imageStore = useImageStore();
const { canGoPrev, canGoNext, currentImage } = storeToRefs(imageStore);

const fileInput = ref<HTMLInputElement | null>(null);
const currentId = computed(() => currentImage.value?.id || null);
const notificationStatus = ref<string | null>(null);
const notificationTimestamp = ref<number | null>(null);
const isSidebarVisible = ref(false);

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
</script>

<style scoped>
.manager-container {
  height: 100vh;
}
.main-content {
  padding: 0;
  display: flex;
  flex-direction: column;
}
.top-bar {
  flex-shrink: 0;
  padding: 1rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--el-color-primary-light-5);
}
.top-bar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  flex: 1;
}
.panel-area {
  flex-grow: 1;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
