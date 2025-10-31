<template>
  <el-container class="manager-layout">
    <el-main class="manager-main">
      <div class="manager-top-bar">
        <div class="top-bar-section file-utils">
          <Button
            @click="isSidebarVisible = true"
            icon="PhSidebarSimple"
            :title="t('sidebar.openSidebar')"
            :disabled="isAutoRevealing"
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
        <el-divider direction="vertical" />
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

        <el-divider direction="vertical" />
        <div class="top-bar-section mode-toggle">
          <Button
            :icon="revealTypeButton.icon"
            :title="revealTypeButton.tooltip"
            tooltipPlacement="left"
            @click="toggleManualMode"
            :disabled="isAutoRevealing || isSomeRevealed"
          />
        </div>
      </div>
      <div class="display-area">
        <Panel ref="panel" :id="currentId" :isManualMode="isManual" />
      </div>
    </el-main>
  </el-container>
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

  <el-drawer
    v-model="isSidebarVisible"
    direction="ltr"
    size="280px"
    :with-header="false"
  >
    <DataSidebar
      :current-id="currentId"
      :data-store="imageStore"
      :extra-store="panelStore"
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
import { usePanelStore } from "./stores/panelStore";
import { loadImageFile } from "@/composables/useImageLoader";
import {
  getMainRevealModes,
  getSpiralSubModes,
  getLinearSubModes,
} from "./composables/revealPatterns";
import { useNotifier } from "@/composables/useNotifier";
import Panel from "../Panel/views/Panel.vue";
import DataSidebar from "@/components/DataSidebar.vue";
import { useI18n } from "vue-i18n";
import Button from "@/components/Button.vue";
import Icon from "@/components/Icon.vue";

const imageStore = useImageStore();
const panelStore = usePanelStore();
const { t } = useI18n();
const { canGoPrev, canGoNext, currentData } = storeToRefs(imageStore);
const { isAutoRevealing, isPaused } = storeToRefs(panelStore);

const panel = ref<InstanceType<typeof Panel> | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const currentId = computed((): string | null => currentData.value?.id || null);
const isSomeRevealed = computed((): boolean => {
  const ctx = panelStore.getContext(currentId.value);
  return ctx
    ? ctx.amount.x * ctx.amount.y > ctx.revealed.length &&
        ctx.revealed.length > 0
    : false;
});
const { notify } = useNotifier();
const isSidebarVisible = ref(false);
const gridX = ref<number>(5);
const gridY = ref<number>(5);
const duration = ref<number>(1000);
const isManual = ref<boolean>(true);
const mainMode = ref<string>("random");
const subMode = ref<string>("");
const autoRevealMode = computed(
  () => mainMode.value + (subMode.value ? `-${subMode.value}` : "")
);

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
        isManual: isManual.value,
        autoRevealMode: autoRevealMode.value,
        duration: duration.value,
        amount: { x: gridX.value, y: gridY.value },
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

const modeGet = (mode: string): string[] => {
  if (mode.startsWith("spiral")) {
    return ["spiral", mode.replace("spiral-", "")];
  } else if (mode.startsWith("linear")) {
    return ["linear", mode.replace("linear-", "")];
  } else {
    return [mode, ""];
  }
};

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

const canShowAll = computed((): boolean => {
  const ctx = panelStore.getContext(currentId.value);
  return ctx && ctx.revealed.length < ctx.amount.x * ctx.amount.y;
});
const canHideAll = computed(
  (): boolean => panelStore.getContext(currentId.value)?.revealed.length > 0
);

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
