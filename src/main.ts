import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import ElementPlus from "element-plus";
import './index.scss'

const app = createApp(App);
app.use(createPinia());
app.use(ElementPlus);
app.mount("#app");
