<template>
  <el-container class="manager-container">
    <el-main class="main-content">
      <div class="top-bar">
        <el-button @click="isSidebarVisible = true">
          <el-icon><Menu /></el-icon>
        </el-button>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="onFileChange"
          style="display: none"
        />
        <el-button type="primary" @click="triggerFileInput">
          <el-icon><Upload /></el-icon>
          載入圖片
        </el-button>
        <el-divider direction="vertical" />
        <el-button-group>
          <el-button @click="goToPrev" :disabled="!canGoPrev">
            <el-icon><ArrowLeft /></el-icon>
            Prev
          </el-button>
          <el-button @click="goToNext" :disabled="!canGoNext">
            Next
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </el-button-group>
        <el-divider direction="vertical" />
        <el-button-group>
          <el-button
            @click="startZoomOut"
            :disabled="!hasSelection || isZooming"
          >
            Zoom Out
          </el-button>
          <el-button
            @click="handlePauseOrResumeZoomOut"
            :disabled="!isZooming && !isPaused"
          >
            {{ isPaused ? "Resume" : "Pause" }}
          </el-button>
          <el-button
            @click="handleShowFullImage"
            :disabled="!currentId || !isZooming"
          >
            Show Full Image
          </el-button>
        </el-button-group>
      </div>
      <div class="zoomer-area">
        <Zoomer ref="zoomer" :id="currentId" />
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
    <ImageSidebar :current-id="currentId" @select-image="handleImageSelect" />
  </el-drawer>
</template>

<script setup lang="ts">
// 1. 從 'vue' 匯入 computed，並移除 ref 對 currentId 的使用
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useImageStore } from "@/stores/imageStore";
import { useZoomerStore } from "./stores/zoomerStore";
import { loadImageFile } from "@/composables/useImageLoader";
import Zoomer from "./views/Zoomer.vue";
import Notifier from "@/components/Notifier.vue";
import ImageSidebar from "@/components/ImageSidebar.vue";
import { Menu, Upload, ArrowLeft, ArrowRight } from "@element-plus/icons-vue";

const imageStore = useImageStore();
const zoomStore = useZoomerStore();

const { canGoPrev, canGoNext, currentImage } = storeToRefs(imageStore);
const { isZooming, isPaused } = storeToRefs(zoomStore);

const zoomer = ref<InstanceType<typeof Zoomer> | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const currentId = computed(() => currentImage.value?.id || null);

const notificationStatus = ref<string | null>(null);
const notificationTimestamp = ref<number | null>(null);

const isSidebarVisible = ref(false);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const hasSelection = computed(() => {
  if (!currentId.value) return false;
  const ctx = zoomStore.getContext(currentId.value);
  const sel = ctx?.selection;
  return !!(ctx && sel && sel.w && sel.h);
});

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
</script>

<style scoped>
.manager-container {
  height: 100vh;
  background-color: var(--el-bg-color);
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
  border-bottom: 1px solid var(--el-border-color-light);
  background-color: var(--el-bg-color);
}
.zoomer-area {
  flex-grow: 1;
  padding: 1rem;
  overflow: auto;
  background-color: var(--el-bg-color-page);
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-button-group {
  margin: 0 8px;
}
.el-divider--vertical {
  height: 1.5em;
}
.el-drawer__body {
  padding: 0 !important;
}
</style>
