import { defineStore } from 'pinia';

interface SessionState {
  roomId: string | null;
  role: 'host' | 'viewer' | null;
}

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    roomId: null,
    role: null,
  }),
  actions: {
    setSession(roomId: string, role: 'host' | 'viewer') {
      this.roomId = roomId;
      this.role = role;
    },
    clear() {
      this.roomId = null;
      this.role = null;
    },
    isViewer(): boolean { return this.role === 'viewer'; }
  }
});
