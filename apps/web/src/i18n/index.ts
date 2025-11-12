import { createI18n } from "vue-i18n";
import en from "./en";
import ja from "./ja";
import zhTW from "./zh-TW";

const getBrowserLanguage = () => {
  const navigatorLanguage = navigator.language.toLowerCase();

  const supportedLanguages = ["en", "ja", "zh-tw"];

  if (supportedLanguages.includes(navigatorLanguage)) {
    return navigatorLanguage;
  }

  const languageCode = navigatorLanguage.split("-")[0];
  const matchingLang = supportedLanguages.find((lang) =>
    lang.startsWith(languageCode)
  );

  return matchingLang || "zh-tw";
};

const getSavedLanguage = () => {
  return localStorage.getItem("language") || getBrowserLanguage();
};

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getSavedLanguage(),
  fallbackLocale: "zh-tw",
  messages: {
    en,
    ja,
    "zh-tw": zhTW,
  },
});

export default i18n;

export function setLanguage(lang: "en" | "ja" | "zh-tw") {
  i18n.global.locale.value = lang;
  localStorage.setItem("language", lang);
  document.querySelector("html")?.setAttribute("lang", lang);
}
