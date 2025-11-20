import { ref, reactive, computed, type Ref } from "vue";
import type { Nullable, ActionEvent } from "@shared-types/types";
import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

type Role = "host" | "viewer";

export type JoinResult = {
  roomId: string;
  role: Role;
  usersCount: number;
};

export type RoomStatus = Nullable<JoinResult, "roomId" | "role">;
export type RoomInfo = Pick<RoomStatus, "roomId" | "usersCount">;

type ActionEventHandler = (data: ActionEvent) => void;
type RouteSyncHandler = (data: {
  path: string;
  query?: Record<string, string>;
}) => void;

/**
 * ConnectionService - Manages Socket.IO connections and room state
 */
export class ConnectionService {
  private socket: Socket | null = null;
  private connected: Ref<boolean> = ref(false);
  private roomStatus: RoomStatus = reactive({
    roomId: null,
    role: null,
    usersCount: 0,
  });

  private actionHandlers: Map<string, ActionEventHandler> = new Map();
  private routeSyncHandler: RouteSyncHandler | null = null;
  private isConnecting: boolean = false;
  private pendingConnection: Promise<JoinResult> | null = null;

  /**
   * Initialize socket connection
   */
  private connectSocket(): void {
    if (this.socket) {
      console.log("[ConnectionService] Disconnecting existing socket");
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      this.connected.value = true;
      console.log("[ConnectionService] Socket connected");
    });

    this.socket.on("roomUsers", ({ roomId: r, usersCount: c }) => {
      if (r === this.roomStatus.roomId) {
        this.roomStatus.usersCount = c;
      }
    });

    this.socket.on("disconnect", () => {
      this.connected.value = false;
      this.roomStatus.roomId = null;
      this.roomStatus.role = null;
      this.roomStatus.usersCount = 0;
    });

    this.socket.on("reconnect", () => {
      this.connected.value = true;
    });

    this.setupActionListeners();
  }

  /**
   * Connect to a specified room
   */
  async connectRoom(roomId: string, userId: string): Promise<JoinResult> {
    if (
      this.socket?.connected &&
      this.roomStatus.roomId === roomId &&
      this.roomStatus.role !== null
    ) {
      console.log("[ConnectionService] Already connected to room", roomId);
      return {
        roomId: this.roomStatus.roomId,
        role: this.roomStatus.role,
        usersCount: this.roomStatus.usersCount,
      };
    }

    if (this.isConnecting && this.pendingConnection) {
      console.log(
        "[ConnectionService] Connection already in progress, waiting..."
      );
      return this.pendingConnection;
    }

    this.isConnecting = true;

    this.pendingConnection = new Promise((resolve, reject) => {
      this.connectSocket();

      let hasResolved = false;

      this.socket!.on("connect", () => {
        console.log("[ConnectionService] Joining room", roomId);
        this.socket!.emit("joinRoom", { roomId, userId });
      });

      this.socket!.on("joined", (payload: JoinResult) => {
        Object.assign(this.roomStatus, payload);
        console.log(
          "[ConnectionService] Joined room",
          payload.roomId,
          "as",
          payload.role
        );

        if (!hasResolved) {
          hasResolved = true;
          this.isConnecting = false;
          this.pendingConnection = null;
          resolve(payload);
        }
      });

      this.socket!.on("connect_error", (err) => {
        if (!hasResolved) {
          hasResolved = true;
          this.isConnecting = false;
          this.pendingConnection = null;
          reject(err);
        }
      });
    });

    return this.pendingConnection;
  }

  /**
   * Setup listeners for action events
   */
  private setupActionListeners(): void {
    if (!this.socket) return;

    this.socket.on("letterAction", (data: ActionEvent) => {
      console.log("[ConnectionService] Received letterAction", data);
      const handler = this.actionHandlers.get("letterAction");
      if (handler) {
        handler(data);
      }
    });

    this.socket.on("textAction", (data: ActionEvent) => {
      console.log("[ConnectionService] Received textAction", data);
      const handler = this.actionHandlers.get("textAction");
      if (handler) {
        handler(data);
      }
    });

    this.socket.on(
      "routeSync",
      (data: { path: string; query?: Record<string, string> }) => {
        console.log("[ConnectionService] Received routeSync", data);
        if (this.routeSyncHandler) {
          this.routeSyncHandler(data);
        }
      }
    );
  }

  /**
   * Leave room and disconnect
   */
  leaveRoom(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connected.value = false;
    Object.assign(this.roomStatus, {
      roomId: null,
      role: null,
      usersCount: 0,
    });
  }

  /**
   * Check if currently connected
   */
  isConnected(): boolean {
    return this.connected.value && this.socket?.connected === true;
  }

  /**
   * Check if current role is Host
   */
  isHost(): boolean {
    return this.roomStatus.role === "host";
  }

  /**
   * Check if current role is Viewer
   */
  isViewer(): boolean {
    return this.roomStatus.role === "viewer";
  }

  /**
   * Get current role
   */
  getRole(): "host" | "viewer" | null {
    return this.roomStatus.role;
  }

  /**
   * Get current room information
   */
  getRoomInfo(): RoomInfo {
    return {
      roomId: this.roomStatus.roomId,
      usersCount: this.roomStatus.usersCount,
    };
  }

  /**
   * Get Socket instance (for use by Adapters)
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Register a handler for action events (letterAction, panelAction, etc.)
   * @param eventName - The name of the event (e.g., "letterAction", "panelAction")
   * @param handler - The handler function to call when the event is received
   */
  onAction(eventName: string, handler: ActionEventHandler): void {
    this.actionHandlers.set(eventName, handler);
  }

  /**
   * Unregister a handler for action events
   * @param eventName - The name of the event to unregister
   */
  offAction(eventName: string): void {
    this.actionHandlers.delete(eventName);
  }

  /**
   * Emit route change event (only host can emit)
   * @param path - The route path
   * @param query - Optional query parameters
   */
  emitRouteChange(path: string, query?: Record<string, string>): void {
    if (!this.socket || !this.isHost()) {
      return;
    }
    this.socket.emit("routeChange", { path, query });
  }

  /**
   * Register a handler for route sync events
   * @param handler - The handler function to call when route sync is received
   */
  onRouteSync(handler: RouteSyncHandler): void {
    this.routeSyncHandler = handler;
  }

  /**
   * Unregister route sync handler
   */
  offRouteSync(): void {
    this.routeSyncHandler = null;
  }

  // Reactive getters for Vue components
  get connectedRef(): Ref<boolean> {
    return computed(() => this.connected.value);
  }

  get roleRef(): Ref<"host" | "viewer" | null> {
    return computed(() => this.roomStatus.role);
  }

  get roomIdRef(): Ref<string | null> {
    return computed(() => this.roomStatus.roomId);
  }

  get usersCountRef(): Ref<number> {
    return computed(() => this.roomStatus.usersCount);
  }
}

// Global singleton instance
let connectionServiceInstance: ConnectionService | null = null;

/**
 * Get ConnectionService singleton instance
 */
export function useConnectionService(): ConnectionService {
  if (!connectionServiceInstance) {
    connectionServiceInstance = new ConnectionService();
  }
  return connectionServiceInstance;
}
