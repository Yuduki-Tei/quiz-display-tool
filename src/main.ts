import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./style.css";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css"; // 追加: ダークテーマ用CSS

const app = createApp(App);
app.use(createPinia());
app.use(ElementPlus);
app.mount("#app");
