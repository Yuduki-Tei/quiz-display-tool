import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/features/Home/HomePage.vue";
import ZoomerManager from "@/features/Zoomer/ZoomerManager.vue";
import PanelManager from "@/features/Panel/PanelManager.vue";

const router = createRouter({
  history: createWebHistory("/quiz-display-tool/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/zoomer",
      name: "zoomer",
      component: ZoomerManager,
    },
    {
      path: "/panel",
      name: "panel",
      component: PanelManager,
    },
  ],
});

export default router;