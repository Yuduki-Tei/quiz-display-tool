<template>
  <el-container class="manager-container">
    <el-main class="main-content">
      <div class="top-bar">
        <Button
          :type="isZooming ? 'info' : 'primary'"
          @click="isSidebarVisible = true"
          :disabled="isZooming"
          icon="Expand"
        />
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="onFileChange"
          style="display: none"
        />
        <Button
          :type="isZooming ? 'info' : 'primary'"
          @click="triggerFileInput"
          :disabled="isZooming"
          icon="Plus"
        />
        <el-divider direction="vertical" />
        <el-button-group>
          <Button
            :type="canGoPrev ? 'primary' : 'info'"
            @click="goToPrev"
            :disabled="!canGoPrev"
            icon="Back"
          />
          <Button
            :type="canGoNext ? 'primary' : 'info'"
            @click="goToNext"
            :disabled="!canGoNext"
            icon="Right"
          />
        </el-button-group>
        <el-divider direction="vertical" />
        <el-button-group>
          <Button
            :type="!hasSelection || isZooming ? 'info' : 'primary'"
            @click="startZoomOut"
            :disabled="!hasSelection || isZooming"
            icon="Search"
          />
          <Button
            :type="!isZooming && !isPaused ? 'info' : 'primary'"
            @click="handlePauseOrResumeZoomOut"
            :disabled="!isZooming && !isPaused"
            :icon="isPaused ? 'VideoPlay' : 'VideoPause'"
          >
          </Button>
          <Button
            :type="!currentId || !isZooming ? 'info' : 'warning'"
            @click="handleShowFullImage"
            :disabled="!currentId || !isZooming"
            icon="FullScreen"
          />
        </el-button-group>
        <el-divider direction="vertical" />
        <div class="duration-control">
          <el-slider
            v-model="durationSec"
            :min="1"
            :max="50"
            :step="1"
            style="width: 120px"
            :disabled="isZooming"
            :show-tooltip="false"
          />
          <el-input-number
            v-model="durationSec"
            :min="1"
            :max="50"
            :step="1"
            size="small"
            :disabled="isZooming"
          />
        </div>
      </div>
      <div class="zoomer-area">
        <Zoomer ref="zoomer" :id="currentId" :duration="duration" />
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
      storeType="zoomer"
      @select-image="handleImageSelect"
    />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useImageStore } from "@/stores/imageStore";
import { useZoomerStore } from "./stores/zoomerStore";
import { loadImageFile } from "@/composables/useImageLoader";
import Zoomer from "./views/Zoomer.vue";
import Notifier from "@/components/Notifier.vue";
import ImageSidebar from "@/components/ImageSidebar.vue";
import Button from "@/components/Button.vue";

const imageStore = useImageStore();
const zoomStore = useZoomerStore();

const { canGoPrev, canGoNext, currentImage } = storeToRefs(imageStore);
const { isZooming, isPaused } = storeToRefs(zoomStore);

const zoomer = ref<InstanceType<typeof Zoomer> | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const currentId = computed(() => currentImage.value?.id || null);
const hasSelection = computed(() => zoomStore.hasSelection(currentId.value));

const notificationStatus = ref<string | null>(null);
const notificationTimestamp = ref<number | null>(null);

const isSidebarVisible = ref(false);
const duration = ref(30000);
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
      zoomStore.setContext(currentId.value, {
        selection: { x: 0, y: 0, w: 0, h: 0 },
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

const startZoomOut = () => zoomer.value?.startZoomOut();
const handlePauseOrResumeZoomOut = () => {
  if (isPaused.value) zoomer.value?.resumeZoomOut();
  else zoomer.value?.pauseZoomOut();
};
const handleShowFullImage = () => zoomer.value?.showFullImage();

const durationSec = computed({
  get: () => Math.round(duration.value / 1000),
  set: (v) => {
    duration.value = v * 1000;
  },
});
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
  gap: 1rem;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--el-color-primary-light-5);
}

.zoomer-area {
  flex-grow: 1;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-button-group {
  margin: 0 1rem;
}

.el-divider--vertical {
  height: 2em;
  border-left: 1px solid var(--el-color-primary-light-5);
}

.duration-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
}
.el-input-number {
  width: 80px;
  margin-left: 8px;
}
</style>
