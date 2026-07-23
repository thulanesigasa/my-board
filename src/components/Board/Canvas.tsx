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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [viewport, setViewport] = useState<CanvasViewport>({ x: 0, y: 0, zoom: 1 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);
  const [activeShape, setActiveShape] = useState<BaseShape | null>(null);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  // Convert screen coordinates to canvas viewport coordinates
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

  // Handle pointer down (Mouse/Touch/Stylus)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (editingTextId) setEditingTextId(null);

    const point = screenToCanvas(e.clientX, e.clientY);

    if (activeTool === 'select') {
      // Hit test shapes top to bottom
      const clickedShape = [...shapes].reverse().find((s) => isPointInShape(point, s));
      if (clickedShape) {
        setSelectedShapeIds([clickedShape.id]);
        setActiveShape(clickedShape);
        setDragStart(point);
      } else {
        setSelectedShapeIds([]);
        setActiveShape(null);
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
    } else if (activeTool === 'rectangle' || activeTool === 'circle' || activeTool === 'line' || activeTool === 'arrow') {
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
        strokeColor: '#FACC15',
        fillColor: '#FEF08A',
        strokeWidth: 1,
        text: 'New Note',
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
        text: 'Type text...',
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

      const updated: BaseShape = {
        ...activeShape,
        x: activeShape.x + dx,
        y: activeShape.y + dy,
        points: activeShape.points?.map((p) => ({ x: p.x + dx, y: p.y + dy })),
        updatedAt: Date.now(),
      };
      setActiveShape(updated);
      onUpdateShape(updated);
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
    } else if (activeShape.type === 'rectangle' || activeShape.type === 'circle' || activeShape.type === 'line' || activeShape.type === 'arrow') {
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
    const isSelected = selectedShapeIds.includes(shape.id);

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
      const bounds = getShapeBounds(shape);
      return (
        <rect
          key={shape.id}
          x={bounds.x}
          y={bounds.y}
          width={bounds.width}
          height={bounds.height}
          stroke={shape.strokeColor}
          fill={shape.fillColor || 'transparent'}
          strokeWidth={shape.strokeWidth}
          rx={6}
        />
      );
    }

    if (shape.type === 'circle') {
      const bounds = getShapeBounds(shape);
      const rx = bounds.width / 2;
      const ry = bounds.height / 2;
      const cx = bounds.x + rx;
      const cy = bounds.y + ry;
      return (
        <ellipse
          key={shape.id}
          cx={cx}
          cy={cy}
          rx={Math.max(0, rx)}
          ry={Math.max(0, ry)}
          stroke={shape.strokeColor}
          fill={shape.fillColor || 'transparent'}
          strokeWidth={shape.strokeWidth}
        />
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
      const bounds = getShapeBounds(shape);
      return (
        <g key={shape.id}>
          <rect
            x={bounds.x}
            y={bounds.y}
            width={bounds.width}
            height={bounds.height}
            fill={shape.fillColor || '#FEF08A'}
            stroke="#EAB308"
            strokeWidth={1}
            rx={8}
            className="shadow-xl"
          />
          <foreignObject x={bounds.x + 8} y={bounds.y + 8} width={bounds.width - 16} height={bounds.height - 16}>
            <textarea
              defaultValue={shape.text || ''}
              onChange={(e) => onUpdateShape({ ...shape, text: e.target.value, updatedAt: Date.now() })}
              placeholder="Type note..."
              className="w-full h-full bg-transparent text-slate-900 font-medium text-sm border-none focus:outline-none resize-none placeholder-slate-500"
            />
          </foreignObject>
        </g>
      );
    }

    if (shape.type === 'text') {
      const bounds = getShapeBounds(shape);
      return (
        <foreignObject key={shape.id} x={bounds.x} y={bounds.y} width={Math.max(150, bounds.width)} height={Math.max(40, bounds.height)}>
          <input
            type="text"
            defaultValue={shape.text || ''}
            onChange={(e) => onUpdateShape({ ...shape, text: e.target.value, updatedAt: Date.now() })}
            placeholder="Type text..."
            style={{ color: shape.strokeColor }}
            className="w-full bg-transparent font-semibold text-lg border-b border-indigo-500/40 focus:border-indigo-400 focus:outline-none px-1"
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
      className="w-full h-screen bg-slate-950 touch-none overflow-hidden select-none relative cursor-crosshair"
    >
      {/* Background Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

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
                stroke="#6366F1"
                strokeWidth={1.5}
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
