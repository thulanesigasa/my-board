const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local in parent directory
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

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

// Initialize Supabase Client if env provided
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseLive = supabaseUrl && supabaseUrl !== 'https://placeholder-project.supabase.co' && supabaseKey;
const supabase = isSupabaseLive ? createClient(supabaseUrl, supabaseKey) : null;

console.log(`[Database] Supabase live integration: ${isSupabaseLive ? 'ENABLED' : 'LOCAL SNAPSHOT FALLBACK'}`);

// Local snapshot storage directory fallback
const SNAPSHOT_DIR = path.join(__dirname, 'snapshots');
if (!fs.existsSync(SNAPSHOT_DIR)) {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
}

// In-memory room store: roomId -> { shapes: Map<shapeId, shape>, presences: Map<socketId, presence> }
const rooms = new Map();

function loadRoomSnapshot(roomId) {
  if (isSupabaseLive && supabase) {
    // Asynchronously fetched upon room initialization
  } else {
    // Local JSON snapshot recovery
    const filePath = path.join(SNAPSHOT_DIR, `${roomId}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(raw);
        return new Map(data.map((s) => [s.id, s]));
      } catch (err) {
        console.error(`[Snapshot] Error reading snapshot for ${roomId}:`, err);
      }
    }
  }
  return new Map();
}

function saveRoomSnapshot(roomId, shapesMap) {
  const shapesArray = Array.from(shapesMap.values());

  // Save to local JSON file
  const filePath = path.join(SNAPSHOT_DIR, `${roomId}.json`);
  fs.writeFile(filePath, JSON.stringify(shapesArray, null, 2), (err) => {
    if (err) console.error(`[Snapshot] Error saving snapshot ${roomId}:`, err);
  });

  // Save to Supabase PostgreSQL if connected
  if (isSupabaseLive && supabase) {
    supabase
      .from('room_snapshots')
      .upsert({
        room_id: roomId,
        shapes_data: shapesArray,
        updated_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) console.error(`[Supabase DB] Error persisting room ${roomId}:`, error);
      });
  }
}

function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    const initialShapes = loadRoomSnapshot(roomId);
    rooms.set(roomId, {
      shapes: initialShapes,
      presences: new Map(),
    });
  }
  return rooms.get(roomId);
}

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);
  let currentRoomId = null;

  // Join room
  socket.on('join-room', async ({ roomId, user }) => {
    currentRoomId = roomId;
    socket.join(roomId);

    const room = getOrCreateRoom(roomId);

    // If Supabase is live and room is empty, try hydrating from DB
    if (isSupabaseLive && supabase && room.shapes.size === 0) {
      try {
        const { data } = await supabase.from('room_snapshots').select('shapes_data').eq('room_id', roomId).single();
        if (data && data.shapes_data) {
          data.shapes_data.forEach((s) => room.shapes.set(s.id, s));
        }
      } catch (err) {
        // Ignored
      }
    }

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

    // Hydrate client
    socket.emit('init-room-state', {
      shapes: Array.from(room.shapes.values()),
      presences: Array.from(room.presences.values()),
    });

    io.to(roomId).emit('presence-update', Array.from(room.presences.values()));
  });

  // Cursor Move
  socket.on('cursor-move', (cursor) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const presence = room.presences.get(socket.id);
    if (presence) {
      presence.cursor = cursor;
      socket.to(currentRoomId).emit('cursor-move', {
        socketId: socket.id,
        userId: presence.id,
        cursor,
      });
    }
  });

  // Selection Change
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

  // Shape Add
  socket.on('shape-add', (shape) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    room.shapes.set(shape.id, shape);
    socket.to(currentRoomId).emit('shape-add', shape);
    saveRoomSnapshot(currentRoomId, room.shapes);
  });

  // Shape Update
  socket.on('shape-update', (updatedShape) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const existing = room.shapes.get(updatedShape.id);
    if (!existing || updatedShape.updatedAt >= (existing.updatedAt || 0)) {
      room.shapes.set(updatedShape.id, { ...existing, ...updatedShape });
      socket.to(currentRoomId).emit('shape-update', updatedShape);
      saveRoomSnapshot(currentRoomId, room.shapes);
    }
  });

  // Shape Delete
  socket.on('shape-delete', (shapeId) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    room.shapes.delete(shapeId);
    socket.to(currentRoomId).emit('shape-delete', shapeId);
    saveRoomSnapshot(currentRoomId, room.shapes);
  });

  // Canvas Clear
  socket.on('canvas-clear', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    room.shapes.clear();
    io.to(currentRoomId).emit('canvas-clear');
    saveRoomSnapshot(currentRoomId, room.shapes);
  });

  // Disconnect
  socket.on('disconnect', () => {
    if (currentRoomId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        room.presences.delete(socket.id);
        io.to(currentRoomId).emit('presence-update', Array.from(room.presences.values()));
      }
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', activeRooms: rooms.size, dbConnected: isSupabaseLive });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Real-time Whiteboard Socket Server running on port ${PORT}`);
});
