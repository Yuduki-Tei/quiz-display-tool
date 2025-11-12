import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

interface RoomState {
  hostSocketId: string | null;
  users: Map<string, { socketId: string; role: 'host' | 'viewer' }>;
}

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

const rooms: Map<string, RoomState> = new Map();

io.on('connection', (socket) => {
  console.log('[connect]', socket.id);

  socket.on('joinRoom', ({ roomId, userId }: { roomId: string; userId: string }) => {
    if (!roomId || !userId) return;
    let room = rooms.get(roomId);
    if (!room) {
      room = { hostSocketId: socket.id, users: new Map() };
      rooms.set(roomId, room);
    }

    const role: 'host' | 'viewer' = room.hostSocketId === socket.id ? 'host' : 'viewer';
    room.users.set(userId, { socketId: socket.id, role });
    socket.join(roomId);

    const usersCount = room.users.size;
    socket.emit('joined', { roomId, role, usersCount });
    io.to(roomId).emit('roomUsers', { roomId, usersCount });
  });

  socket.on('disconnect', () => {
    console.log('[disconnect]', socket.id);
    rooms.forEach((room, roomId) => {
      for (const [userId, info] of room.users) {
        if (info.socketId === socket.id) {
          room.users.delete(userId);
          if (room.hostSocketId === socket.id) {
            const firstUser = Array.from(room.users.values())[0];
            room.hostSocketId = firstUser ? firstUser.socketId : null;
          }
          const usersCount = room.users.size;
          io.to(roomId).emit('roomUsers', { roomId, usersCount });
          if (room.users.size === 0) {
            rooms.delete(roomId);
          }
          break;
        }
      }
    });
  });

  // Host route change broadcast
  socket.on('route:change', ({ roomId, path }: { roomId: string; path: string }) => {
    if (!roomId || !path) return;
    const room = rooms.get(roomId);
    if (!room) return;
    if (room.hostSocketId !== socket.id) return; // only host allowed
    io.to(roomId).emit('route:change', { path });
  });

  // Letter synchronization events
  // Viewer requests snapshot -> forward to host only
  socket.on('letter:snapshot:request', ({ roomId }: { roomId: string }) => {
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room || !room.hostSocketId) return;
    io.to(room.hostSocketId).emit('letter:snapshot:request', { requester: socket.id, roomId });
  });

  // Host responds with snapshot -> deliver only to requester
  socket.on('letter:snapshot', ({ roomId, to, snapshot }: { roomId: string; to: string; snapshot: any }) => {
    if (!roomId || !to || !snapshot) return;
    const room = rooms.get(roomId);
    if (!room) return;
    if (room.hostSocketId !== socket.id) return; // only host
    io.to(to).emit('letter:snapshot', { snapshot });
  });

  // Host sends patch ops -> broadcast to entire room
  socket.on('letter:patch', ({ roomId, ops }: { roomId: string; ops: any[] }) => {
    if (!roomId || !ops) return;
    const room = rooms.get(roomId);
    if (!room) return;
    if (room.hostSocketId !== socket.id) return; // only host
    io.to(roomId).emit('letter:patch', { ops });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Socket server listening on http://localhost:${PORT}`);
});
