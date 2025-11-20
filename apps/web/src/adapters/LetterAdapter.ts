import { useLetterStore } from "@/features/Letter/stores/letterStore";
import { useConnectionService } from "@/services/ConnectionService";
import type { LetterContext } from "@/features/Letter/types/LetterTypes";
import type { ActionEvent } from "@shared-types/types";

/**
 * LetterAdapter - Manages Letter feature state and synchronization
 *
 * Phase 3: Online mode - syncs actions to backend when connected as host
 */
export class LetterAdapter {
  private store = useLetterStore();
  private connectionService = useConnectionService();

  constructor() {
    // Register handler for incoming letterAction events from other users
    this.connectionService.onAction(
      "letterAction",
      this.handleIncomingAction.bind(this)
    );
  }

  /**
   * Handle incoming letterAction events from other users
   */
  private handleIncomingAction(data: ActionEvent): void {
    console.log("[LetterAdapter] Handling incoming action", data.action, data.payload);

    switch (data.action) {
      case "flipChar":
        this.flipChar(data.payload.id, data.payload.index, true);
        break;
      case "revealChar":
        this.store.revealChar(data.payload.id, data.payload.index);
        break;
      case "revealAll":
        this.store.revealAll(data.payload.id);
        break;
      case "coverAll":
        this.store.coverAll(data.payload.id);
        break;
    }
  }

  /**
   * Get letter context by id
   */
  getContext(id: string | null): LetterContext | null {
    return this.store.getContext(id);
  }

  /**
   * Set letter context
   */
  setContext(id: string, context: LetterContext): void {
    this.store.setContext(id, context);
  }

  /**
   * Update characters per row
   */
  setCharsPerRow(id: string, charsPerRow: number): void {
    this.store.setCharsPerRow(id, charsPerRow);
  }

  /**
   * Check if letter context exists
   */
  hasContext(id: string): boolean {
    return this.store.hasContext(id);
  }

  /**
   * Set auto revealing state
   */
  setAutoRevealing(value: boolean): void {
    this.store.setAutoRevealing(value);
  }

  /**
   * Set paused state
   */
  setPaused(value: boolean): void {
    this.store.setPaused(value);
  }

  /**
   * Reveal a character at index
   * Optimistic update: updates local state immediately, then syncs to backend if connected as host
   */
  revealChar(id: string, index: number): void {
    // Always update local state first (optimistic update)
    this.store.revealChar(id, index);

    // If connected as host, send action to backend
    if (this.shouldSync()) {
      this.emitAction("revealChar", { id, index });
    }
  }

  /**
   * Flip (toggle) a character at index
   * If revealed, cover it. If covered, reveal it.
   * Optimistic update: updates local state immediately, then syncs to backend if connected as host
   * @param skipEmit - If true, only update local state without emitting to backend (used when receiving events from other users)
   */
  flipChar(id: string, index: number, skipEmit: boolean = false): void {
    // Always update local state first (optimistic update)
    this.store.flipChar(id, index);

    // If connected as host and not explicitly skipping emit, send action to backend
    if (!skipEmit && this.shouldSync()) {
      this.emitAction("flipChar", { id, index });
    }
  }

  /**
   * Reveal all characters
   * Optimistic update: updates local state immediately, then syncs to backend if connected as host
   */
  revealAll(id: string): void {
    // Always update local state first (optimistic update)
    this.store.revealAll(id);

    // If connected as host, send action to backend
    if (this.shouldSync()) {
      this.emitAction("revealAll", { id });
    }
  }

  /**
   * Cover all characters
   * Optimistic update: updates local state immediately, then syncs to backend if connected as host
   */
  coverAll(id: string): void {
    // Always update local state first (optimistic update)
    this.store.coverAll(id);

    // If connected as host, send action to backend
    if (this.shouldSync()) {
      this.emitAction("coverAll", { id });
    }
  }

  /**
   * Generate reveal order based on mode
   */
  generateOrder(id: string, mode: string): void {
    this.store.generateOrder(id, mode);
  }

  /**
   * Get auto revealing state
   */
  isAutoRevealing(): boolean {
    return this.store.isAutoRevealing;
  }

  /**
   * Get paused state
   */
  isPaused(): boolean {
    return this.store.isPaused;
  }

  /**
   * Check if should sync to backend
   * Only sync when connected AND user is host
   */
  private shouldSync(): boolean {
    return (
      this.connectionService.isConnected() && this.connectionService.isHost()
    );
  }

  /**
   * Emit action to backend via Socket.IO
   */
  private emitAction(
    action: "revealChar" | "flipChar",
    payload: { id: string; index: number }
  ): void;
  private emitAction(
    action: "revealAll" | "coverAll",
    payload: { id: string }
  ): void;
  private emitAction(
    action: string,
    payload: { id: string; index?: number }
  ): void {
    const socket = this.connectionService.getSocket();
    if (socket) {
      socket.emit("letterAction", {
        action,
        payload,
        timestamp: Date.now(),
      });
      console.log("[LetterAdapter] Emitted action:", action, payload);
    }
  }
}

// Global singleton instance
let letterAdapterInstance: LetterAdapter | null = null;

/**
 * Get LetterAdapter singleton instance
 */
export function useLetterAdapter(): LetterAdapter {
  if (!letterAdapterInstance) {
    letterAdapterInstance = new LetterAdapter();
  }
  return letterAdapterInstance;
}
