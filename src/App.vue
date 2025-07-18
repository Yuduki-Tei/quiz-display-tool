<template>
  <div id="app">
    <div
      v-if="!showHome"
      style="position: fixed; bottom: 10px; right: 10px; z-index: 2000"
    >
      <Button @click="backToHome" icon="PhHouse" />
    </div>
    <HomePage v-if="showHome" @select-mode="selectMode" />
    <ZoomerManager v-else-if="currentMode === 'zoomer'" />
    <PanelManager v-else-if="currentMode === 'panel'" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/Button.vue";
import ZoomerManager from "./features/Zoomer/ZoomerManager.vue";
import PanelManager from "./features/Panel/PanelManager.vue";
import HomePage from "./features/Home/HomePage.vue";

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