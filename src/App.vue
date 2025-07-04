<template>
  <div id="app">
    <div class="theme-switch-bar">
      <el-switch v-model="isDark" active-text="🌙 暗色模式" inactive-text="☀️ 亮色模式" @change="toggleTheme" />
    </div>
    <ZoomerManager />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import ZoomerManager from "./features/Zoomer/ZoomerManager.vue";

const isDark = ref(true);

const toggleTheme = () => {
  const html = document.documentElement;
  if (isDark.value) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
};

watch(isDark, toggleTheme, { immediate: true });
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
