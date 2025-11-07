<template>
  <ManagerLayout
    :can-go-prev="canGoPrev"
    :can-go-next="canGoNext"
    :disabled="isZooming"
    :sidebar-visible="isSidebarVisible"
    @toggle-sidebar="isSidebarVisible = true"
    @go-prev="goToPrev"
    @go-next="goToNext"
    @update:sidebar-visible="isSidebarVisible = $event"
  >
    <!-- File input -->
    <template #file-input>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="baseOnFileChange"
        style="display: none"
      />
    </template>

    <!-- Common utils section -->
    <template #common-utils>
      <div class="top-bar-section common-utils">
        <Button
          @click="handleShowFullImage"
          :disabled="!currentId || !isZooming"
          icon="PhCornersOut"
          :title="t('topbar.showAll')"
        />
      </div>
    </template>

    <!-- Auto play controls -->
    <template #auto-play-controls>
      <div class="top-bar-section auto-play">
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
    </template>

    <!-- Mode toggle -->
    <template #mode-toggle>
      <div class="top-bar-section mode-toggle">
        <Button
          :icon="currentDisplayMode.icon"
          :title="currentDisplayMode.tooltip"
          tooltipPlacement="left"
          @click="cycleDisplayMode"
          :disabled="isZooming"
        />
      </div>
    </template>

    <!-- Display area -->
    <template #display>
      <Zoomer ref="zoomer" :id="currentId" :displayMode="displayMode" />
    </template>

    <!-- Floating play button -->
    <template #floating-button>
      <div class="floating-play-button">
        <Button
          @click="handleZoomControl"
          :icon="isZooming && !isPaused ? 'PhPause' : 'PhPlay'"
          :title="isZooming && !isPaused ? t('topbar.pause') : t('topbar.play')"
          :icon-size="28"
          :disabled="!hasSelection"
          size="large"
          circle
        />
      </div>
    </template>

    <!-- Sidebar -->
    <template #sidebar>
      <DataSidebar
        :current-id="currentId"
        :data-store="imageStore"
        :extra-store="zoomStore"
        data-type="image"
        @select-data="handleDataSelect"
        @add-file="triggerFileInput"
      />
    </template>
  </ManagerLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useImageStore } from "@/stores/dataStore";
import { useZoomerStore } from "./stores/zoomerStore";
import { useManagerBase } from "@/composables/useManagerBase";
import { loadImageFile } from "@/composables/useImageLoader";
import Zoomer from "./views/Zoomer.vue";
import DataSidebar from "@/components/DataSidebar.vue";
import Button from "@/components/Button.vue";
import { useI18n } from "vue-i18n";
import ManagerLayout from "@/components/ManagerLayout.vue";
import type { ZoomerInstance } from "./types/ZoomerInstance";

const imageStore = useImageStore();
const zoomStore = useZoomerStore();
const { t } = useI18n();

// Use shared manager base functionality
const {
  isSidebarVisible,
  fileInput,
  currentId,
  canGoPrev,
  canGoNext,
  isZooming,
  isPaused,
  triggerFileInput,
  onFileChange: baseOnFileChange,
  handleDataSelect,
  goToPrev,
  goToNext,
} = useManagerBase({
  dataStore: imageStore,
  extraStore: zoomStore,
  dataType: "image",
  fileAccept: "image/*",
  loadFile: loadImageFile,
  onFileAdded: (id: string, status: string) => {
    if (status === "added") {
      zoomStore.setContext(id, {
        duration: duration.value,
        selection: { x: 0, y: 0, w: 0, h: 0 },
      });
    }
  },
});

// Zoomer-specific state
const zoomer = ref<ZoomerInstance | null>(null);
const duration = ref(30000);
const displayMode = ref<string>("full");

// Zoomer-specific computed properties
const hasSelection = computed(() => zoomStore.hasSelection(currentId.value));

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
  {
    value: "full",
    icon: "PhImage",
    currentLabel: t("zoomer.showFullImage"),
    nextLabel: t("zoomer.switchToShowSelectedArea"),
  },
  {
    value: "selection",
    icon: "PhCrop",
    currentLabel: t("zoomer.showSelectedArea"),
    nextLabel: t("zoomer.switchToHideImage"),
  },
  {
    value: "none",
    icon: "PhEyeSlash",
    currentLabel: t("zoomer.hideImage"),
    nextLabel: t("zoomer.switchToShowFullImage"),
  },
];

const currentDisplayMode = computed(() => {
  const current = displayModes.find((m) => m.value === displayMode.value);
  return {
    icon: current?.icon || "PhImage",
    tooltip: current?.nextLabel || t("zoomer.switchToShowSelectedArea"),
  };
});

// Zoomer-specific methods
const handleZoomControl = () => {
  if (!isZooming.value) {
    zoomer.value?.startZoomOut();
  } else {
    if (isPaused.value) zoomer.value?.resumeZoomOut();
    else zoomer.value?.pauseZoomOut();
  }
};

const handleShowFullImage = () => zoomer.value?.showFullImage();

const cycleDisplayMode = () => {
  const idx = displayModes.findIndex((m) => m.value === displayMode.value);
  displayMode.value = displayModes[(idx + 1) % displayModes.length].value;
};

// Watchers
watch(currentId, (id) => {
  if (id) {
    const ctx = zoomStore.getContext(id);
    if (ctx && typeof ctx.duration === "number") {
      duration.value = ctx.duration;
    }
  }
});

// Initialize existing images with zoom contexts
onMounted(() => {
  const images = imageStore.getAllData();
  if (images.length > 0) {
    images.forEach((image) => {
      if (!zoomStore.hasContext(image.id)) {
        zoomStore.setContext(image.id, {
          duration: duration.value,
          selection: { x: 0, y: 0, w: 0, h: 0 },
        });
      }
    });
  }
});
</script>
