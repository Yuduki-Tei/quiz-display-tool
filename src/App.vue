<template>
  <div id="app">
    <div style="position: fixed; bottom: 10px; right: 10px; z-index: 2000">
      <button @click="toggleManager" style="padding: 0.5em 1em">
        {{ showPanel ? "切換 Zoomer" : "切換 Panel" }}
      </button>
    </div>
    <!-- <ZoomerManager v-if="!showPanel" /> -->
    <PanelManager />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ZoomerManager from "./features/Zoomer/ZoomerManager.vue";
import PanelManager from "./features/Panel/PanelManager.vue";

const showPanel = ref(false);
const toggleManager = () => {
  showPanel.value = !showPanel.value;
};
</script>

<style scoped>
.theme-switch-bar {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem 1rem;
}
</style>
