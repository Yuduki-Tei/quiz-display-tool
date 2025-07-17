<template>
  <div class="home-page">
    <div class="mode-selection">
      <div class="mode-card" @click="selectMode('zoomer')">
        <Icon name="PhPictureInPicture" size="128" />
      </div>
      <div class="mode-card" @click="selectMode('panel')">
        <Icon name="PhCheckerboard" size="128" />
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

h1 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
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
}

.mode-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.5);
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

p {
  line-height: 1.5;
}
</style>
