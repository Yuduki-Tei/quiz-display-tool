<template>
  <div class="home-page">
    <div class="mode-selection">
      <div class="mode-card" @click="selectMode('zoomer')">
        <Icon name="PhPictureInPicture" size="128" color="#039390" />
      </div>
      <div class="mode-card" @click="selectMode('panel')">
        <Icon name="PhCheckerboard" size="128" color="#039390" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";
import Icon from "@/components/Icon.vue";

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
  content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  border: solid 1px;
  border-color: var(--el-border-color);
}

.mode-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 10px var(--el-color-primary-dark-2);
}
</style>
