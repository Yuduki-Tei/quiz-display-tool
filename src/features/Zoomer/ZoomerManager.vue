<template>
  <el-container class="manager-layout">
    <el-main class="manager-main">
      <div class="manager-top-bar">
        <div class="manager-top-bar-left">
          <Button
            type="primary"
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
            type="primary"
            @click="triggerFileInput"
            :disabled="isZooming"
            icon="Plus"
          />
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
        <div class="top-bar-center">
          <el-button-group>
            <Button
              type="primary"
              @click="handleZoomControl"
              :disabled="!hasSelection && !isZooming"
              :icon="isZooming && !isPaused ? 'VideoPause' : 'VideoPlay'"
            />
            <Button
              type="warning"
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
        <div class="top-bar-right">
          <Button
            type="primary"
            :icon="displayModes.find((m) => m.value === displayMode)?.icon"
            :title="displayModes.find((m) => m.value === displayMode)?.tooltip"
            @click="cycleDisplayMode"
            :disabled="isZooming"
          />
        </div>
      </div>
      <div class="display-area">
        <Zoomer ref="zoomer" :id="currentId" :displayMode="displayMode" />
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
      :extra-store="zoomStore"
      @select-image="handleImageSelect"
    />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
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
        duration: 30000,
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

const handleZoomControl = () => {
  if (!isZooming.value) {
    zoomer.value?.startZoomOut();
  } else {
    if (isPaused.value) zoomer.value?.resumeZoomOut();
    else zoomer.value?.pauseZoomOut();
  }
};
const handleShowFullImage = () => zoomer.value?.showFullImage();

const durationSec = computed({
  get: () => Math.round(duration.value / 1000),
  set: (v) => {
    duration.value = v * 1000;
    if (currentId.value) {
      zoomStore.setContext(currentId.value, {
        duration: duration.value,
        selection: zoomStore.getContext(currentId.value).selection,
      });
    }
  },
});

const displayModes = [
  { value: "full", icon: "Picture", tooltip: "顯示完整圖片" },
  { value: "selection", icon: "Crop", tooltip: "只顯示框選區域" },
  { value: "none", icon: "Hide", tooltip: "隱藏圖片" },
];
const displayMode = ref<string>("full");
const cycleDisplayMode = () => {
  const idx = displayModes.findIndex((m) => m.value === displayMode.value);
  displayMode.value = displayModes[(idx + 1) % displayModes.length].value;
};

watch(currentId, (id) => {
  if (id) {
    const ctx = zoomStore.getContext(id);
    if (ctx && typeof ctx.duration === "number") {
      duration.value = ctx.duration;
    }
  }
});
</script>
