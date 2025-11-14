import {
  SyncFeatureConfig,
  BasePatchOp,
  InstallOptions,
  SyncChannels,
} from "./types";
import { createPatchBatcher } from "./batcher";

export function buildChannels(prefix: string): SyncChannels {
  return {
    request: `${prefix}:snapshot:request`,
    snapshot: `${prefix}:snapshot`,
    patch: `${prefix}:patch`,
  };
}

export function installSyncFeature<
  Snapshot,
  PatchOp extends BasePatchOp,
  StoreType
>(
  config: SyncFeatureConfig<Snapshot, PatchOp, StoreType>,
  options: InstallOptions
) {
  const { role, socket, roomId } = options;
  if (!socket || !roomId) return;

  const channels = buildChannels(config.featureName);

  if (role === "viewer") {
    // Request snapshot
    socket.emit(channels.request, { roomId });

    socket.on(channels.snapshot, ({ snapshot }: { snapshot: Snapshot }) => {
      config.applySnapshot(snapshot);
    });

    socket.on(channels.patch, ({ ops }: { ops: PatchOp[] }) => {
      config.applyPatchOps(ops);
    });
    return;
  }

  // Host branch
  const store = config.getStore();
  let batcher: ReturnType<typeof createPatchBatcher<PatchOp>> | null = null;
  if (config.batchConfig) {
    batcher = createPatchBatcher<PatchOp>(
      config.batchConfig.delayMs,
      (ops) => socket.emit(channels.patch, { roomId, ops }),
      config.batchConfig.merge
    );
  }

  store.$onAction(({ name, args, after }) => {
    after(() => {
      const ops = config.mapActionToPatch?.(name, args, store);
      if (!ops || ops.length === 0) return;
      if (
        config.batchConfig &&
        batcher &&
        config.batchConfig.actionNames.includes(name)
      ) {
        ops.forEach((o) => batcher!.add(o));
      } else {
        socket.emit(channels.patch, { roomId, ops });
      }
    });
  });

  socket.on(
    channels.request,
    ({
      requester,
      roomId: reqRoomId,
    }: {
      requester: string;
      roomId: string;
    }) => {
      if (reqRoomId !== roomId) return;
      const snapshot = config.buildSnapshot();
      socket.emit(channels.snapshot, { roomId, to: requester, snapshot });
    }
  );
}
