/// <reference types="vite/client" />
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket: Socket | null = null;
let currentRoom: string | null = null;
let usersCount = 0;

export interface JoinResult {
  roomId: string;
  role: 'host' | 'viewer';
  usersCount: number;
}

export type RoomInfoListener = (info: { roomId: string; usersCount: number }) => void;

let roomInfoListeners: RoomInfoListener[] = [];

export function onRoomInfo(listener: RoomInfoListener) {
  roomInfoListeners.push(listener);
}

function emitRoomInfo() {
  if (!currentRoom) return;
  roomInfoListeners.forEach((l) => l({ roomId: currentRoom!, usersCount }));
}

export function connectRoom(roomId: string, userId: string): Promise<JoinResult> {
  return new Promise((resolve, reject) => {
    if (socket?.connected) {
      socket.disconnect();
    }

    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      socket!.emit('joinRoom', { roomId, userId });
    });

    socket.on('joined', (payload: JoinResult) => {
      currentRoom = payload.roomId;
      usersCount = payload.usersCount;
      emitRoomInfo();
      resolve(payload);
    });

    socket.on('roomUsers', ({ roomId: r, usersCount: c }) => {
      if (r === currentRoom) {
        usersCount = c;
        emitRoomInfo();
      }
    });

    socket.on('disconnect', () => {
      currentRoom = null;
      usersCount = 0;
      emitRoomInfo();
    });

    socket.on('connect_error', (err) => {
      reject(err);
    });
  });
}

export function getCurrentRoomInfo() {
  return { roomId: currentRoom, usersCount };
}

export function leaveRoom() {
  if (socket) {
    socket.disconnect();
  }
}
