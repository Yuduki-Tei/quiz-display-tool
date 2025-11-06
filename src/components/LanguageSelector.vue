<template>
  <div class="language-selector">
    <Button
      icon="PhTranslate"
      @click="cycleLanguage"
      :title="getCurrentLanguageName()"
      tooltipPlacement="left"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { setLanguage } from "@/i18n";
import Button from "./Button.vue";
import { useNotifier } from "@/composables/useNotifier";

const { locale, t } = useI18n();
const currentLanguage = ref(locale.value);
const { notify } = useNotifier();

const availableLanguages = [
  { code: "zh-tw", label: "中文", name: "繁體中文" },
  { code: "ja", label: "日本語", name: "日本語" },
  { code: "en", label: "English", name: "English" },
];

onMounted(() => {
  currentLanguage.value = locale.value;
});

const getCurrentLanguageName = () => {
  const lang = availableLanguages.find((l) => l.code === currentLanguage.value);
  return lang ? lang.name : "";
};

const cycleLanguage = () => {
  const currentIndex = availableLanguages.findIndex(
    (l) => l.code === currentLanguage.value
  );
  const nextIndex = (currentIndex + 1) % availableLanguages.length;
  const nextLang = availableLanguages[nextIndex].code;

  changeLanguage(nextLang);

  notify("info", {
    mode: "message",
    message: getCurrentLanguageName(),
  });
};

const changeLanguage = (lang: any) => {
  if (!availableLanguages.map((l) => l.code).includes(lang)) {
    lang = "zh-tw";
  }
  setLanguage(lang);
  currentLanguage.value = lang;
};
</script>
