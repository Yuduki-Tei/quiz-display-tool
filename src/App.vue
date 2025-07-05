<template>
  <div id="app">
    <ZoomerManager />
  </div>
</template>

<script setup lang="ts">
import ZoomerManager from "./features/Zoomer/ZoomerManager.vue";
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
