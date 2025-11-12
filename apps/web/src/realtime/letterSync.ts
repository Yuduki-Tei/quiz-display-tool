import { useSessionStore } from '@/stores/sessionStore';
import { useTextStore } from '@/stores/dataStore';
import { useLetterStore } from '@/features/Letter/stores/letterStore';
import type { LetterContext } from '@/features/Letter/types/LetterTypes';
import { getSocket, onJoined } from './socket';

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
  | { type: 'addContext'; item: LetterSnapshotItem }
  | { type: 'removeContext'; id: string }
  | { type: 'patchContext'; id: string; partial: Partial<LetterContext> }
  | { type: 'appendRevealed'; id: string; indices: number[] }
  | { type: 'setRevealed'; id: string; revealed: number[] }
  | { type: 'setCurrent'; id: string | null };

// Build a full snapshot of current letter/text state (host only)
export function buildLetterSnapshot(): LetterSnapshot {
  const textStore = useTextStore();
  const letterStore = useLetterStore();
  const allText = textStore.getAllData();
  const items: LetterSnapshotItem[] = allText.map((t) => {
    const ctx = letterStore.getContext(t.id) || {
      totalChars: t.content.length,
      charsPerRow: 10,
      revealed: [],
      isManual: true,
      autoRevealMode: 'random',
    } as LetterContext;
    return {
      id: t.id,
      name: (t as any).name || t.id,
      content: t.content,
      thumbnailSrc: (t as any).thumbnailSrc || null,
      context: ctx,
    };
  });
  const current = textStore.currentData?.id || null;
  return { items, currentId: current };
}

// Apply a snapshot (viewer)
export function applyLetterSnapshot(snapshot: LetterSnapshot) {
  const textStore = useTextStore();
  const letterStore = useLetterStore();

  // Replace text data wholesale
  const allData = snapshot.items.map((i) => ({
    id: i.id,
    name: i.name,
    content: i.content,
    thumbnailSrc: i.thumbnailSrc,
    type: 'text',
  }));
  const currentIndex = snapshot.currentId
    ? allData.findIndex((d) => d.id === snapshot.currentId)
    : -1;
  textStore.importData({ allData, currentIndex });

  // Reset letter contexts
  snapshot.items.forEach((i) => {
    letterStore.setContext(i.id, { ...i.context });
  });
}

// Apply patch operations (viewer)
export function applyLetterPatchOps(ops: LetterPatchOp[]) {
  const textStore = useTextStore();
  const letterStore = useLetterStore();

  for (const op of ops) {
    switch (op.type) {
      case 'addContext': {
        const { item } = op;
        // Add text data if missing
        if (!textStore.getData(item.id)) {
          textStore.addData({
            id: item.id,
            name: item.name,
            content: item.content,
            thumbnailSrc: item.thumbnailSrc,
            type: 'text',
          } as any);
        }
        letterStore.setContext(item.id, { ...item.context });
        break;
      }
      case 'removeContext': {
        // Remove from text store + letter context
        textStore.removeData(op.id);
        // Cannot directly delete context via store API, but can set empty revealed
        const ctx = letterStore.getContext(op.id);
        if (ctx) {
          letterStore.setContext(op.id, { ...ctx, revealed: [] });
        }
        break;
      }
      case 'patchContext': {
        const ctx = letterStore.getContext(op.id);
        if (ctx) {
          letterStore.setContext(op.id, { ...ctx, ...op.partial });
        }
        break;
      }
      case 'appendRevealed': {
        const ctx = letterStore.getContext(op.id);
        if (ctx) {
          const merged = Array.from(new Set([...ctx.revealed, ...op.indices])).sort((a, b) => a - b);
          letterStore.setContext(op.id, { ...ctx, revealed: merged });
        }
        break;
      }
      case 'setRevealed': {
        const ctx = letterStore.getContext(op.id);
        if (ctx) {
          letterStore.setContext(op.id, { ...ctx, revealed: [...op.revealed] });
        }
        break;
      }
      case 'setCurrent': {
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
      socket.emit('letter:snapshot:request', { roomId: session.roomId });
    }
  });

  // Receive snapshot
  socket.on('letter:snapshot', ({ snapshot }: { snapshot: LetterSnapshot }) => {
    if (session.isViewer()) {
      applyLetterSnapshot(snapshot);
    }
  });

  // Receive patches
  socket.on('letter:patch', ({ ops }: { ops: LetterPatchOp[] }) => {
    if (session.isViewer()) {
      applyLetterPatchOps(ops);
    }
  });

  // Host responds to snapshot requests
  socket.on(
    'letter:snapshot:request',
    ({ requester, roomId }: { requester: string; roomId: string }) => {
      if (session.role === 'host' && roomId === session.roomId) {
        const snapshot = buildLetterSnapshot();
        socket.emit('letter:snapshot', { roomId, to: requester, snapshot });
      }
    }
  );
}

// Host helper to emit patch operations
export function emitLetterPatch(ops: LetterPatchOp[]) {
  const session = useSessionStore();
  const socket = getSocket();
  if (!socket || !session.roomId || session.role !== 'host') return;
  socket.emit('letter:patch', { roomId: session.roomId, ops });
}
