import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/features/Home/HomePage.vue";
import ZoomerManager from "@/features/Zoomer/ZoomerManager.vue";
import PanelManager from "@/features/Panel/PanelManager.vue";
import LetterManager from "@/features/Letter/LetterManager.vue";
import { useConnectionService } from "@/services/ConnectionService";

let isViewerSyncNavigation = false;

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
    {
      path: "/text-panel",
      name: "text-panel",
      component: LetterManager,
    },
  ],
});

// Setup route synchronization
const connectionService = useConnectionService();

// Host: emit route changes to viewers
router.afterEach((to) => {
  if (!isViewerSyncNavigation && connectionService.isHost()) {
    const query =
      Object.keys(to.query).length > 0
        ? (to.query as Record<string, string>)
        : undefined;
    connectionService.emitRouteChange(to.path, query);
    console.log("[Router] Host navigated, emitting route change:", to.path);
  }
});

// Viewer: listen for route sync from host
connectionService.onRouteSync((data) => {
  if (connectionService.isViewer()) {
    console.log("[Router] Viewer received route sync:", data);
    isViewerSyncNavigation = true;
    router.push({ path: data.path, query: data.query }).then(() => {
      isViewerSyncNavigation = false;
    });
  }
});

export default router;