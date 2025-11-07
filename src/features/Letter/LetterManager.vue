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
        accept=".txt"
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
        <div class="chars-per-row-control">
          <span>{{ t("letter.charsPerRow") }}:</span>
          <el-input-number
            v-model="charsPerRow"
            :min="1"
            :max="100"
            :step="1"
            size="small"
            :disabled="isAutoRevealing"
          />
        </div>
      </div>
    </template>

    <!-- Auto play controls -->
    <template #auto-play-controls>
      <div class="top-bar-section auto-play">
        <div class="duration-control" v-show="!isManual">
          <el-slider
            v-model="durationSec"
            :min="0.01"
            :max="3"
            :step="0.01"
            style="width: 120px"
            :disabled="isManual || isAutoRevealing"
            :show-tooltip="false"
          />
          <el-input-number
            v-model="durationSec"
            :min="0.01"
            :max="3"
            :step="0.01"
            size="small"
            :disabled="isManual || isAutoRevealing"
            style="width: 100px"
          />
        </div>
        <el-select
          class="text-select"
          v-model="autoRevealMode"
          v-show="!isManual"
          size="small"
          :disabled="isAutoRevealing || isManual"
        >
          <el-option
            v-for="mode in revealModes"
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
      <Letter ref="letter" :id="currentId" :isManualMode="isManual" />
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
        :data-store="textStore"
        :extra-store="letterStore"
        data-type="text"
        @select-data="handleDataSelect"
        @add-file="triggerFileInput"
      />
    </template>
  </ManagerLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useTextStore } from "@/stores/dataStore";
import { useLetterStore } from "./stores/letterStore";
import { useManagerBase } from "@/composables/useManagerBase";
import { useI18n } from "vue-i18n";
import Button from "@/components/Button.vue";
import Icon from "@/components/Icon.vue";
import DataSidebar from "@/components/DataSidebar.vue";
import Letter from "./views/Letter.vue";
import ManagerLayout from "@/components/ManagerLayout.vue";
import type { LetterInstance } from "./types/LetterInstance";

const textStore = useTextStore();
const letterStore = useLetterStore();
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
  dataStore: textStore,
  extraStore: letterStore,
  dataType: "text",
  fileAccept: ".txt",
  loadFile: async (file: File) => {
    const { loadTextFile } = await import("@/composables/useTextLoader");
    return await loadTextFile(file);
  },
  onFileAdded: (id: string, status: string) => {
    if (status === "added") {
      // Initialize letterStore context for each text
      const textData = textStore.getData(id);
      if (textData) {
        letterStore.setContext(id, {
          totalChars: textData.content.length,
          charsPerRow: charsPerRow.value,
          revealed: [],
          isManual: isManual.value,
          autoRevealMode: autoRevealMode.value,
          duration: duration.value,
        });
      }
    }
  },
});

// Letter-specific state
const letter = ref<LetterInstance | null>(null);
const charsPerRow = ref<number>(10);
const duration = ref<number>(200);
const isManual = ref<boolean>(true);
const autoRevealMode = ref<string>("random");

// Letter-specific computed properties
const isSomeRevealed = computed((): boolean => {
  const ctx = letterStore.getContext(currentId.value);
  return ctx
    ? ctx.totalChars > ctx.revealed.length && ctx.revealed.length > 0
    : false;
});

const canShowAll = computed((): boolean => {
  const ctx = letterStore.getContext(currentId.value);
  return ctx && ctx.revealed.length < ctx.totalChars;
});

const canHideAll = computed((): boolean => {
  const ctx = letterStore.getContext(currentId.value);
  return ctx ? ctx.revealed.length > 0 : false;
});

const durationSec = computed({
  get: () => duration.value / 1000,
  set: (v) => {
    duration.value = Math.round(v * 1000);
    const ctx = letterStore.getContext(currentId.value);
    if (ctx) {
      letterStore.setContext(currentId.value, {
        ...ctx,
        duration: duration.value,
      });
    }
  },
});

const revealModes = [
  { value: "random", icon: "PhShuffleSimple", label: t("letter.random") },
  { value: "sequential", icon: "PhArrowRight", label: t("letter.sequential") },
  { value: "reverse", icon: "PhArrowLeft", label: t("letter.reverse") },
];

const revealTypeButton = computed(() => ({
  icon: isManual.value ? "PhCursorClick" : "PhClockClockwise",
  tooltip: isManual.value ? t("letter.switchToAuto") : t("letter.switchToManual"),
}));

// Letter-specific methods
const handleRevealControl = () => {
  if (!isAutoRevealing.value) {
    if (currentId.value) {
      const ctx = letterStore.getContext(currentId.value);
      if (ctx) {
        letterStore.setContext(currentId.value, {
          ...ctx,
          autoRevealMode: autoRevealMode.value,
        });
      }
    }
    letter.value?.startAutoReveal();
  } else {
    if (isPaused.value) {
      letter.value?.resumeAutoReveal();
    } else {
      letter.value?.pauseAutoReveal();
    }
  }
};

const handleRevealAll = () => {
  letter.value?.revealAllLetters();
};

const handleCoverAll = () => {
  letter.value?.coverAllLetters();
};

const toggleManualMode = () => {
  isManual.value = !isManual.value;
  const ctx = letterStore.getContext(currentId.value);
  if (ctx) {
    letterStore.setContext(currentId.value, {
      ...ctx,
      isManual: isManual.value,
    });
  }
};

// Watch for changes to charsPerRow and update letter store
watch(charsPerRow, (newValue) => {
  if (currentId.value) {
    letterStore.setCharsPerRow(currentId.value, newValue);
  }
});

// Watch for currentId changes and sync local state with store
watch(currentId, (id) => {
  const ctx = letterStore.getContext(id);
  if (ctx) {
    duration.value = ctx.duration || 200;
    isManual.value = ctx.isManual;
    charsPerRow.value = ctx.charsPerRow;
    autoRevealMode.value = ctx.autoRevealMode;
  }
});

// Watch for autoRevealMode changes and update store
watch(autoRevealMode, () => {
  const ctx = letterStore.getContext(currentId.value);
  if (ctx) {
    letterStore.setContext(currentId.value, {
      ...ctx,
      autoRevealMode: autoRevealMode.value,
    });
  }
});
</script>

<style scoped>
.chars-per-row-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  margin-right: 0.5rem;
}

.duration-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
