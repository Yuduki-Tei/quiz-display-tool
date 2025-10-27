<template>
  <div id="app">
    <div
      v-if="$route.name !== 'home'"
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
      <LanguageSelector v-if="$route.name === 'home'" />
    </div>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import Button from "@/components/Button.vue";
import LanguageSelector from "@/components/LanguageSelector.vue";

const { t } = useI18n();
const router = useRouter();

const backToHome = () => {
  router.push("/");
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
