<template>
  <el-container class="manager-layout">
    <el-main class="manager-main">
      <div class="manager-top-bar">
        <div class="top-bar-section file-utils">
          <Button
            @click="isSidebarVisible = true"
            :disabled="isZooming"
            icon="PhSidebarSimple"
            :title="t('sidebar.openSidebar')"
          />
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="onFileChange"
            style="display: none"
          />
          <el-button-group>
            <Button
              @click="goToPrev"
              :disabled="!canGoPrev"
              icon="PhArrowLeft"
              :title="t('topbar.previous')"
            />
            <Button
              @click="goToNext"
              :disabled="!canGoNext"
              icon="PhArrowRight"
              :title="t('topbar.next')"
            />
          </el-button-group>
        </div>
        <el-divider direction="vertical" />
        <div class="top-bar-section common-utils">
          <Button
            @click="handleShowFullImage"
            :disabled="!currentId || !isZooming"
            icon="PhCornersOut"
            :title="t('topbar.showAll')"
          />
        </div>
        <el-divider direction="vertical" />
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

        <el-divider direction="vertical" />
        <div class="top-bar-section mode-toggle">
          <Button
            :icon="currentDisplayMode.icon"
            :title="currentDisplayMode.tooltip"
            tooltipPlacement="left"
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

  <el-drawer
    v-model="isSidebarVisible"
    direction="ltr"
    size="280px"
    :with-header="false"
  >
    <DataSidebar
      :current-id="currentId"
      :data-store="imageStore"
      :extra-store="zoomStore"
      data-type="image"
      @select-data="handleImageSelect"
      @add-file="triggerFileInput"
    />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useImageStore } from "@/stores/dataStore";
import { useZoomerStore } from "./stores/zoomerStore";
import { loadImageFile } from "@/composables/useImageLoader";
import { useNotifier } from "@/composables/useNotifier";
import Zoomer from "./views/Zoomer.vue";
import DataSidebar from "@/components/DataSidebar.vue";
import Button from "@/components/Button.vue";
import { useI18n } from "vue-i18n";

const imageStore = useImageStore();
const zoomStore = useZoomerStore();
const { t } = useI18n();

const { canGoPrev, canGoNext, currentData } = storeToRefs(imageStore);
const { isZooming, isPaused } = storeToRefs(zoomStore);

const zoomer = ref<InstanceType<typeof Zoomer> | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const currentId = computed(() => currentData.value?.id || null);
const hasSelection = computed(() => zoomStore.hasSelection(currentId.value));

const { notify } = useNotifier();

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
    notify(status);
  } catch (err) {
    notify("error");
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
  {
    value: "full",
    icon: "PhImage",
    currentLabel: t("zoomer.showFullImage"),
    nextLabel: t("zoomer.switchToShowSelectedArea")
  },
  {
    value: "selection",
    icon: "PhCrop",
    currentLabel: t("zoomer.showSelectedArea"),
    nextLabel: t("zoomer.switchToHideImage")
  },
  {
    value: "none",
    icon: "PhEyeSlash",
    currentLabel: t("zoomer.hideImage"),
    nextLabel: t("zoomer.switchToShowFullImage")
  },
];
const displayMode = ref<string>("full");

const currentDisplayMode = computed(() => {
  const current = displayModes.find((m) => m.value === displayMode.value);
  return {
    icon: current?.icon || "PhImage",
    tooltip: current?.nextLabel || t("zoomer.switchToShowSelectedArea"),
  };
});

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
