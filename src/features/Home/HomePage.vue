<template>
  <div class="home-page">
    <h1 class="title">{{ t("home.title") }}</h1>
    <div class="mode-selection" role="group" :aria-label="t('aria.selectMode')">
      <button
        class="mode-card"
        @click="selectMode('zoomer')"
        :aria-label="t('home.zoomerMode')"
        tabindex="0"
        role="button"
      >
        <Icon
          name="PhPictureInPicture"
          size="128"
          color="#039390"
          aria-hidden="true"
        />
        <span class="mode-name">{{ t("home.zoomerMode") }}</span>
      </button>
      <button
        class="mode-card"
        @click="selectMode('panel')"
        :aria-label="t('home.panelMode')"
        tabindex="0"
        role="button"
      >
        <Icon
          name="PhCheckerboard"
          size="128"
          color="#039390"
          aria-hidden="true"
        />
        <span class="mode-name">{{ t("home.panelMode") }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Icon from "@/components/Icon.vue";

const { t } = useI18n();
const emit = defineEmits<{
  (e: "select-mode", mode: "zoomer" | "panel"): void;
}>();

const selectMode = (mode: "zoomer" | "panel") => {
  emit("select-mode", mode);
};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.mode-selection {
  display: flex;
  gap: 2rem;
}

.mode-card {
  border-radius: 8px;
  padding: 2rem;
  width: 300px;
  cursor: pointer;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  border: solid 1px;
  border-color: var(--el-border-color);
  background: none;
}

.mode-name {
  font-size: 1.25rem;
  margin-top: 1rem;
  font-weight: 600;
}

.mode-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 10px var(--el-color-primary-dark-2);
}
</style>
