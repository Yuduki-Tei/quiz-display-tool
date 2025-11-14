import { BasePatchOp } from "./types";

export function createPatchBatcher<PatchOp extends BasePatchOp>(
  delay: number,
  emit: (ops: PatchOp[]) => void,
  merge?: (ops: PatchOp[]) => PatchOp[]
) {
  let queue: PatchOp[] = [];
  let timer: number | null = null;

  function flushInternal() {
    const out = merge ? merge(queue) : queue;
    if (out.length) emit(out);
    queue = [];
    timer = null;
  }

  return {
    add(op: PatchOp) {
      queue.push(op);
      if (timer === null) {
        timer = window.setTimeout(flushInternal, delay);
      }
    },
    flush() {
      if (timer !== null) {
        window.clearTimeout(timer);
        flushInternal();
      }
    },
  };
}
