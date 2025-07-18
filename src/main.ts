import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import ElementPlus from "element-plus";
import i18n from "./i18n";
import "./index.scss";
import "./style.css";

const currentLang =
  localStorage.getItem("language") || navigator.language.toLowerCase();
document.querySelector("html")?.setAttribute("lang", currentLang);

const app = createApp(App);
app.use(createPinia());
app.use(ElementPlus);
app.use(i18n);
app.mount("#app");
