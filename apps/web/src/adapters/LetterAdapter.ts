import { useLetterStore } from "@/features/Letter/stores/letterStore";
import { useTextStore } from "@/stores/dataStore";
import { useConnectionService } from "@/services/ConnectionService";
import type { LetterContext } from "@/features/Letter/types/LetterTypes";
import type { ActionEvent } from "@shared-types/types";

/**
 * LetterAdapter - Manages Letter feature state and synchronization
 *
 * Handles both letter actions (character reveals) and text data management
 */
export class LetterAdapter {
  private letterStore = useLetterStore();
  private textStore = useTextStore();
  private connectionService = useConnectionService();

  constructor() {
    this.connectionService.onAction(
      "letterAction",
      this.handleIncomingLetterAction.bind(this)
    );

    this.connectionService.onAction(
      "textAction",
      this.handleIncomingTextAction.bind(this)
    );
  }

  /**
   * Handle incoming letterAction events (character reveals)
   */
  private handleIncomingLetterAction(data: ActionEvent): void {
    console.log(
      "[LetterAdapter] Handling incoming letterAction",
      data.action,
      data.payload
    );

    // Host shouldn't process their own letterActions (already handled locally)
    if (this.connectionService.isHost()) {
      console.log("[LetterAdapter] Host ignoring own letterAction");
      return;
    }

    switch (data.action) {
      case "charReveal":
        // Update text store with revealed character
        this.textStore.updateCharAt(
          data.payload.id,
          data.payload.index,
          data.payload.char
        );
        // Update letter store revealed array
        this.letterStore.revealChar(data.payload.id, data.payload.index);
        break;

      case "batchCharReveal":
        // Batch update text store
        this.textStore.batchUpdateChars(data.payload.id, data.payload.chars);
        // Batch update letter store
        this.letterStore.revealAll(data.payload.id);
        break;

      case "coverAll":
        this.letterStore.coverAll(data.payload.id);
        break;
    }
  }

  /**
   * Handle incoming textAction events (data management)
   */
  private handleIncomingTextAction(data: ActionEvent): void {
    console.log(
      "[LetterAdapter] Handling incoming textAction",
      data.action,
      data.payload
    );

    if (this.connectionService.isHost()) {
      console.log("[LetterAdapter] Host ignoring own textAction");
      return;
    }

    switch (data.action) {
      case "textUpload":
        // Create placeholder text for viewer
        this.textStore.addPlaceholderText(
          data.payload.id,
          "",
          data.payload.totalChars,
          null
        );
        // Initialize letter context
        this.letterStore.setContext(data.payload.id, {
          totalChars: data.payload.totalChars,
          charsPerRow: 10, // Default value
          revealed: [],
          isManual: true,
          autoRevealMode: "random",
        });
        break;

      case "textDelete":
        this.textStore.removeData(data.payload.id);
        // Letter context will be cleaned up when text is removed
        break;
    }
  }

  /**
   * Get letter context by id
   */
  getContext(id: string | null): LetterContext | null {
    return this.letterStore.getContext(id);
  }

  /**
   * Set letter context
   */
  setContext(id: string, context: LetterContext): void {
    this.letterStore.setContext(id, context);
  }

  /**
   * Update characters per row
   */
  setCharsPerRow(id: string, charsPerRow: number): void {
    this.letterStore.setCharsPerRow(id, charsPerRow);
  }

  /**
   * Check if letter context exists
   */
  hasContext(id: string): boolean {
    return this.letterStore.hasContext(id);
  }

  /**
   * Set auto revealing state
   */
  setAutoRevealing(value: boolean): void {
    this.letterStore.setAutoRevealing(value);
  }

  /**
   * Set paused state
   */
  setPaused(value: boolean): void {
    this.letterStore.setPaused(value);
  }

  /**
   * Reveal a character at index
   * Optimistic update: updates local state immediately, then syncs to backend if connected as host
   */
  revealChar(id: string, index: number): void {
    // Get char content from textStore
    const textData = this.textStore.getData(id);
    if (!textData) {
      console.error(
        `[LetterAdapter] revealChar: No text data found for id ${id}`
      );
      return;
    }

    const char = textData.content[index];
    if (char === undefined) {
      console.error(
        `[LetterAdapter] revealChar: Invalid index ${index} for id ${id}`
      );
      return;
    }

    // Always update local state first (optimistic update)
    this.letterStore.revealChar(id, index);

    // If connected as host, broadcast action with char content
    if (this.shouldSync()) {
      this.emitLetterAction("charReveal", { id, index, char });
    }
  }

  /**
   * Flip (toggle) a character at index
   * If revealed, cover it. If covered, reveal it.
   * Optimistic update: updates local state immediately, then syncs to backend if connected as host
   * @param skipEmit - If true, only update local state without emitting to backend (used when receiving events from other users)
   */
  flipChar(id: string, index: number, skipEmit: boolean = false): void {
    const context = this.letterStore.getContext(id);
    if (!context) {
      console.error(`[LetterAdapter] flipChar: No context found for id ${id}`);
      return;
    }

    const isRevealed = context.revealed.includes(index);

    // Always update local state first (optimistic update)
    this.letterStore.flipChar(id, index);

    // If connected as host and not explicitly skipping emit, send action to backend
    if (!skipEmit && this.shouldSync()) {
      if (!isRevealed) {
        const textData = this.textStore.getData(id);
        if (!textData) {
          console.error(
            `[LetterAdapter] flipChar: No text data found for id ${id}`
          );
          return;
        }
        const char = textData.content[index];
        if (char === undefined) {
          console.error(
            `[LetterAdapter] flipChar: Invalid index ${index} for id ${id}`
          );
          return;
        }
        this.emitLetterAction("charReveal", { id, index, char });
      } else {
        console.log(
          `[LetterAdapter] flipChar: Covering index ${index} (local only)`
        );
      }
    }
  }

  /**
   * Reveal all characters
   * Optimistic update: updates local state immediately, then syncs to backend if connected as host
   */
  revealAll(id: string): void {
    const textData = this.textStore.getData(id);
    if (!textData) {
      console.error(
        `[LetterAdapter] revealAll: No text data found for id ${id}`
      );
      return;
    }

    const context = this.letterStore.getContext(id);
    if (!context) {
      console.error(`[LetterAdapter] revealAll: No context found for id ${id}`);
      return;
    }

    // Always update local state first (optimistic update)
    this.letterStore.revealAll(id);

    // If connected as host, broadcast all chars
    if (this.shouldSync()) {
      const chars: Array<{ index: number; char: string }> = [];
      for (let i = 0; i < textData.content.length; i++) {
        if (!context.revealed.includes(i)) {
          chars.push({ index: i, char: textData.content[i] });
        }
      }

      if (chars.length > 0) {
        this.emitLetterAction("batchCharReveal", { id, chars });
      }
    }
  }

  /**
   * Cover all characters
   * Optimistic update: updates local state immediately, then syncs to backend if connected as host
   */
  coverAll(id: string): void {
    // Always update local state first (optimistic update)
    this.letterStore.coverAll(id);

    // If connected as host, send action to backend
    if (this.shouldSync()) {
      this.emitLetterAction("coverAll", { id });
    }
  }

  /**
   * Generate reveal order based on mode
   */
  generateOrder(id: string, mode: string): void {
    this.letterStore.generateOrder(id, mode);
  }

  /**
   * Get auto revealing state
   */
  isAutoRevealing(): boolean {
    return this.letterStore.isAutoRevealing;
  }

  /**
   * Get paused state
   */
  isPaused(): boolean {
    return this.letterStore.isPaused;
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
   * Emit letter action to backend via Socket.IO
   */
  private emitLetterAction(
    action: "charReveal",
    payload: { id: string; index: number; char: string }
  ): void;
  private emitLetterAction(
    action: "batchCharReveal",
    payload: { id: string; chars: Array<{ index: number; char: string }> }
  ): void;
  private emitLetterAction(action: "coverAll", payload: { id: string }): void;
  private emitLetterAction(action: string, payload: any): void {
    const socket = this.connectionService.getSocket();
    if (socket) {
      socket.emit("letterAction", {
        action,
        payload,
        timestamp: Date.now(),
      });
      console.log("[LetterAdapter] Emitted letterAction:", action, payload);
    }
  }

  /**
   * Emit text action to backend via Socket.IO (for upload/delete operations)
   */
  private emitTextAction(
    action: "textUpload",
    payload: {
      id: string;
      totalChars: number;
    }
  ): void;
  private emitTextAction(action: "textDelete", payload: { id: string }): void;
  private emitTextAction(action: string, payload: any): void {
    const socket = this.connectionService.getSocket();
    if (socket) {
      socket.emit("textAction", {
        action,
        payload,
        timestamp: Date.now(),
      });
      console.log("[LetterAdapter] Emitted textAction:", action, payload);
    }
  }

  /**
   * Emit text upload event (called by LetterManager when uploading text)
   * Only sends id and totalChars to avoid revealing content (name/thumbnail)
   */
  emitTextUpload(id: string, totalChars: number): void {
    if (this.shouldSync()) {
      this.emitTextAction("textUpload", { id, totalChars });
    }
  }

  /**
   * Emit text delete event (called by LetterManager when deleting text)
   */
  emitTextDelete(id: string): void {
    if (this.shouldSync()) {
      this.emitTextAction("textDelete", { id });
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
