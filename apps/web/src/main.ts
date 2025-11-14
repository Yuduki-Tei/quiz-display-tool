import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router";
import "./index.scss";
import "./style.css";
import { installRouteSync } from "@/realtime/socket";
import { installLetterAdapters } from "@/realtime/installLetterAdapters";

const currentLang =
  localStorage.getItem("language") || navigator.language.toLowerCase();
document.querySelector("html")?.setAttribute("lang", currentLang);

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.mount("#app");

// Multiplayer related installations (lazy after app init)
installRouteSync();
// Use framework path (pass false to fallback to legacy adapters if needed)
installLetterAdapters(true);
