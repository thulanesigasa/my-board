const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// In-memory room store: roomId -> { shapes: Map<shapeId, shape>, presences: Map<socketId, presence> }
const rooms = new Map();

function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      shapes: new Map(),
      presences: new Map(),
    });
  }
  return rooms.get(roomId);
}

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);
  let currentRoomId = null;

  // Join a board room
  socket.on('join-room', ({ roomId, user }) => {
    currentRoomId = roomId;
    socket.join(roomId);

    const room = getOrCreateRoom(roomId);

    // Register presence
    const presence = {
      id: user.id || socket.id,
      socketId: socket.id,
      name: user.name || 'Anonymous Artist',
      color: user.color || '#6366F1',
      cursor: null,
      selectedShapeIds: [],
      lastSeen: Date.now(),
    };
    room.presences.set(socket.id, presence);

    // Send existing room shapes & presences to new client
    socket.emit('init-room-state', {
      shapes: Array.from(room.shapes.values()),
      presences: Array.from(room.presences.values()),
    });

    // Notify room of new presence
    io.to(roomId).emit('presence-update', Array.from(room.presences.values()));
    console.log(`[Socket] ${user.name} joined room: ${roomId}`);
  });

  // Ephemeral Cursor Movement
  socket.on('cursor-move', (cursor) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const presence = room.presences.get(socket.id);
    if (presence) {
      presence.cursor = cursor;
      presence.lastSeen = Date.now();
      socket.to(currentRoomId).emit('cursor-move', {
        socketId: socket.id,
        userId: presence.id,
        cursor,
      });
    }
  });

  // Ephemeral Selection Change
  socket.on('selection-change', (selectedShapeIds) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const presence = room.presences.get(socket.id);
    if (presence) {
      presence.selectedShapeIds = selectedShapeIds;
      socket.to(currentRoomId).emit('selection-change', {
        socketId: socket.id,
        selectedShapeIds,
      });
    }
  });

  // Shape Add (Optimistic LWW broadcast)
  socket.on('shape-add', (shape) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    room.shapes.set(shape.id, shape);
    socket.to(currentRoomId).emit('shape-add', shape);
  });

  // Shape Update (Field level / LWW merge)
  socket.on('shape-update', (updatedShape) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const existing = room.shapes.get(updatedShape.id);
    if (!existing || updatedShape.updatedAt >= (existing.updatedAt || 0)) {
      room.shapes.set(updatedShape.id, { ...existing, ...updatedShape });
      socket.to(currentRoomId).emit('shape-update', updatedShape);
    }
  });

  // Shape Delete
  socket.on('shape-delete', (shapeId) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    room.shapes.delete(shapeId);
    socket.to(currentRoomId).emit('shape-delete', shapeId);
  });

  // Canvas Clear
  socket.on('canvas-clear', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    room.shapes.clear();
    io.to(currentRoomId).emit('canvas-clear');
  });

  // Handle Disconnection
  socket.on('disconnect', () => {
    if (currentRoomId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        room.presences.delete(socket.id);
        io.to(currentRoomId).emit('presence-update', Array.from(room.presences.values()));
      }
    }
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', activeRooms: rooms.size });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Real-time Whiteboard Socket Server running on port ${PORT}`);
});
