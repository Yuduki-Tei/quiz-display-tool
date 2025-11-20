import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

interface RoomState {
  hostSocketId: string | null;
  users: Map<string, { socketId: string; role: "host" | "viewer" }>;
}

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

const rooms: Map<string, RoomState> = new Map();

io.on("connection", (socket) => {
  console.log("[connect]", socket.id);

  socket.on(
    "joinRoom",
    ({ roomId, userId }: { roomId: string; userId: string }) => {
      if (!roomId || !userId) return;

      const socketRooms = Array.from(socket.rooms);
      if (socketRooms.includes(roomId)) {
        console.log("[joinRoom] Socket already in room", socket.id, roomId);
        const room = rooms.get(roomId);
        if (room) {
          const existingUser = room.users.get(userId);
          const role = existingUser?.role || "viewer";
          const usersCount = room.users.size;
          socket.emit("joined", { roomId, role, usersCount });
        }
        return;
      }

      let room = rooms.get(roomId);
      if (!room) {
        room = { hostSocketId: socket.id, users: new Map() };
        rooms.set(roomId, room);
      }
      const existingUser = room.users.get(userId);
      if (existingUser && existingUser.socketId !== socket.id) {
        console.log(
          "[joinRoom] UserId already in room with different socket",
          userId,
          existingUser.socketId,
          "new:",
          socket.id
        );
      }

      const role: "host" | "viewer" =
        room.hostSocketId === socket.id ? "host" : "viewer";
      room.users.set(userId, { socketId: socket.id, role });
      socket.join(roomId);

      const usersCount = room.users.size;
      socket.emit("joined", { roomId, role, usersCount });
      io.to(roomId).emit("roomUsers", { roomId, usersCount });
      console.log(
        "[joinRoom] User joined",
        userId,
        "as",
        role,
        "in room",
        roomId,
        "total users:",
        usersCount
      );
    }
  );

  socket.on(
    "letterAction",
    ({
      action,
      payload,
      timestamp,
    }: {
      action: string;
      payload: any;
      timestamp: number;
    }) => {
      console.log("[letterAction]", socket.id, action, payload);

      let currentRoomId: string | null = null;
      rooms.forEach((room, roomId) => {
        for (const [, info] of room.users) {
          if (info.socketId === socket.id) {
            currentRoomId = roomId;
            break;
          }
        }
      });

      if (!currentRoomId) {
        console.log("[letterAction] Socket not in any room", socket.id);
        return;
      }

      const room = rooms.get(currentRoomId);
      if (!room) return;

      if (room.hostSocketId !== socket.id) {
        console.log("[letterAction] Sender is not host, ignoring", socket.id);
        return;
      }

      socket
        .to(currentRoomId)
        .emit("letterAction", { action, payload, timestamp });
      console.log("[letterAction] Broadcasted to room", currentRoomId);
    }
  );

  socket.on("disconnect", () => {
    console.log("[disconnect]", socket.id);
    rooms.forEach((room, roomId) => {
      for (const [userId, info] of room.users) {
        if (info.socketId === socket.id) {
          room.users.delete(userId);
          if (room.hostSocketId === socket.id) {
            const firstUser = Array.from(room.users.values())[0];
            room.hostSocketId = firstUser ? firstUser.socketId : null;
          }
          const usersCount = room.users.size;
          io.to(roomId).emit("roomUsers", { roomId, usersCount });
          if (room.users.size === 0) {
            rooms.delete(roomId);
          }
          break;
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Socket server listening on http://localhost:${PORT}`);
});
