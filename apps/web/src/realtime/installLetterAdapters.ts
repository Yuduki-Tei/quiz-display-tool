import { onJoined, getSocket } from "@/realtime/socket";
import { installLetterHostAdapter } from "@/realtime/adapters/letterHostAdapter";
import { installLetterViewerAdapter } from "@/realtime/adapters/letterViewerAdapter";
import { useSessionStore } from "@/stores/sessionStore";
import { installSyncFeature } from "@/realtime/framework";
import { letterFrameworkConfig } from "@/realtime/letterFrameworkConfig";

// Install appropriate adapter after join event
export function installLetterAdapters(useFramework = true) {
  onJoined(() => {
    const session = useSessionStore();
    const socket = getSocket();
    if (!socket || !session.roomId || !session.role) return;
    if (useFramework) {
      installSyncFeature(letterFrameworkConfig, {
        role: session.role,
        socket,
        roomId: session.roomId,
      });
    } else {
      if (session.role === "host") installLetterHostAdapter();
      else if (session.isViewer()) installLetterViewerAdapter();
    }
  });
}
