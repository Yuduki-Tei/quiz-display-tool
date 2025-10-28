<template>
  <div id="app">
    <div
      v-if="$route.name !== 'home'"
      style="position: fixed; bottom: 10px; right: 10px; z-index: 2000"
      class="home-button-container"
    ></div>

    <div class="language-controls">
      <LanguageSelector v-if="$route.name === 'home'" />
    </div>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import LanguageSelector from "@/components/LanguageSelector.vue";
</script>

<style scoped>
.language-controls {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 2000;
}
</style>
