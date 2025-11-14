import { useSessionStore } from "@/stores/sessionStore";
import { useTextStore } from "@/stores/dataStore";
import { useLetterStore } from "@/features/Letter/stores/letterStore";
import type { LetterContext } from "@/features/Letter/types/LetterTypes";
import { getSocket, onJoined } from "./socket";
import {
  buildLetterSnapshot,
  applyLetterSnapshot,
} from "./letterSnapshotService";
import { LetterChannels } from "./letterChannel";

// Snapshot structure sent from host to a viewer
export interface LetterSnapshotItem {
  id: string;
  name: string;
  content: string;
  thumbnailSrc: string | null;
  context: LetterContext;
}

export interface LetterSnapshot {
  items: LetterSnapshotItem[];
  currentId: string | null;
}

// Patch operations for incremental updates
export type LetterPatchOp =
  | { type: "addContext"; item: LetterSnapshotItem }
  | { type: "removeContext"; id: string }
  | { type: "patchContext"; id: string; partial: Partial<LetterContext> }
  | { type: "appendRevealed"; id: string; indices: number[] }
  | { type: "setRevealed"; id: string; revealed: number[] }
  | { type: "setCurrent"; id: string | null };

// Apply patch operations (viewer)
export function applyLetterPatchOps(ops: LetterPatchOp[]) {
  const textStore = useTextStore();
  const letterStore = useLetterStore();

  for (const op of ops) {
    switch (op.type) {
      case "addContext": {
        const { item } = op;
        // Add text data if missing
        if (!textStore.getData(item.id)) {
          textStore.addData({
            id: item.id,
            name: item.name,
            content: item.content,
            thumbnailSrc: item.thumbnailSrc,
            type: "text",
          } as any);
        }
        letterStore.setContext(item.id, { ...item.context });
        break;
      }
      case "removeContext": {
        // Remove from text store + letter context
        textStore.removeData(op.id);
        // Cannot directly delete context via store API, but can set empty revealed
        const ctx = letterStore.getContext(op.id);
        if (ctx) {
          letterStore.setContext(op.id, { ...ctx, revealed: [] });
        }
        break;
      }
      case "patchContext": {
        const ctx = letterStore.getContext(op.id);
        if (ctx) {
          letterStore.setContext(op.id, { ...ctx, ...op.partial });
        }
        break;
      }
      case "appendRevealed": {
        const ctx = letterStore.getContext(op.id);
        if (ctx) {
          const merged = Array.from(
            new Set([...ctx.revealed, ...op.indices])
          ).sort((a, b) => a - b);
          letterStore.setContext(op.id, { ...ctx, revealed: merged });
        }
        break;
      }
      case "setRevealed": {
        const ctx = letterStore.getContext(op.id);
        if (ctx) {
          letterStore.setContext(op.id, { ...ctx, revealed: [...op.revealed] });
        }
        break;
      }
      case "setCurrent": {
        if (op.id) textStore.setCurrentById(op.id);
        break;
      }
    }
  }
}

// Install listeners & auto request snapshot for viewers
export function installLetterSync() {
  const session = useSessionStore();
  const socket = getSocket();
  if (!socket) return;

  // When joined, viewer requests snapshot
  onJoined(() => {
    if (session.isViewer()) {
      socket.emit("letter:snapshot:request", { roomId: session.roomId });
    }
  });

  // Receive snapshot
  socket.on(
    LetterChannels.Snapshot,
    ({ snapshot }: { snapshot: LetterSnapshot }) => {
      if (session.isViewer()) {
        applyLetterSnapshot(snapshot);
      }
    }
  );

  // Receive patches
  socket.on(LetterChannels.Patch, ({ ops }: { ops: LetterPatchOp[] }) => {
    if (session.isViewer()) {
      applyLetterPatchOps(ops);
    }
  });

  // Host responds to snapshot requests
  socket.on(
    LetterChannels.RequestSnapshot,
    ({ requester, roomId }: { requester: string; roomId: string }) => {
      if (session.role === "host" && roomId === session.roomId) {
        const snapshot = buildLetterSnapshot();
        socket.emit(LetterChannels.Snapshot, {
          roomId,
          to: requester,
          snapshot,
        });
      }
    }
  );
}

// Host helper to emit patch operations
export function emitLetterPatch(ops: LetterPatchOp[]) {
  const session = useSessionStore();
  const socket = getSocket();
  if (!socket || !session.roomId || session.role !== "host") return;
  socket.emit(LetterChannels.Patch, { roomId: session.roomId, ops });
}
