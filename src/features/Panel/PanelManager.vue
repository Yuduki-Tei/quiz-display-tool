<template>
  <el-container class="manager-layout">
    <el-main class="manager-main">
      <div class="manager-top-bar">
        <div class="manager-top-bar-left">
          <Button
            type="primary"
            @click="isSidebarVisible = true"
            icon="PhSidebarSimple"
            :disabled="isRevealing"
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
            icon="PhPlus"
            :disabled="isRevealing"
          />
          <el-divider direction="vertical" />
          <el-button-group>
            <Button
              type="info"
              @click="goToPrev"
              :disabled="!canGoPrev"
              icon="PhArrowLeft"
            />
            <Button
              type="info"
              @click="goToNext"
              :disabled="!canGoNext"
              icon="PhArrowRight"
            />
          </el-button-group>
        </div>
        <div class="top-bar-center">
          <el-button-group>
            <Button
              type="primary"
              @click="handleRevealControl"
              :disabled="!canReveal"
              :icon="isRevealing && !isPaused ? 'VideoPause' : 'VideoPlay'"
            />
          </el-button-group>
          <el-divider direction="vertical" />
          <div class="grid-selector">
            <el-select
              v-model="gridX"
              size="small"
              style="width: 60px"
              :disabled="isRevealing"
            >
              <el-option
                v-for="n in 100"
                :key="`x-${n}`"
                :value="n"
                :label="n"
              />
            </el-select>
            <Icon name="Close" />
            <el-select
              v-model="gridY"
              size="small"
              style="width: 60px"
              :disabled="isRevealing"
            >
              <el-option
                v-for="n in 100"
                :key="`y-${n}`"
                :value="n"
                :label="n"
              />
            </el-select>
          </div>
          <el-divider direction="vertical" />
          <div class="duration-control">
            <el-slider
              v-model="durationSec"
              :min="1"
              :max="20"
              :step="1"
              style="width: 120px"
              :disabled="isRevealing"
              :show-tooltip="false"
            />
            <el-input-number
              v-model="durationSec"
              :min="1"
              :max="20"
              :step="1"
              size="small"
              :disabled="isRevealing"
            />
          </div>
        </div>
        <div class="top-bar-right">
          <el-select
            v-model="revealPatternMode"
            size="small"
            :disabled="isRevealing"
            placeholder="めくりパターン"
            style="width: 130px; margin-right: 10px"
          >
            <el-option
              v-for="mode in availableRevealModes"
              :key="mode.value"
              :label="mode.label"
              :value="mode.value"
            >
              <div style="display: flex; align-items: center">
                <Icon :name="mode.icon" style="margin-right: 5px" />
                <span>{{ mode.label }}</span>
              </div>
            </el-option>
          </el-select>
          <Button
            type="primary"
            :icon="revealTypeButtons.find((m) => m.value === revealMode)?.icon"
            :title="
              revealTypeButtons.find((m) => m.value === revealMode)?.tooltip
            "
            @click="cycleRevealMode"
            :disabled="isRevealing"
          />
        </div>
      </div>
      <div class="display-area">
        <Panel ref="panel" :id="currentId" :displayMode="revealMode" />
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
import { getRevealModes } from "./composables/revealUtil";
import Panel from "../Panel/views/Panel.vue";
import Notifier from "@/components/Notifier.vue";
import ImageSidebar from "@/components/ImageSidebar.vue";
import Button from "@/components/Button.vue";
import Icon from "@/components/Icon.vue";

const imageStore = useImageStore();
const panelStore = usePanelStore();
const { canGoPrev, canGoNext, currentImage } = storeToRefs(imageStore);
const { isRevealing, isPaused } = storeToRefs(panelStore);

const panel = ref<InstanceType<typeof Panel> | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const currentId = computed(() => currentImage.value?.id || null);
const notificationStatus = ref<string | null>(null);
const notificationTimestamp = ref<number | null>(null);
const isSidebarVisible = ref(false);
const gridX = ref(5);
const gridY = ref(5);
const duration = ref(5000); // 5 seconds default
const canReveal = computed(() => !!currentId.value);
const revealMode = ref<string>("manual");
const revealPatternMode = ref<string>("random");
const availableRevealModes = getRevealModes();

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
        revealMode: "random",
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

const handleRevealControl = () => {
  if (!isRevealing.value) {
    // パネルを開始する前に現在のRevealModeをStoreに設定
    if (currentId.value) {
      const ctx = panelStore.getContext(currentId.value);
      if (ctx) {
        panelStore.setContext(currentId.value, {
          ...ctx,
          revealMode: revealPatternMode.value,
        });
      }
    }
    panel.value?.startAutoReveal();
  } else {
    if (isPaused.value) {
      panel.value?.resumeAutoReveal();
    } else {
      panel.value?.pauseAutoReveal();
    }
  }
};

const durationSec = computed({
  get: () => Math.round(duration.value / 1000),
  set: (v) => {
    duration.value = v * 1000;
    if (currentId.value) {
      const ctx = panelStore.getContext(currentId.value);
      if (ctx) {
        panelStore.setContext(currentId.value, {
          ...ctx,
          duration: duration.value,
        });
      }
    }
  },
});

const revealTypeButtons = [
  { value: "manual", icon: "EditPen", tooltip: "手動めくりモード" },
  { value: "auto", icon: "VideoPlay", tooltip: "自動めくりモード" },
];

const cycleRevealMode = () => {
  const idx = revealTypeButtons.findIndex((m) => m.value === revealMode.value);
  revealMode.value =
    revealTypeButtons[(idx + 1) % revealTypeButtons.length].value;

  if (currentId.value) {
    const ctx = panelStore.getContext(currentId.value);
    if (ctx) {
      panelStore.setContext(currentId.value, {
        ...ctx,
        revealType: revealMode.value as "auto" | "manual",
      });
    }
  }
};

watch([gridX, gridY, currentId], ([x, y, id]) => {
  if (id) {
    panelStore.setAmount(id, { x, y });
  }
});

watch(currentId, (id) => {
  if (id) {
    const ctx = panelStore.getContext(id);
    if (ctx && typeof ctx.duration === "number") {
      duration.value = ctx.duration;
    }
    if (ctx && typeof ctx.revealType === "string") {
      revealMode.value = ctx.revealType;
    }
    if (ctx && typeof ctx.revealMode === "string") {
      revealPatternMode.value = ctx.revealMode;
    }
  }
});

watch(revealPatternMode, (newMode) => {
  if (currentId.value) {
    const ctx = panelStore.getContext(currentId.value);
    if (ctx) {
      panelStore.setContext(currentId.value, {
        ...ctx,
        revealMode: newMode,
      });
    }
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
          revealMode: "random",
          amount: { x: gridX.value, y: gridY.value },
          duration: duration.value,
        });
      }
    });
  }
});
</script>
