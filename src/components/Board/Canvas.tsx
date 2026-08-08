'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { BaseShape, Point, ToolType, CanvasViewport, UserPresence } from '@/types/board';
import { renderFreehandStroke, isPointInShape, getShapeBounds } from '@/lib/drawing';
import { PresenceCursors } from './PresenceCursors';

interface CanvasProps {
  shapes: BaseShape[];
  onAddShape: (shape: BaseShape) => void;
  onUpdateShape: (shape: BaseShape) => void;
  onDeleteShape: (shapeId: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  activeTool: ToolType;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  currentUserId: string;
  presences: UserPresence[];
  onCursorMove: (point: Point | null) => void;
  onSelectionChange: (selectedIds: string[]) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  shapes,
  onAddShape,
  onUpdateShape,
  onDeleteShape,
  onUndo,
  onRedo,
  activeTool,
  strokeColor,
  fillColor,
  strokeWidth,
  currentUserId,
  presences,
  onCursorMove,
  onSelectionChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [viewport, setViewport] = useState<CanvasViewport>({ x: 0, y: 0, zoom: 1 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);
  const [activeShape, setActiveShape] = useState<BaseShape | null>(null);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  // Clipboard for Copy / Paste
  const [clipboard, setClipboard] = useState<BaseShape[]>([]);

  // Screen coordinates to canvas viewport transformation
  const screenToCanvas = useCallback(
    (screenX: number, screenY: number): Point => {
      if (!containerRef.current) return { x: screenX, y: screenY };
      const rect = containerRef.current.getBoundingClientRect();
      const x = (screenX - rect.left - viewport.x) / viewport.zoom;
      const y = (screenY - rect.top - viewport.y) / viewport.zoom;
      return { x, y };
    },
    [viewport]
  );

  // Synchronize selection changes with parent
  useEffect(() => {
    onSelectionChange(selectedShapeIds);
  }, [selectedShapeIds, onSelectionChange]);

  // Global Keyboard Shortcuts (Ctrl+A, Ctrl+Z, Ctrl+Y, Ctrl+C, Ctrl+V, Ctrl+D, Delete, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      const isCtrl = e.ctrlKey || e.metaKey;

      // Ctrl + A (Select All)
      if (isCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        const allIds = shapes.map((s) => s.id);
        setSelectedShapeIds(allIds);
        return;
      }

      // Ctrl + Z (Undo)
      if (isCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (onUndo) onUndo();
        return;
      }

      // Ctrl + Y or Ctrl + Shift + Z (Redo)
      if ((isCtrl && e.key.toLowerCase() === 'y') || (isCtrl && e.shiftKey && e.key.toLowerCase() === 'z')) {
        e.preventDefault();
        if (onRedo) onRedo();
        return;
      }

      // Ctrl + C (Copy)
      if (isCtrl && e.key.toLowerCase() === 'c' && selectedShapeIds.length > 0) {
        e.preventDefault();
        const selectedShapes = shapes.filter((s) => selectedShapeIds.includes(s.id));
        setClipboard(selectedShapes);
        return;
      }

      // Ctrl + V (Paste)
      if (isCtrl && e.key.toLowerCase() === 'v' && clipboard.length > 0) {
        e.preventDefault();
        const newSelectedIds: string[] = [];
        clipboard.forEach((shape) => {
          const newId = `shp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          const pasted: BaseShape = {
            ...shape,
            id: newId,
            x: shape.x + 24,
            y: shape.y + 24,
            points: shape.points?.map((p) => ({ x: p.x + 24, y: p.y + 24 })),
            updatedAt: Date.now(),
          };
          onAddShape(pasted);
          newSelectedIds.push(newId);
        });
        setSelectedShapeIds(newSelectedIds);
        return;
      }

      // Ctrl + D (Duplicate)
      if (isCtrl && e.key.toLowerCase() === 'd' && selectedShapeIds.length > 0) {
        e.preventDefault();
        const selectedShapes = shapes.filter((s) => selectedShapeIds.includes(s.id));
        const newSelectedIds: string[] = [];
        selectedShapes.forEach((shape) => {
          const newId = `shp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          const duplicated: BaseShape = {
            ...shape,
            id: newId,
            x: shape.x + 20,
            y: shape.y + 20,
            points: shape.points?.map((p) => ({ x: p.x + 20, y: p.y + 20 })),
            updatedAt: Date.now(),
          };
          onAddShape(duplicated);
          newSelectedIds.push(newId);
        });
        setSelectedShapeIds(newSelectedIds);
        return;
      }

      // Delete & Backspace (Instant Deletion)
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedShapeIds.length > 0) {
        e.preventDefault();
        selectedShapeIds.forEach((id) => onDeleteShape(id));
        setSelectedShapeIds([]);
        setActiveShape(null);
        return;
      }

      // Escape (Deselect)
      if (e.key === 'Escape') {
        setSelectedShapeIds([]);
        setActiveShape(null);
        setEditingTextId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shapes, selectedShapeIds, clipboard, onAddShape, onDeleteShape, onUndo, onRedo]);

  // Handle pointer down (including Ctrl / Shift multi-selection)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (editingTextId) setEditingTextId(null);

    const point = screenToCanvas(e.clientX, e.clientY);
    const isMultiSelectKey = e.ctrlKey || e.shiftKey || e.metaKey;

    if (activeTool === 'select') {
      const clickedShape = [...shapes].reverse().find((s) => isPointInShape(point, s));
      if (clickedShape) {
        if (isMultiSelectKey) {
          // Toggle item in selection array
          setSelectedShapeIds((prev) =>
            prev.includes(clickedShape.id)
              ? prev.filter((id) => id !== clickedShape.id)
              : [...prev, clickedShape.id]
          );
        } else {
          // Single select
          if (!selectedShapeIds.includes(clickedShape.id)) {
            setSelectedShapeIds([clickedShape.id]);
          }
        }
        setActiveShape(clickedShape);
        setDragStart(point);
      } else {
        if (!isMultiSelectKey) {
          setSelectedShapeIds([]);
          setActiveShape(null);
        }
      }
      return;
    }

    if (activeTool === 'eraser') {
      const clickedShape = [...shapes].reverse().find((s) => isPointInShape(point, s));
      if (clickedShape) {
        onDeleteShape(clickedShape.id);
      }
      return;
    }

    setIsDrawing(true);
    setCurrentPoints([point]);

    const newShapeId = `shp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (activeTool === 'pencil' || activeTool === 'highlighter') {
      const newShape: BaseShape = {
        id: newShapeId,
        type: 'freehand',
        x: point.x,
        y: point.y,
        strokeColor: activeTool === 'highlighter' ? `${strokeColor}80` : strokeColor,
        strokeWidth: activeTool === 'highlighter' ? strokeWidth * 2.5 : strokeWidth,
        points: [point],
        updatedAt: Date.now(),
        createdBy: currentUserId,
        zIndex: shapes.length,
      };
      setActiveShape(newShape);
    } else if (
      activeTool === 'rectangle' ||
      activeTool === 'circle' ||
      activeTool === 'diamond' ||
      activeTool === 'triangle' ||
      activeTool === 'star' ||
      activeTool === 'line' ||
      activeTool === 'arrow'
    ) {
      const newShape: BaseShape = {
        id: newShapeId,
        type: activeTool,
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        strokeColor,
        fillColor: fillColor || 'transparent',
        strokeWidth,
        updatedAt: Date.now(),
        createdBy: currentUserId,
        zIndex: shapes.length,
      };
      setActiveShape(newShape);
    } else if (activeTool === 'stickyNote') {
      const newShape: BaseShape = {
        id: newShapeId,
        type: 'stickyNote',
        x: point.x - 80,
        y: point.y - 80,
        width: 160,
        height: 160,
        strokeColor: '#F97316',
        fillColor: '#FEF08A',
        strokeWidth: 1,
        text: 'Sticky Note',
        updatedAt: Date.now(),
        createdBy: currentUserId,
        zIndex: shapes.length,
      };
      onAddShape(newShape);
      setSelectedShapeIds([newShapeId]);
      setIsDrawing(false);
    } else if (activeTool === 'text') {
      const newShape: BaseShape = {
        id: newShapeId,
        type: 'text',
        x: point.x,
        y: point.y,
        width: 200,
        height: 40,
        strokeColor,
        strokeWidth: 1,
        text: 'Double-click to edit text',
        updatedAt: Date.now(),
        createdBy: currentUserId,
        zIndex: shapes.length,
      };
      onAddShape(newShape);
      setSelectedShapeIds([newShapeId]);
      setEditingTextId(newShapeId);
      setIsDrawing(false);
    }
  };

  // Handle pointer move
  const handlePointerMove = (e: React.PointerEvent) => {
    const point = screenToCanvas(e.clientX, e.clientY);
    onCursorMove(point);

    if (activeTool === 'select' && dragStart && activeShape) {
      const dx = point.x - dragStart.x;
      const dy = point.y - dragStart.y;

      // Update all selected shapes in multi-selection
      if (selectedShapeIds.length > 1) {
        shapes.forEach((s) => {
          if (selectedShapeIds.includes(s.id)) {
            const updated: BaseShape = {
              ...s,
              x: s.x + dx,
              y: s.y + dy,
              points: s.points?.map((p) => ({ x: p.x + dx, y: p.y + dy })),
              updatedAt: Date.now(),
            };
            onUpdateShape(updated);
          }
        });
      } else {
        const updated: BaseShape = {
          ...activeShape,
          x: activeShape.x + dx,
          y: activeShape.y + dy,
          points: activeShape.points?.map((p) => ({ x: p.x + dx, y: p.y + dy })),
          updatedAt: Date.now(),
        };
        setActiveShape(updated);
        onUpdateShape(updated);
      }
      setDragStart(point);
      return;
    }

    if (!isDrawing || !activeShape) return;

    if (activeShape.type === 'freehand') {
      const updatedPoints = [...currentPoints, point];
      setCurrentPoints(updatedPoints);
      setActiveShape({
        ...activeShape,
        points: updatedPoints,
        updatedAt: Date.now(),
      });
    } else {
      const width = point.x - activeShape.x;
      const height = point.y - activeShape.y;
      setActiveShape({
        ...activeShape,
        width,
        height,
        updatedAt: Date.now(),
      });
    }
  };

  // Handle pointer up
  const handlePointerUp = () => {
    if (activeTool === 'select') {
      setDragStart(null);
      return;
    }

    if (isDrawing && activeShape) {
      onAddShape(activeShape);
      setActiveShape(null);
      setIsDrawing(false);
      setCurrentPoints([]);
    }
  };

  const handlePointerLeave = () => {
    onCursorMove(null);
    if (isDrawing && activeShape) {
      onAddShape(activeShape);
      setActiveShape(null);
      setIsDrawing(false);
    }
  };

  // Render SVG Shape
  const renderSvgShape = (shape: BaseShape) => {
    const bounds = getShapeBounds(shape);

    if (shape.type === 'freehand') {
      if (!shape.points || shape.points.length === 0) return null;
      const pathD = renderFreehandStroke(shape.points, shape.strokeWidth);
      return (
        <path
          key={shape.id}
          d={pathD}
          fill={shape.strokeColor}
          opacity={shape.opacity ?? 1}
        />
      );
    }

    if (shape.type === 'rectangle') {
      return (
        <g key={shape.id} onDoubleClick={() => setEditingTextId(shape.id)}>
          <rect
            x={bounds.x}
            y={bounds.y}
            width={bounds.width}
            height={bounds.height}
            stroke={shape.strokeColor}
            fill={shape.fillColor || 'transparent'}
            strokeWidth={shape.strokeWidth}
            rx={6}
          />
          {editingTextId === shape.id ? (
            <foreignObject x={bounds.x + 4} y={bounds.y + 4} width={bounds.width - 8} height={bounds.height - 8}>
              <textarea
                autoFocus
                defaultValue={shape.text || ''}
                onChange={(e) => onUpdateShape({ ...shape, text: e.target.value, updatedAt: Date.now() })}
                onBlur={() => setEditingTextId(null)}
                className="w-full h-full bg-transparent text-slate-900 font-bold text-xs border-none focus:outline-none resize-none p-1 font-heading text-center"
              />
            </foreignObject>
          ) : (
            shape.text && (
              <text
                x={bounds.x + bounds.width / 2}
                y={bounds.y + bounds.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={shape.strokeColor}
                fontSize={13}
                fontWeight="700"
                fontFamily="var(--font-heading)"
              >
                {shape.text}
              </text>
            )
          )}
        </g>
      );
    }

    if (shape.type === 'circle') {
      const rx = bounds.width / 2;
      const ry = bounds.height / 2;
      const cx = bounds.x + rx;
      const cy = bounds.y + ry;
      return (
        <g key={shape.id} onDoubleClick={() => setEditingTextId(shape.id)}>
          <ellipse
            cx={cx}
            cy={cy}
            rx={Math.max(0, rx)}
            ry={Math.max(0, ry)}
            stroke={shape.strokeColor}
            fill={shape.fillColor || 'transparent'}
            strokeWidth={shape.strokeWidth}
          />
          {editingTextId === shape.id ? (
            <foreignObject x={bounds.x + 8} y={bounds.y + 8} width={bounds.width - 16} height={bounds.height - 16}>
              <textarea
                autoFocus
                defaultValue={shape.text || ''}
                onChange={(e) => onUpdateShape({ ...shape, text: e.target.value, updatedAt: Date.now() })}
                onBlur={() => setEditingTextId(null)}
                className="w-full h-full bg-transparent text-slate-900 font-bold text-xs border-none focus:outline-none resize-none p-1 font-heading text-center"
              />
            </foreignObject>
          ) : (
            shape.text && (
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={shape.strokeColor}
                fontSize={13}
                fontWeight="700"
                fontFamily="var(--font-heading)"
              >
                {shape.text}
              </text>
            )
          )}
        </g>
      );
    }

    if (shape.type === 'diamond') {
      const cx = bounds.x + bounds.width / 2;
      const cy = bounds.y + bounds.height / 2;
      const points = `${cx},${bounds.y} ${bounds.x + bounds.width},${cy} ${cx},${bounds.y + bounds.height} ${bounds.x},${cy}`;
      return (
        <g key={shape.id} onDoubleClick={() => setEditingTextId(shape.id)}>
          <polygon
            points={points}
            stroke={shape.strokeColor}
            fill={shape.fillColor || 'transparent'}
            strokeWidth={shape.strokeWidth}
          />
          {shape.text && (
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={shape.strokeColor}
              fontSize={13}
              fontWeight="700"
              fontFamily="var(--font-heading)"
            >
              {shape.text}
            </text>
          )}
        </g>
      );
    }

    if (shape.type === 'triangle') {
      const cx = bounds.x + bounds.width / 2;
      const points = `${cx},${bounds.y} ${bounds.x + bounds.width},${bounds.y + bounds.height} ${bounds.x},${bounds.y + bounds.height}`;
      return (
        <g key={shape.id} onDoubleClick={() => setEditingTextId(shape.id)}>
          <polygon
            points={points}
            stroke={shape.strokeColor}
            fill={shape.fillColor || 'transparent'}
            strokeWidth={shape.strokeWidth}
          />
          {shape.text && (
            <text
              x={cx}
              y={bounds.y + (bounds.height * 2) / 3}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={shape.strokeColor}
              fontSize={13}
              fontWeight="700"
              fontFamily="var(--font-heading)"
            >
              {shape.text}
            </text>
          )}
        </g>
      );
    }

    if (shape.type === 'star') {
      const cx = bounds.x + bounds.width / 2;
      const cy = bounds.y + bounds.height / 2;
      const outerR = Math.min(bounds.width, bounds.height) / 2;
      const innerR = outerR / 2.2;
      const pts: string[] = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return (
        <g key={shape.id} onDoubleClick={() => setEditingTextId(shape.id)}>
          <polygon
            points={pts.join(' ')}
            stroke={shape.strokeColor}
            fill={shape.fillColor || 'transparent'}
            strokeWidth={shape.strokeWidth}
          />
          {shape.text && (
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={shape.strokeColor}
              fontSize={12}
              fontWeight="700"
              fontFamily="var(--font-heading)"
            >
              {shape.text}
            </text>
          )}
        </g>
      );
    }

    if (shape.type === 'line' || shape.type === 'arrow') {
      const x2 = shape.x + (shape.width || 0);
      const y2 = shape.y + (shape.height || 0);
      return (
        <g key={shape.id}>
          <line
            x1={shape.x}
            y1={shape.y}
            x2={x2}
            y2={y2}
            stroke={shape.strokeColor}
            strokeWidth={shape.strokeWidth}
            strokeLinecap="round"
          />
          {shape.type === 'arrow' && (
            <marker
              id={`arrow_${shape.id}`}
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={shape.strokeColor} />
            </marker>
          )}
        </g>
      );
    }

    if (shape.type === 'stickyNote') {
      return (
        <g key={shape.id} onDoubleClick={() => setEditingTextId(shape.id)}>
          <rect
            x={bounds.x}
            y={bounds.y}
            width={bounds.width}
            height={bounds.height}
            fill={shape.fillColor || '#FEF08A'}
            stroke={shape.strokeColor || '#F97316'}
            strokeWidth={1.5}
            rx={12}
          />
          <foreignObject x={bounds.x + 8} y={bounds.y + 8} width={bounds.width - 16} height={bounds.height - 16}>
            <textarea
              defaultValue={shape.text || ''}
              onChange={(e) => onUpdateShape({ ...shape, text: e.target.value, updatedAt: Date.now() })}
              placeholder="Type note..."
              className="w-full h-full bg-transparent text-slate-900 font-semibold text-xs border-none focus:outline-none resize-none placeholder-slate-500 font-body"
            />
          </foreignObject>
        </g>
      );
    }

    if (shape.type === 'text') {
      return (
        <foreignObject key={shape.id} x={bounds.x} y={bounds.y} width={Math.max(150, bounds.width)} height={Math.max(40, bounds.height)}>
          <input
            type="text"
            defaultValue={shape.text || ''}
            onChange={(e) => onUpdateShape({ ...shape, text: e.target.value, updatedAt: Date.now() })}
            placeholder="Type text..."
            style={{ color: shape.strokeColor }}
            className="w-full bg-transparent font-extrabold text-lg border-b border-orange-500/40 focus:border-orange-500 focus:outline-none px-1 font-heading"
          />
        </foreignObject>
      );
    }

    return null;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      className="w-full h-screen bg-white touch-none overflow-hidden select-none relative cursor-crosshair"
    >
      {/* Background Light Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      {/* SVG Vector Layer */}
      <svg className="w-full h-full absolute inset-0 pointer-events-none">
        <g transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`}>
          {shapes.map((shape) => renderSvgShape(shape))}
          {activeShape && renderSvgShape(activeShape)}

          {/* Selection Bounding Box */}
          {selectedShapeIds.map((id) => {
            const shape = shapes.find((s) => s.id === id);
            if (!shape) return null;
            const bounds = getShapeBounds(shape);
            return (
              <rect
                key={`select_${id}`}
                x={bounds.x - 4}
                y={bounds.y - 4}
                width={bounds.width + 8}
                height={bounds.height + 8}
                fill="none"
                stroke={shape.strokeColor || '#F97316'}
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            );
          })}
        </g>
      </svg>

      {/* Realtime Multi-User Cursor Presence Overlay */}
      <PresenceCursors presences={presences} currentUserId={currentUserId} viewport={viewport} />
    </div>
  );
};
