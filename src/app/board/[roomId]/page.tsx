'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSocket } from '@/lib/socket';
import { BaseShape, Point, ToolType, UserPresence } from '@/types/board';
import { Canvas } from '@/components/Board/Canvas';
import { Toolbar } from '@/components/Board/Toolbar';
import { Header } from '@/components/Board/Header';
import { Minimap } from '@/components/Board/Minimap';
import { getRandomAvatarColor } from '@/lib/supabase/client';

export default function BoardPage({ params }: { params: Promise<{ roomId: string }> }) {
  const resolvedParams = use(params);
  const roomId = resolvedParams.roomId;

  const { user } = useAuth();

  const [shapes, setShapes] = useState<BaseShape[]>([]);
  const [presences, setPresences] = useState<UserPresence[]>([]);
  const [activeTool, setActiveTool] = useState<ToolType>('pencil');
  const [strokeColor, setStrokeColor] = useState('#6366F1');
  const [fillColor, setFillColor] = useState('transparent');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [roomTitle, setRoomTitle] = useState('Untitled Board');
  const [isConnected, setIsConnected] = useState(false);

  // Undo / Redo history stack
  const [history, setHistory] = useState<BaseShape[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const currentUserId = user?.id || `anon_${Math.random().toString(36).substring(2, 7)}`;
  const currentUserName = user?.name || 'Guest Artist';
  const currentUserColor = user?.avatarColor || getRandomAvatarColor(currentUserId);

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-room', {
        roomId,
        user: {
          id: currentUserId,
          name: currentUserName,
          color: currentUserColor,
        },
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    if (socket.connected) {
      setIsConnected(true);
      socket.emit('join-room', {
        roomId,
        user: {
          id: currentUserId,
          name: currentUserName,
          color: currentUserColor,
        },
      });
    }

    // Hydrate initial room state
    socket.on('init-room-state', ({ shapes: initialShapes, presences: initialPresences }) => {
      setShapes(initialShapes || []);
      setPresences(initialPresences || []);
      setHistory([initialShapes || []]);
      setHistoryIndex(0);
    });

    // Real-time Presence Updates
    socket.on('presence-update', (updatedPresences: UserPresence[]) => {
      setPresences(updatedPresences);
    });

    socket.on('cursor-move', ({ userId, cursor }) => {
      setPresences((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, cursor } : p))
      );
    });

    // Real-time Shape Deltas
    socket.on('shape-add', (newShape: BaseShape) => {
      setShapes((prev) => [...prev.filter((s) => s.id !== newShape.id), newShape]);
    });

    socket.on('shape-update', (updatedShape: BaseShape) => {
      setShapes((prev) =>
        prev.map((s) => (s.id === updatedShape.id ? { ...s, ...updatedShape } : s))
      );
    });

    socket.on('shape-delete', (shapeId: string) => {
      setShapes((prev) => prev.filter((s) => s.id !== shapeId));
    });

    socket.on('canvas-clear', () => {
      setShapes([]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('init-room-state');
      socket.off('presence-update');
      socket.off('cursor-move');
      socket.off('shape-add');
      socket.off('shape-update');
      socket.off('shape-delete');
      socket.off('canvas-clear');
    };
  }, [roomId, currentUserId, currentUserName, currentUserColor]);

  // Add Shape Handler
  const handleAddShape = useCallback(
    (shape: BaseShape) => {
      setShapes((prev) => {
        const next = [...prev, shape];
        setHistory((h) => [...h.slice(0, historyIndex + 1), next]);
        setHistoryIndex((i) => i + 1);
        return next;
      });

      const socket = getSocket();
      socket.emit('shape-add', shape);
    },
    [historyIndex]
  );

  // Update Shape Handler
  const handleUpdateShape = useCallback(
    (shape: BaseShape) => {
      setShapes((prev) => {
        const next = prev.map((s) => (s.id === shape.id ? shape : s));
        return next;
      });

      const socket = getSocket();
      socket.emit('shape-update', shape);
    },
    []
  );

  // Delete Shape Handler
  const handleDeleteShape = useCallback(
    (shapeId: string) => {
      setShapes((prev) => {
        const next = prev.filter((s) => s.id !== shapeId);
        setHistory((h) => [...h.slice(0, historyIndex + 1), next]);
        setHistoryIndex((i) => i + 1);
        return next;
      });

      const socket = getSocket();
      socket.emit('shape-delete', shapeId);
    },
    [historyIndex]
  );

  // Clear Canvas Handler
  const handleClear = useCallback(() => {
    setShapes([]);
    setHistory((h) => [...h.slice(0, historyIndex + 1), []]);
    setHistoryIndex((i) => i + 1);

    const socket = getSocket();
    socket.emit('canvas-clear');
  }, [historyIndex]);

  // Cursor move broadcast handler
  const handleCursorMove = useCallback((cursor: Point | null) => {
    const socket = getSocket();
    socket.emit('cursor-move', cursor);
  }, []);

  // Selection change broadcast handler
  const handleSelectionChange = useCallback((selectedShapeIds: string[]) => {
    const socket = getSocket();
    socket.emit('selection-change', selectedShapeIds);
  }, []);

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevShapes = history[historyIndex - 1];
      setShapes(prevShapes);
      setHistoryIndex((i) => i - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextShapes = history[historyIndex + 1];
      setShapes(nextShapes);
      setHistoryIndex((i) => i + 1);
    }
  };

  return (
    <main className="w-full h-screen relative overflow-hidden bg-slate-950">
      <Header
        roomId={roomId}
        roomTitle={roomTitle}
        setRoomTitle={setRoomTitle}
        presences={presences}
        shapes={shapes}
        isConnected={isConnected}
      />

      <Canvas
        shapes={shapes}
        onAddShape={handleAddShape}
        onUpdateShape={handleUpdateShape}
        onDeleteShape={handleDeleteShape}
        activeTool={activeTool}
        strokeColor={strokeColor}
        fillColor={fillColor}
        strokeWidth={strokeWidth}
        currentUserId={currentUserId}
        presences={presences}
        onCursorMove={handleCursorMove}
        onSelectionChange={handleSelectionChange}
      />

      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        fillColor={fillColor}
        setFillColor={setFillColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onClear={handleClear}
      />

      <Minimap shapes={shapes} />
    </main>
  );
}
