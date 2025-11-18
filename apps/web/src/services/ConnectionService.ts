import { ref, computed, type Ref } from "vue";
import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export interface JoinResult {
  roomId: string;
  role: "host" | "viewer";
  usersCount: number;
}

export interface RoomInfo {
  roomId: string | null;
  usersCount: number;
}

type ConnectionStatusListener = (connected: boolean) => void;
type RoomInfoListener = (info: RoomInfo) => void;

/**
 * ConnectionService - Manages Socket.IO connections and room state
 */
export class ConnectionService {
  private socket: Socket | null = null;
  private connected: Ref<boolean> = ref(false);
  private role: Ref<"host" | "viewer" | null> = ref(null);
  private currentRoom: Ref<string | null> = ref(null);
  private usersCount: Ref<number> = ref(0);

  private connectionListeners: ConnectionStatusListener[] = [];
  private roomInfoListeners: RoomInfoListener[] = [];

  /**
   * Connect to a specified room
   */
  async connectRoom(roomId: string, userId: string): Promise<JoinResult> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        this.socket.disconnect();
      }

      this.socket = io(SOCKET_URL, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
      });

      this.socket.on("connect", () => {
        this.connected.value = true;
        this.notifyConnectionListeners(true);
        this.socket!.emit("joinRoom", { roomId, userId });
      });

      this.socket.on("joined", (payload: JoinResult) => {
        this.role.value = payload.role;
        this.currentRoom.value = payload.roomId;
        this.usersCount.value = payload.usersCount;
        this.notifyRoomInfoListeners();
        resolve(payload);
      });

      this.socket.on("roomUsers", ({ roomId: r, usersCount: c }) => {
        if (r === this.currentRoom.value) {
          this.usersCount.value = c;
          this.notifyRoomInfoListeners();
        }
      });

      this.socket.on("disconnect", () => {
        this.connected.value = false;
        this.currentRoom.value = null;
        this.usersCount.value = 0;
        this.notifyConnectionListeners(false);
        this.notifyRoomInfoListeners();
      });

      this.socket.on("reconnect", () => {
        this.connected.value = true;
        this.notifyConnectionListeners(true);
      });

      this.socket.on("connect_error", (err) => {
        reject(err);
      });
    });
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
    this.role.value = null;
    this.currentRoom.value = null;
    this.usersCount.value = 0;
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
    return this.role.value === "host";
  }

  /**
   * Check if current role is Viewer
   */
  isViewer(): boolean {
    return this.role.value === "viewer";
  }

  /**
   * Get current role
   */
  getRole(): "host" | "viewer" | null {
    return this.role.value;
  }

  /**
   * Get current room information
   */
  getRoomInfo(): RoomInfo {
    return {
      roomId: this.currentRoom.value,
      usersCount: this.usersCount.value,
    };
  }

  /**
   * Get Socket instance (for use by Adapters)
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Listen to connection status changes
   */
  onConnectionChange(listener: ConnectionStatusListener): void {
    this.connectionListeners.push(listener);
  }

  /**
   * Listen to room info changes
   */
  onRoomInfoChange(listener: RoomInfoListener): void {
    this.roomInfoListeners.push(listener);
  }

  /**
   * Remove connection status listener
   */
  offConnectionChange(listener: ConnectionStatusListener): void {
    const index = this.connectionListeners.indexOf(listener);
    if (index > -1) {
      this.connectionListeners.splice(index, 1);
    }
  }

  /**
   * Remove room info listener
   */
  offRoomInfoChange(listener: RoomInfoListener): void {
    const index = this.roomInfoListeners.indexOf(listener);
    if (index > -1) {
      this.roomInfoListeners.splice(index, 1);
    }
  }

  // Reactive getters for Vue components
  get connectedRef(): Ref<boolean> {
    return computed(() => this.connected.value);
  }

  get roleRef(): Ref<"host" | "viewer" | null> {
    return computed(() => this.role.value);
  }

  get roomIdRef(): Ref<string | null> {
    return computed(() => this.currentRoom.value);
  }

  get usersCountRef(): Ref<number> {
    return computed(() => this.usersCount.value);
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach((listener) => listener(connected));
  }

  private notifyRoomInfoListeners(): void {
    const info: RoomInfo = {
      roomId: this.currentRoom.value,
      usersCount: this.usersCount.value,
    };
    this.roomInfoListeners.forEach((listener) => listener(info));
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
