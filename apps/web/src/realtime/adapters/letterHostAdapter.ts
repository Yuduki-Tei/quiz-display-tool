import { useLetterStore } from "@/features/Letter/stores/letterStore";
import { useTextStore } from "@/stores/dataStore";
import { useSessionStore } from "@/stores/sessionStore";
import { emitLetterPatch } from "@/realtime/letterSync";
import type { LetterPatchOp } from "@/realtime/letterSync";

// Debounce helper for batching frequent revealChar operations
function createBatchEmitter(delay = 40) {
  let timer: number | null = null;
  const indicesById: Record<string, number[]> = {};

  function flush() {
    const ops: LetterPatchOp[] = [];
    for (const id of Object.keys(indicesById)) {
      const indices = indicesById[id];
      if (indices.length) {
        ops.push({ type: "appendRevealed", id, indices });
      }
    }
    if (ops.length) emitLetterPatch(ops);
    for (const k of Object.keys(indicesById)) delete indicesById[k];
    timer = null;
  }

  return {
    add(id: string, index: number) {
      if (!indicesById[id]) indicesById[id] = [];
      indicesById[id].push(index);
      if (timer === null) {
        timer = window.setTimeout(flush, delay);
      }
    },
    forceFlush() {
      if (timer !== null) {
        window.clearTimeout(timer);
        flush();
      }
    },
  };
}

let hostInstalled = false;
export function installLetterHostAdapter() {
  if (hostInstalled) return;
  const session = useSessionStore();
  if (session.role !== "host") return; // guard
  hostInstalled = true;

  const letterStore = useLetterStore();
  const textStore = useTextStore();
  const batch = createBatchEmitter();
  // Action observer: map store operations to patch ops now that store is pure
  letterStore.$onAction(({ name, args, after }) => {
    let preExistingContext: any = null;
    if (name === "setContext") {
      const id = args[0];
      preExistingContext = letterStore.getContext(id);
    }
    after((result) => {
      switch (name) {
        case "setContext": {
          const id = args[0] as string;
          const status = result as "added" | "updated";
          const ctx = letterStore.getContext(id);
          if (!ctx) break;
          const text = textStore.getData(id) as any;
          if (status === "added") {
            emitLetterPatch([
              {
                type: "addContext",
                item: {
                  id,
                  name: text?.name || id,
                  content: text?.content || "",
                  thumbnailSrc: text?.thumbnailSrc || null,
                  context: ctx,
                },
              },
            ]);
          } else {
            emitLetterPatch([
              { type: "patchContext", id, partial: { ...ctx } },
            ]);
          }
          break;
        }
        case "setCharsPerRow": {
          const id = args[0] as string;
          const value = args[1] as number;
          emitLetterPatch([
            { type: "patchContext", id, partial: { charsPerRow: value } },
          ]);
          break;
        }
        case "revealChar": {
          const id = args[0] as string;
          const index = args[1] as number;
          batch.add(id, index);
          break;
        }
        case "revealAll": {
          const id = args[0] as string;
          const ctx = letterStore.getContext(id);
          if (ctx) {
            emitLetterPatch([
              { type: "setRevealed", id, revealed: [...ctx.revealed] },
            ]);
          }
          break;
        }
        case "coverAll": {
          const id = args[0] as string;
          emitLetterPatch([{ type: "setRevealed", id, revealed: [] }]);
          break;
        }
        case "generateOrder": {
          const id = args[0] as string;
          const ctx = letterStore.getContext(id);
          if (ctx && ctx.order) {
            emitLetterPatch([
              { type: "patchContext", id, partial: { order: [...ctx.order] } },
            ]);
          }
          break;
        }
        default:
          // ignore others (paused state etc.)
          break;
      }
    });
  });

  // Observe textStore navigation for setCurrent patches
  textStore.$onAction(({ name, after }) => {
    if (session.role !== "host") return;
    if (
      name === "goToNext" ||
      name === "goToPrev" ||
      name === "setCurrentById"
    ) {
      after(() => {
        const id = textStore.currentData?.id || null;
        emitLetterPatch([{ type: "setCurrent", id }]);
      });
    }
  });

  // Hook revealChar batching if/when we remove internal emission later
  // Expose a method for future migration
  return {
    flushPending() {
      batch.forceFlush();
    },
  };
}
