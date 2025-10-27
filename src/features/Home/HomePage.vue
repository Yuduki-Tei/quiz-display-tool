<template>
  <div class="home-page">
    <!-- 圖片Quiz顯示工具 -->
    <div class="quiz-section">
      <h2 class="section-title">{{ t("home.imageQuiz") }}</h2>
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

    <!-- 文字Quiz顯示工具 -->
    <div class="quiz-section">
      <h2 class="section-title">{{ t("home.textQuiz") }}</h2>
      <div class="mode-selection" role="group" :aria-label="t('aria.selectMode')">
        <button
          class="mode-card"
          @click="selectMode('text-panel')"
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
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import Icon from "@/components/Icon.vue";

const { t } = useI18n();
const router = useRouter();

const selectMode = (mode: "zoomer" | "panel" | "text-panel") => {
  router.push(`/${mode}`);
};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem 0;
}

.quiz-section {
  margin-bottom: 3rem;
  width: 100%;
  max-width: 800px;
}

.quiz-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.mode-selection {
  display: flex;
  gap: 2rem;
  justify-content: center;
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
