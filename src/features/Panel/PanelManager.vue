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
          <Button
            type="primary"
            @click="handleRevealControl"
            :disabled="isManual"
            :icon="isRevealing && !isPaused ? 'PhPause' : 'PhPlay'"
          />
          <el-button-group>
            <Button
              type="warning"
              @click="handleCoverAll"
              icon="PhEyeClosed"
              :disabled="!canHideAll"
            />
            <Button
              type="warning"
              @click="handleRevealAll"
              icon="PhFrameCorners"
              :disabled="!canShowAll"
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
            <Icon name="PhX" />
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
              :min="0.1"
              :max="10"
              :step="0.1"
              style="width: 120px"
              :disabled="isManual || isRevealing"
              :show-tooltip="false"
            />
            <el-input-number
              v-model="durationSec"
              :min="0.1"
              :max="10"
              :step="0.1"
              size="small"
              :disabled="isManual || isRevealing"
            />
          </div>
        </div>
        <div class="top-bar-right">
          <el-select
            v-model="autoRevealMode"
            size="small"
            :disabled="isRevealing || isManual"
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
            :icon="revealTypeButtons.find((b) => b.value === isManual)?.icon"
            :title="
              revealTypeButtons.find((b) => b.value === isManual)?.tooltip
            "
            @click="toggleManualMode"
            :disabled="isRevealing"
          />
        </div>
      </div>
      <div class="display-area">
        <Panel ref="panel" :id="currentId" :isManualMode="isManual" />
      </div>
    </el-main>
  </el-container>
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
import { useNotifier } from "@/composables/useNotifier";
import Panel from "../Panel/views/Panel.vue";
import ImageSidebar from "@/components/ImageSidebar.vue";
import Button from "@/components/Button.vue";
import Icon from "@/components/Icon.vue";

const imageStore = useImageStore();
const panelStore = usePanelStore();
const { canGoPrev, canGoNext, currentImage } = storeToRefs(imageStore);
const { isRevealing, isPaused } = storeToRefs(panelStore);

const panel = ref<InstanceType<typeof Panel> | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const currentId = computed((): string | null => currentImage.value?.id || null);
const { notify } = useNotifier();
const isSidebarVisible = ref(false);
const gridX = ref<number>(5);
const gridY = ref<number>(5);
const duration = ref<number>(1000);
const isManual = ref<boolean>(true);
const autoRevealMode = ref<string>("random");
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
        isManual: true,
        autoRevealMode: "random",
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
  if (!isRevealing.value) {
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

const durationSec = computed({
  get: () => duration.value / 1000,
  set: (v) => {
    duration.value = Math.round(v * 1000);
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
  { value: true, icon: "PhHandPointing", tooltip: "手動めくりモード" },
  { value: false, icon: "PhPlayCircle", tooltip: "自動めくりモード" },
];

const toggleManualMode = () => {
  isManual.value = !isManual.value;

  if (currentId.value) {
    const ctx = panelStore.getContext(currentId.value);
    if (ctx) {
      panelStore.setContext(currentId.value, {
        ...ctx,
        isManual: isManual.value,
      });
    }
  }
};

const canShowAll = computed(
  (): boolean =>
    panelStore.getContext(currentId.value)?.revealed.length <=
    panelStore.getContext(currentId.value)?.amount.x *
      panelStore.getContext(currentId.value)?.amount.x
);
const canHideAll = computed(
  (): boolean => panelStore.getContext(currentId.value)?.revealed.length > 0
);

watch([gridX, gridY, currentId], ([x, y, id]) => {
  if (id) {
    panelStore.setAmount(id, { x, y });
  }
});

watch(currentId, (id) => {
  if (id) {
    const ctx = panelStore.getContext(id);
    if (ctx) {
      duration.value = ctx.duration || 5000;
      isManual.value = ctx.isManual;
      autoRevealMode.value = ctx.autoRevealMode;
    }
  }
});

watch(autoRevealMode, (newMode) => {
  if (currentId.value) {
    const ctx = panelStore.getContext(currentId.value);
    if (ctx) {
      panelStore.setContext(currentId.value, {
        ...ctx,
        autoRevealMode: newMode,
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
