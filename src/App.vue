<template>
  <div id="app">
    <div
      v-if="!showHome"
      style="position: fixed; bottom: 10px; right: 10px; z-index: 2000"
      class="home-button-container"
    >
      <Button
        @click="backToHome"
        icon="PhHouse"
        :aria-label="t('aria.homeButton')"
        role="button"
      />
    </div>

    <div class="language-controls">
      <LanguageSelector v-if="showHome" />
    </div>

    <main>
      <HomePage v-if="showHome" @select-mode="selectMode" />
      <ZoomerManager v-else-if="currentMode === 'zoomer'" />
      <PanelManager v-else-if="currentMode === 'panel'" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Button from "@/components/Button.vue";
import LanguageSelector from "@/components/LanguageSelector.vue";
import ZoomerManager from "./features/Zoomer/ZoomerManager.vue";
import PanelManager from "./features/Panel/PanelManager.vue";
import HomePage from "./features/Home/HomePage.vue";

const { t } = useI18n();
const showHome = ref(true);
const currentMode = ref<"zoomer" | "panel">("zoomer");

const selectMode = (mode: "zoomer" | "panel") => {
  currentMode.value = mode;
  showHome.value = false;
};

const backToHome = () => {
  showHome.value = true;
};
</script>

<style scoped>
.language-controls {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 2000;
}

.skip-link-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
}

.skip-link {
  background: var(--el-color-primary);
  color: white;
  padding: 8px 16px;
  position: absolute;
  transform: translateY(-100%);
  transition: transform 0.3s;
  left: 0;
  top: 0;
}

.skip-link:focus {
  transform: translateY(0);
}
</style>
