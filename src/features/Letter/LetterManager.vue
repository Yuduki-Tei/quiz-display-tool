<template>
  <el-container class="manager-layout">
    <el-main class="manager-main">
      <div class="manager-top-bar">
        <div class="manager-top-bar-left">
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
          <Button
            type="primary"
            @click="triggerFileInput"
            icon="PhPlus"
            :disabled="isAutoRevealing"
          />
          <el-divider direction="vertical" />
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
        <div class="top-bar-center">
          <Button
            @click="handleRevealControl"
            :disabled="isManual || !canShowAll"
            :icon="isAutoRevealing && !isPaused ? 'PhPause' : 'PhPlay'"
          />
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
          <el-divider direction="vertical" />
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
          <el-divider direction="vertical" v-show="!isManual" />
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
        </div>
        <div class="top-bar-right">
          <el-select
            class="text-select"
            v-model="autoRevealMode"
            size="small"
            :disabled="isAutoRevealing || isManual"
            v-show="!isManual"
            :placeholder="t('letter.selectMode')"
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
        <div class="placeholder">Letter display component will go here</div>
      </div>
    </el-main>
  </el-container>
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
    />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useTextStore } from "@/stores/imageStore";
import { useLetterStore } from "./stores/letterStore";
import { useI18n } from "vue-i18n";
import Button from "@/components/Button.vue";
import Icon from "@/components/Icon.vue";
import DataSidebar from "@/components/DataSidebar.vue";

const textStore = useTextStore();
const letterStore = useLetterStore();
const { t } = useI18n();
const { canGoPrev, canGoNext, currentData } = storeToRefs(textStore);

const fileInput = ref<HTMLInputElement | null>(null);
const currentId = computed((): string | null => currentData.value?.id || null);
const isSidebarVisible = ref(false);
const charsPerRow = ref<number>(10);
const duration = ref<number>(1000);
const isManual = ref<boolean>(true);
const autoRevealMode = ref<string>("random");
const isAutoRevealing = ref<boolean>(false);
const isPaused = ref<boolean>(false);

const isSomeRevealed = computed((): boolean => {
  // TODO: implement with letterStore
  return false;
});

const canShowAll = computed((): boolean => {
  // TODO: implement with letterStore
  return true;
});

const canHideAll = computed((): boolean => {
  // TODO: implement with letterStore
  return false;
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
      textStore.addData(textData);
      // TODO: initialize letterStore context for each text
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
  // TODO: implement auto reveal logic
  console.log("handleRevealControl");
};

const handleRevealAll = () => {
  // TODO: implement reveal all logic
  console.log("handleRevealAll");
};

const handleCoverAll = () => {
  // TODO: implement cover all logic
  console.log("handleCoverAll");
};

const toggleManualMode = () => {
  isManual.value = !isManual.value;
  // TODO: update letterStore context
};

const durationSec = computed({
  get: () => duration.value / 1000,
  set: (v) => {
    duration.value = Math.round(v * 1000);
    // TODO: update letterStore context
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
</script>

<style scoped>
.chars-per-row-control {
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
