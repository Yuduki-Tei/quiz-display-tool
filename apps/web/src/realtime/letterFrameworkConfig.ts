import { useLetterStore } from "@/features/Letter/stores/letterStore";
import { useTextStore } from "@/stores/dataStore";
import { applyLetterPatchOps } from "@/realtime/letterSync";
import {
  buildLetterSnapshot,
  applyLetterSnapshot,
} from "@/realtime/letterSnapshotService";
import type { LetterSnapshot, LetterPatchOp } from "@/realtime/letterSync";
import type { SyncFeatureConfig, BasePatchOp } from "./framework";

// Remap existing patch op types into BasePatchOp shape for framework
// Original LetterPatchOp already a discriminated union; we adapt payload naming.

// Helper to wrap legacy ops into BasePatchOp form
function wrapLegacyOp(op: LetterPatchOp): BasePatchOp {
  // Preserve original structure inside payload
  return { type: op.type, payload: op };
}

export const letterFrameworkConfig: SyncFeatureConfig<
  LetterSnapshot,
  BasePatchOp<string, LetterPatchOp>,
  ReturnType<typeof useLetterStore>
> = {
  featureName: "letter",
  getStore: () => useLetterStore(),
  buildSnapshot: () => buildLetterSnapshot(),
  applySnapshot: (s) => applyLetterSnapshot(s),
  applyPatchOps: (ops) => {
    // Unwrap payload back to legacy ops
    const legacyOps = ops.map((o) => o.payload);
    applyLetterPatchOps(legacyOps as LetterPatchOp[]);
  },
  mapActionToPatch: (action, args, store) => {
    const textStore = useTextStore();
    switch (action) {
      case "setContext": {
        const id = args[0] as string;
        const status = args[1] as "added" | "updated" | undefined; // our store returns value, Pinia passes result as args? Might need adjustment
        const ctx = store.getContext(id);
        if (!ctx) return null;
        const text = textStore.getData(id) as any;
        if (status === "added") {
          return [
            wrapLegacyOp({
              type: "addContext",
              item: {
                id,
                name: text?.name || id,
                content: text?.content || "",
                thumbnailSrc: text?.thumbnailSrc || null,
                context: ctx,
              },
            }),
          ];
        }
        return [
          wrapLegacyOp({ type: "patchContext", id, partial: { ...ctx } }),
        ];
      }
      case "setCharsPerRow": {
        const id = args[0] as string;
        const v = args[1] as number;
        return [
          wrapLegacyOp({
            type: "patchContext",
            id,
            partial: { charsPerRow: v },
          }),
        ];
      }
      case "revealChar": {
        const id = args[0] as string;
        const index = args[1] as number;
        return [wrapLegacyOp({ type: "appendRevealed", id, indices: [index] })];
      }
      case "revealAll": {
        const id = args[0] as string;
        const ctx = store.getContext(id);
        if (!ctx) return null;
        return [
          wrapLegacyOp({
            type: "setRevealed",
            id,
            revealed: [...ctx.revealed],
          }),
        ];
      }
      case "coverAll": {
        const id = args[0] as string;
        return [wrapLegacyOp({ type: "setRevealed", id, revealed: [] })];
      }
      case "generateOrder": {
        const id = args[0] as string;
        const ctx = store.getContext(id);
        if (!ctx || !ctx.order) return null;
        return [
          wrapLegacyOp({
            type: "patchContext",
            id,
            partial: { order: [...ctx.order] },
          }),
        ];
      }
      default:
        return null;
    }
  },
  batchConfig: {
    actionNames: ["revealChar"],
    delayMs: 40,
    merge(ops) {
      // Collect appendRevealed ops
      const byId: Record<string, number[]> = {};
      for (const op of ops) {
        if (op.type === "appendRevealed") {
          const legacy = op.payload as LetterPatchOp;
          if (legacy.type === "appendRevealed") {
            const { id, indices } = legacy;
            byId[id] = byId[id] ? byId[id].concat(indices) : indices.slice();
          }
        }
      }
      return Object.entries(byId).map(([id, indices]) =>
        wrapLegacyOp({
          type: "appendRevealed",
          id,
          indices: Array.from(new Set(indices)),
        })
      );
    },
  },
};
