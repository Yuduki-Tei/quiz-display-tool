import { useSessionStore } from "@/stores/sessionStore";
import { getSocket } from "@/realtime/socket";
import { LetterChannels } from "@/realtime/letterChannel";
import { applyLetterSnapshot } from "@/realtime/letterSnapshotService";
import { applyLetterPatchOps } from "@/realtime/letterSync";

let viewerInstalled = false;
export function installLetterViewerAdapter() {
  if (viewerInstalled) return;
  const session = useSessionStore();
  const socket = getSocket();
  if (!socket || !session.isViewer()) return;
  viewerInstalled = true;

  // Request snapshot after joining
  socket.emit(LetterChannels.RequestSnapshot, { roomId: session.roomId });

  socket.on(LetterChannels.Snapshot, ({ snapshot }: any) => {
    if (session.isViewer()) {
      applyLetterSnapshot(snapshot);
    }
  });

  socket.on(LetterChannels.Patch, ({ ops }: any) => {
    if (session.isViewer()) {
      applyLetterPatchOps(ops);
    }
  });
}
