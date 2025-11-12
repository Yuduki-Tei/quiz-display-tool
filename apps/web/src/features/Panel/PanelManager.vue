<template>
  <ManagerLayout
    :can-go-prev="canGoPrev"
    :can-go-next="canGoNext"
    :disabled="isAutoRevealing"
    @go-prev="goToPrev"
    @go-next="goToNext"
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
        <el-button-group>
          <Button
            @click="handleCoverAll"
            icon="PhEyeClosed"
            :title="t('topbar.hideAll')"
            :disabled="!canHideAll"
          />
          <Button
            @click="handleRevealAll"
            icon="PhFrameCorners"
            :title="t('topbar.showAll')"
            :disabled="!canShowAll"
          />
        </el-button-group>
        <div class="grid-selector">
          <el-select
            v-model="gridX"
            size="small"
            style="width: 60px"
            :disabled="isAutoRevealing"
          >
            <el-option
              v-for="n in 100"
              :key="`x-${n}`"
              :value="n"
              :label="n"
            />
          </el-select>
          <Icon name="PhX" />
          <el-select
            v-model="gridY"
            size="small"
            style="width: 60px"
            :disabled="isAutoRevealing"
          >
            <el-option
              v-for="n in 100"
              :key="`y-${n}`"
              :value="n"
              :label="n"
            />
          </el-select>
        </div>
      </div>
    </template>

    <!-- Auto play controls -->
    <template #auto-play-controls>
      <div class="top-bar-section auto-play">
        <div class="duration-control" v-show="!isManual">
          <el-slider
            v-model="durationSec"
            :min="0.1"
            :max="10"
            :step="0.1"
            style="width: 120px"
            :disabled="isManual || isAutoRevealing"
            :show-tooltip="false"
          />
          <el-input-number
            v-model="durationSec"
            :min="0.1"
            :max="10"
            :step="0.1"
            size="small"
            :disabled="isManual || isAutoRevealing"
          />
        </div>
        <el-select
          class="text-select"
          v-model="mainMode"
          v-show="!isManual"
          size="small"
          :disabled="isAutoRevealing || isManual"
        >
          <el-option
            v-for="mode in getMainRevealModes()"
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
        <el-select
          class="text-select"
          v-model="subMode"
          v-show="!isManual && mainMode === 'linear'"
          size="small"
          :disabled="isAutoRevealing || isManual"
          :placeholder="t('panel.directionPriority')"
        >
          <el-option
            v-for="subMode in getLinearSubModes()"
            :key="subMode.value"
            :label="subMode.label"
            :value="subMode.value"
          >
            <div style="display: flex; align-items: center">
              <Icon :name="subMode.icon" style="margin-right: 5px" />
              <span>{{ subMode.label }}</span>
            </div>
          </el-option>
        </el-select>
        <el-select
          class="text-select"
          v-model="subMode"
          v-show="!isManual && mainMode === 'spiral'"
          size="small"
          :disabled="isAutoRevealing || isManual"
          :placeholder="t('panel.directionAndStart')"
        >
          <el-option
            v-for="subMode in getSpiralSubModes()"
            :key="subMode.value"
            :label="subMode.label"
            :value="subMode.value"
          >
            <div style="display: flex; align-items: center">
              <Icon :name="subMode.icon" style="margin-right: 5px" />
              <span>{{ subMode.label }}</span>
            </div>
          </el-option>
        </el-select>
      </div>
    </template>

    <!-- Mode toggle -->
    <template #mode-toggle>
      <div class="top-bar-section mode-toggle">
        <Button
          :icon="revealTypeButton.icon"
          :title="revealTypeButton.tooltip"
          tooltipPlacement="left"
          @click="toggleManualMode"
          :disabled="isAutoRevealing || isSomeRevealed"
        />
      </div>
    </template>

    <!-- Display area -->
    <template #display>
      <Panel ref="panel" :id="currentId" :isManualMode="isManual" />
    </template>

    <!-- Floating play button -->
    <template #floating-button>
      <div v-if="!isManual" class="floating-play-button">
        <Button
          @click="handleRevealControl"
          :icon="isAutoRevealing && !isPaused ? 'PhPause' : 'PhPlay'"
          :title="isAutoRevealing && !isPaused ? t('topbar.pause') : t('topbar.play')"
          :icon-size="28"
          :disabled="!canShowAll"
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
        :extra-store="panelStore"
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
import { usePanelStore } from "./stores/panelStore";
import { useManagerBase } from "@/composables/useManagerBase";
import { loadImageFile } from "@/composables/useImageLoader";
import {
  getMainRevealModes,
  getSpiralSubModes,
  getLinearSubModes,
} from "./composables/revealPatterns";
import Panel from "../Panel/views/Panel.vue";
import DataSidebar from "@/components/DataSidebar.vue";
import { useI18n } from "vue-i18n";
import Button from "@/components/Button.vue";
import Icon from "@/components/Icon.vue";
import ManagerLayout from "@/components/ManagerLayout.vue";
import type { PanelInstance } from "./types/PanelInstance";

const imageStore = useImageStore();
const panelStore = usePanelStore();
const { t } = useI18n();

// Use shared manager base functionality
const {
  fileInput,
  currentId,
  canGoPrev,
  canGoNext,
  isAutoRevealing,
  isPaused,
  triggerFileInput,
  onFileChange: baseOnFileChange,
  handleDataSelect,
  goToPrev,
  goToNext,
} = useManagerBase({
  dataStore: imageStore,
  extraStore: panelStore,
  dataType: "image",
  fileAccept: "image/*",
  loadFile: loadImageFile,
  onFileAdded: (id: string, status: string) => {
    if (status === "added") {
      panelStore.setContext(id, {
        revealed: [],
        isManual: isManual.value,
        autoRevealMode: autoRevealMode.value,
        duration: duration.value,
        amount: { x: gridX.value, y: gridY.value },
      });
    }
  },
});

// Panel-specific state
const panel = ref<PanelInstance | null>(null);
const gridX = ref<number>(5);
const gridY = ref<number>(5);
const duration = ref<number>(1000);
const isManual = ref<boolean>(true);
const mainMode = ref<string>("random");
const subMode = ref<string>("");

// Panel-specific computed properties
const autoRevealMode = computed(
  () => mainMode.value + (subMode.value ? `-${subMode.value}` : "")
);

const isSomeRevealed = computed((): boolean => {
  const ctx = panelStore.getContext(currentId.value);
  return ctx
    ? ctx.amount.x * ctx.amount.y > ctx.revealed.length &&
        ctx.revealed.length > 0
    : false;
});

const canShowAll = computed((): boolean => {
  const ctx = panelStore.getContext(currentId.value);
  return ctx && ctx.revealed.length < ctx.amount.x * ctx.amount.y;
});

const canHideAll = computed(
  (): boolean => panelStore.getContext(currentId.value)?.revealed.length > 0
);

const durationSec = computed({
  get: () => duration.value / 1000,
  set: (v) => {
    duration.value = Math.round(v * 1000);
    const ctx = panelStore.getContext(currentId.value);
    if (ctx) {
      panelStore.setContext(currentId.value, {
        ...ctx,
        duration: duration.value,
      });
    }
  },
});

const revealTypeButton = computed(() => ({
  icon: isManual.value ? "PhCursorClick" : "PhClockClockwise",
  tooltip: isManual.value ? t("panel.switchToAuto") : t("panel.switchToManual"),
}));

// Panel-specific methods
const modeGet = (mode: string): string[] => {
  if (mode.startsWith("spiral")) {
    return ["spiral", mode.replace("spiral-", "")];
  } else if (mode.startsWith("linear")) {
    return ["linear", mode.replace("linear-", "")];
  } else {
    return [mode, ""];
  }
};

const handleRevealControl = () => {
  if (!isAutoRevealing.value) {
    if (currentId.value) {
      const ctx = panelStore.getContext(currentId.value);
      if (ctx) {
        panelStore.setContext(currentId.value, {
          ...ctx,
          autoRevealMode: autoRevealMode.value,
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

const handleRevealAll = () => {
  panel.value?.revealAllPanels();
};

const handleCoverAll = () => {
  panel.value?.coverAllPanels();
};

const toggleManualMode = () => {
  isManual.value = !isManual.value;
  const ctx = panelStore.getContext(currentId.value);
  if (ctx) {
    panelStore.setContext(currentId.value, {
      ...ctx,
      isManual: isManual.value,
    });
  }
};

// Watchers
watch([gridX, gridY], ([x, y]) => {
  if (currentId.value) {
    panelStore.setAmount(currentId.value, { x, y });
  }
});

watch(currentId, (id) => {
  const ctx = panelStore.getContext(id);
  if (ctx) {
    duration.value = ctx.duration || 1000;
    isManual.value = ctx.isManual;
    gridX.value = ctx.amount.x;
    gridY.value = ctx.amount.y;
    [mainMode.value, subMode.value] = modeGet(ctx.autoRevealMode);
  }
});

watch(autoRevealMode, () => {
  const ctx = panelStore.getContext(currentId.value);
  if (ctx) {
    panelStore.setContext(currentId.value, {
      ...ctx,
      autoRevealMode: autoRevealMode.value,
    });
  }
});

// Initialize existing images with panel contexts
onMounted(() => {
  const images = imageStore.getAllData();
  if (images.length > 0) {
    images.forEach((image) => {
      if (!panelStore.hasContext(image.id)) {
        panelStore.setContext(image.id, {
          revealed: [],
          isManual: true,
          autoRevealMode: "random",
          amount: { x: gridX.value, y: gridY.value },
          duration: duration.value,
        });
      }
    });
  }
});
</script>
