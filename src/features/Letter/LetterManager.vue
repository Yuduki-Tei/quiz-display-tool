<template>
  <el-container class="manager-layout">
    <el-main class="manager-main">
      <div class="manager-top-bar">
        <div class="top-bar-section file-utils">
          <Button
            @click="isSidebarVisible = true"
            icon="PhSidebarSimple"
            :disabled="isAutoRevealing"
          />
          <input
            ref="fileInput"
            type="file"
            accept=".txt"
            @change="onFileChange"
            style="display: none"
          />
          <el-button-group>
            <Button
              @click="goToPrev"
              :disabled="!canGoPrev"
              icon="PhArrowLeft"
            />
            <Button
              @click="goToNext"
              :disabled="!canGoNext"
              icon="PhArrowRight"
            />
          </el-button-group>
        </div>
        <el-divider direction="vertical" />
        <div class="top-bar-section common-utils">
          <el-button-group>
            <Button
              @click="handleCoverAll"
              icon="PhEyeClosed"
              :disabled="!canHideAll"
            />
            <Button
              @click="handleRevealAll"
              icon="PhFrameCorners"
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
        <el-divider direction="vertical" />
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
        <el-divider direction="vertical" />
        <div class="top-bar-section mode-toggle">
          <Button
            :icon="revealTypeButtons.find((b) => b.value === isManual)?.icon"
            :title="
              revealTypeButtons.find((b) => b.value === isManual)?.tooltip
            "
            @click="toggleManualMode"
            :disabled="isAutoRevealing || isSomeRevealed"
          />
        </div>
      </div>
      <div class="display-area">
        <Letter ref="letter" :id="currentId" :isManualMode="isManual" />
      </div>
    </el-main>
  </el-container>
  <div v-if="!isManual" class="floating-play-button">
    <Button
      @click="handleRevealControl"
      :icon="isAutoRevealing && !isPaused ? 'PhPause' : 'PhPlay'"
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
      :data-store="textStore"
      :extra-store="letterStore"
      data-type="text"
      @select-data="handleTextSelect"
      @add-file="triggerFileInput"
    />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useTextStore } from "@/stores/imageStore";
import { useLetterStore } from "./stores/letterStore";
import { useI18n } from "vue-i18n";
import Button from "@/components/Button.vue";
import Icon from "@/components/Icon.vue";
import DataSidebar from "@/components/DataSidebar.vue";
import Letter from "./views/Letter.vue";

const textStore = useTextStore();
const letterStore = useLetterStore();
const { t } = useI18n();
const { canGoPrev, canGoNext, currentData } = storeToRefs(textStore);
const { isAutoRevealing, isPaused } = storeToRefs(letterStore);

const letter = ref<InstanceType<typeof Letter> | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const currentId = computed((): string | null => currentData.value?.id || null);
const isSidebarVisible = ref(false);
const charsPerRow = ref<number>(10);
const duration = ref<number>(200);
const isManual = ref<boolean>(true);
const autoRevealMode = ref<string>("random");

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

const triggerFileInput = () => {
  fileInput.value?.click();
};

const onFileChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || !files[0]) return;
  const file = files[0];

  try {
    const { loadTextFile } = await import("@/composables/useTextLoader");
    const textDataArray = await loadTextFile(file);

    // Add each line as a separate text data entry
    textDataArray.forEach((textData) => {
      const status = textStore.addData(textData);
      if (status === "added" && textData.id) {
        // Initialize letterStore context for each text
        letterStore.setContext(textData.id, {
          totalChars: textData.content.length,
          charsPerRow: charsPerRow.value,
          revealed: [],
          isManual: isManual.value,
          autoRevealMode: autoRevealMode.value,
          duration: duration.value,
        });
      }
    });
  } catch (err) {
    console.error("Failed to load text file:", err);
  }

  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const goToPrev = () => {
  textStore.goToPrev();
};

const goToNext = () => {
  textStore.goToNext();
};

const handleTextSelect = (id: string) => {
  textStore.setCurrentById(id);
  isSidebarVisible.value = false;
};

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

const revealTypeButtons = [
  { value: true, icon: "PhCursorClick", tooltip: t("letter.manual") },
  { value: false, icon: "PhClockClockwise", tooltip: t("letter.auto") },
];

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
}

.duration-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.placeholder,
.sidebar-placeholder {
  color: var(--el-text-color-secondary);
  font-size: 1.2rem;
}

.sidebar-placeholder {
  padding: 20px;
  text-align: center;
}
.chars-per-row-control {
  white-space: nowrap;
  margin-right: 0.5rem;
}
</style>
