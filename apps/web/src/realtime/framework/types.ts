import type { Socket } from "socket.io-client";

export interface BasePatchOp<T extends string = string, P = any> {
  type: T;
  payload: P;
}

export interface SyncFeatureConfig<
  Snapshot,
  PatchOp extends BasePatchOp,
  StoreType extends { $onAction?: Function }
> {
  featureName: string;
  getStore: () => StoreType;
  buildSnapshot: () => Snapshot; // host only
  applySnapshot: (snapshot: Snapshot) => void; // viewer only
  applyPatchOps: (ops: PatchOp[]) => void; // viewer only
  mapActionToPatch?: (
    actionName: string,
    args: any[],
    store: StoreType
  ) => PatchOp[] | null; // host
  batchConfig?: {
    actionNames: string[];
    delayMs: number;
    merge: (ops: PatchOp[]) => PatchOp[]; // convert queued ops to final list
  };
}

export interface SyncChannels {
  request: string;
  snapshot: string;
  patch: string;
}

export interface InstallOptions {
  role: "host" | "viewer";
  socket: Socket;
  roomId: string | null;
}
