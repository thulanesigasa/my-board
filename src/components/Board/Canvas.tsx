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

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelectedShapeIds(shapes.map((s) => s.id));
        return;
      }

      if (isCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (onUndo) onUndo();
        return;
      }

      if ((isCtrl && e.key.toLowerCase() === 'y') || (isCtrl && e.shiftKey && e.key.toLowerCase() === 'z')) {
        e.preventDefault();
        if (onRedo) onRedo();
        return;
      }

      if (isCtrl && e.key.toLowerCase() === 'c' && selectedShapeIds.length > 0) {
        e.preventDefault();
        setClipboard(shapes.filter((s) => selectedShapeIds.includes(s.id)));
        return;
      }

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

      if (isCtrl && e.key.toLowerCase() === 'd' && selectedShapeIds.length > 0) {
        e.preventDefault();
        const newSelectedIds: string[] = [];
        shapes
          .filter((s) => selectedShapeIds.includes(s.id))
          .forEach((shape) => {
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

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedShapeIds.length > 0) {
        e.preventDefault();
        selectedShapeIds.forEach((id) => onDeleteShape(id));
        setSelectedShapeIds([]);
        setActiveShape(null);
        return;
      }

      if (e.key === 'Escape') {
        setSelectedShapeIds([]);
        setActiveShape(null);
        setEditingTextId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shapes, selectedShapeIds, clipboard, onAddShape, onDeleteShape, onUndo, onRedo]);

  // Handle pointer down
  const handlePointerDown = (e: React.PointerEvent) => {
    if (editingTextId) setEditingTextId(null);

    const point = screenToCanvas(e.clientX, e.clientY);
    const isMultiSelectKey = e.ctrlKey || e.shiftKey || e.metaKey;

    if (activeTool === 'select') {
      const clickedShape = [...shapes].reverse().find((s) => isPointInShape(point, s));
      if (clickedShape) {
        if (isMultiSelectKey) {
          setSelectedShapeIds((prev) =>
            prev.includes(clickedShape.id)
              ? prev.filter((id) => id !== clickedShape.id)
              : [...prev, clickedShape.id]
          );
        } else {
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

    // Handle Rich Feature Widgets Placement
    if (
      activeTool === 'kanban' ||
      activeTool === 'table' ||
      activeTool === 'timeline' ||
      activeTool === 'doc' ||
      activeTool === 'slides' ||
      activeTool === 'prototype' ||
      activeTool === 'diagram' ||
      activeTool === 'engage' ||
      activeTool === 'talktrack'
    ) {
      const newShapeId = `widget_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const widgetDefaults: Record<string, { width: number; height: number; text: string }> = {
        kanban: { width: 440, height: 260, text: 'Sprint Kanban Board' },
        table: { width: 380, height: 200, text: 'Data Matrix Table' },
        timeline: { width: 480, height: 180, text: 'Product Roadmap Timeline' },
        doc: { width: 340, height: 240, text: 'Project Brief Doc' },
        slides: { width: 420, height: 260, text: 'Pitch Presentation Deck' },
        prototype: { width: 220, height: 380, text: 'Mobile App Prototype' },
        diagram: { width: 420, height: 200, text: 'Flowchart Architecture' },
        engage: { width: 320, height: 220, text: 'Team Engagement Poll' },
        talktrack: { width: 320, height: 180, text: 'Audio/Video Talktrack' },
      };

      const meta = widgetDefaults[activeTool] || { width: 300, height: 200, text: 'Widget' };
      const newWidgetShape: BaseShape = {
        id: newShapeId,
        type: activeTool,
        x: point.x - meta.width / 2,
        y: point.y - meta.height / 2,
        width: meta.width,
        height: meta.height,
        strokeColor: '#F97316',
        fillColor: '#FFFFFF',
        strokeWidth: 1,
        text: meta.text,
        updatedAt: Date.now(),
        createdBy: currentUserId,
        zIndex: shapes.length,
      };

      onAddShape(newWidgetShape);
      setSelectedShapeIds([newShapeId]);
      setIsDrawing(false);
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

  // Render SVG & Rich Feature Widget Shapes
  const renderSvgShape = (shape: BaseShape) => {
    const bounds = getShapeBounds(shape);

    if (shape.type === 'freehand') {
      if (!shape.points || shape.points.length === 0) return null;
      const pathD = renderFreehandStroke(shape.points, shape.strokeWidth);
      return (
        <path key={shape.id} d={pathD} fill={shape.strokeColor} opacity={shape.opacity ?? 1} />
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

    // 📋 KANBAN BOARD WIDGET RENDERER
    if (shape.type === 'kanban') {
      return (
        <foreignObject key={shape.id} x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height}>
          <div className="w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-3 flex flex-col justify-between font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <span className="font-extrabold text-xs text-slate-900 font-heading">📋 {shape.text || 'Kanban Board'}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-mono font-bold text-[9px]">3 Columns</span>
            </div>
            <div className="grid grid-cols-3 gap-2 flex-1 text-[10px]">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">To Do</span>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm font-medium">Design System</div>
              </div>
              <div className="bg-orange-50/50 p-2 rounded-xl border border-orange-200">
                <span className="font-bold text-orange-700 block mb-1">In Progress</span>
                <div className="bg-white p-1.5 rounded-lg border border-orange-200 shadow-sm font-medium">CRDT Sync Engine</div>
              </div>
              <div className="bg-emerald-50/50 p-2 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-700 block mb-1">Done</span>
                <div className="bg-white p-1.5 rounded-lg border border-emerald-200 shadow-sm font-medium">120Hz Bezier Ink</div>
              </div>
            </div>
          </div>
        </foreignObject>
      );
    }

    // 📊 DATA TABLE WIDGET RENDERER
    if (shape.type === 'table') {
      return (
        <foreignObject key={shape.id} x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height}>
          <div className="w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-3 flex flex-col font-sans">
            <div className="font-extrabold text-xs text-slate-900 font-heading mb-2 border-b border-slate-100 pb-1">
              📊 {shape.text || 'Data Matrix Table'}
            </div>
            <table className="w-full text-left text-[10px] border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold font-mono">
                  <th className="p-1.5 border border-slate-200">Feature</th>
                  <th className="p-1.5 border border-slate-200">Status</th>
                  <th className="p-1.5 border border-slate-200">Priority</th>
                </tr>
              </thead>
              <tbody className="font-medium text-slate-600">
                <tr>
                  <td className="p-1.5 border border-slate-200">WebSocket Sync</td>
                  <td className="p-1.5 border border-slate-200 text-emerald-600 font-bold">Active</td>
                  <td className="p-1.5 border border-slate-200 text-orange-500 font-bold">High</td>
                </tr>
                <tr>
                  <td className="p-1.5 border border-slate-200">SVG Export</td>
                  <td className="p-1.5 border border-slate-200 text-emerald-600 font-bold">Ready</td>
                  <td className="p-1.5 border border-slate-200">Normal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </foreignObject>
      );
    }

    // ⏳ ROADMAP TIMELINE WIDGET RENDERER
    if (shape.type === 'timeline') {
      return (
        <foreignObject key={shape.id} x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height}>
          <div className="w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-3 flex flex-col justify-between font-sans">
            <div className="font-extrabold text-xs text-slate-900 font-heading mb-2 border-b border-slate-100 pb-1">
              ⏳ {shape.text || 'Product Roadmap Timeline'}
            </div>
            <div className="flex items-center justify-between relative px-4">
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 z-0" />
              <div className="relative z-10 text-center bg-white px-2">
                <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-extrabold text-[9px] flex items-center justify-center mx-auto mb-1">1</span>
                <span className="text-[10px] font-bold text-slate-800 block">Q1 Ink</span>
              </div>
              <div className="relative z-10 text-center bg-white px-2">
                <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-extrabold text-[9px] flex items-center justify-center mx-auto mb-1">2</span>
                <span className="text-[10px] font-bold text-slate-800 block">Q2 CRDT</span>
              </div>
              <div className="relative z-10 text-center bg-white px-2">
                <span className="w-4 h-4 rounded-full bg-slate-300 text-white font-extrabold text-[9px] flex items-center justify-center mx-auto mb-1">3</span>
                <span className="text-[10px] font-bold text-slate-500 block">Q3 Export</span>
              </div>
            </div>
          </div>
        </foreignObject>
      );
    }

    // 📱 MOBILE PROTOTYPE WIDGET RENDERER
    if (shape.type === 'prototype') {
      return (
        <foreignObject key={shape.id} x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height}>
          <div className="w-full h-full bg-slate-900 rounded-[28px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col justify-between font-sans text-white">
            <div className="w-16 h-2 rounded-full bg-slate-700 mx-auto mb-2" />
            <div className="bg-slate-800 rounded-xl p-3 flex-1 flex flex-col justify-between border border-slate-700">
              <span className="text-[11px] font-bold text-orange-400 font-heading">📱 App Prototype</span>
              <p className="text-[9px] text-slate-300 font-body">Tap hotspot to trigger interactive screen transition</p>
              <div className="w-full py-1.5 bg-orange-500 rounded-lg text-center text-[10px] font-bold">Interactive Screen</div>
            </div>
            <div className="w-8 h-1 rounded-full bg-slate-600 mx-auto mt-2" />
          </div>
        </foreignObject>
      );
    }

    // 🔀 FLOW DIAGRAM WIDGET RENDERER
    if (shape.type === 'diagram') {
      return (
        <foreignObject key={shape.id} x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height}>
          <div className="w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-3 flex flex-col justify-between font-sans">
            <div className="font-extrabold text-xs text-slate-900 font-heading border-b border-slate-100 pb-1">
              🔀 Flow Architecture Diagram
            </div>
            <div className="flex items-center justify-between px-2 gap-2 text-[10px] font-bold">
              <div className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-center flex-1">Client Event</div>
              <span>→</span>
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-center flex-1">Socket WS</div>
              <span>→</span>
              <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-center flex-1">PostgreSQL DB</div>
            </div>
          </div>
        </foreignObject>
      );
    }

    // 📄 RICH DOC WIDGET RENDERER
    if (shape.type === 'doc') {
      return (
        <foreignObject key={shape.id} x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height}>
          <div className="w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-4 flex flex-col justify-between font-sans">
            <div className="border-b border-slate-200 pb-2">
              <span className="font-extrabold text-xs text-slate-900 font-heading block">📄 Project Spec Doc</span>
              <span className="text-[9px] text-slate-400 font-mono">Updated 5m ago</span>
            </div>
            <textarea
              defaultValue={shape.text || 'Write your project specification documentation notes directly inside this interactive canvas block...'}
              onChange={(e) => onUpdateShape({ ...shape, text: e.target.value, updatedAt: Date.now() })}
              className="w-full flex-1 bg-transparent text-[10px] text-slate-700 border-none focus:outline-none resize-none pt-2 font-body"
            />
          </div>
        </foreignObject>
      );
    }

    // 🎬 SLIDES PRESENTATION WIDGET RENDERER
    if (shape.type === 'slides') {
      return (
        <foreignObject key={shape.id} x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height}>
          <div className="w-full h-full bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl p-4 flex flex-col justify-between font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-extrabold text-xs text-orange-400 font-heading">🎬 Slide 01 / 05</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-slate-300">Presentation Deck</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm font-heading">{shape.text || 'Pitch Deck Title Slide'}</h3>
              <p className="text-[10px] text-slate-300 font-body">120Hz Collaborative Canvas Deck</p>
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-800">
              <button className="hover:text-white">← Previous</button>
              <button className="hover:text-white">Next →</button>
            </div>
          </div>
        </foreignObject>
      );
    }

    // 🎯 ENGAGE ACTIVITIES WIDGET RENDERER
    if (shape.type === 'engage') {
      return (
        <foreignObject key={shape.id} x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height}>
          <div className="w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl p-3.5 flex flex-col justify-between font-sans">
            <div className="font-extrabold text-xs text-slate-900 font-heading border-b border-slate-100 pb-1">
              🎯 Live Team Voting Poll
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="p-1.5 rounded-lg bg-orange-50 border border-orange-200 flex justify-between items-center font-bold text-orange-700">
                <span>Option A: Instant WS Sync</span>
                <span>8 votes</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center font-bold text-slate-700">
                <span>Option B: Vector Export</span>
                <span>4 votes</span>
              </div>
            </div>
          </div>
        </foreignObject>
      );
    }

    // 📹 TALKTRACK PLAYER WIDGET RENDERER
    if (shape.type === 'talktrack') {
      return (
        <foreignObject key={shape.id} x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height}>
          <div className="w-full h-full bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl p-3.5 flex flex-col justify-between font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <span className="font-extrabold text-xs text-teal-400 font-heading">📹 Talktrack Walkthrough</span>
              <span className="text-[9px] font-mono text-slate-400">01:45</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-extrabold text-xs">▶</div>
              <div className="flex-1 space-y-1">
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-orange-500" />
                </div>
                <span className="text-[9px] text-slate-400 block font-mono">Recorded by Thulane</span>
              </div>
            </div>
          </div>
        </foreignObject>
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
          <polygon points={points} stroke={shape.strokeColor} fill={shape.fillColor || 'transparent'} strokeWidth={shape.strokeWidth} />
          {shape.text && (
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill={shape.strokeColor} fontSize={13} fontWeight="700" fontFamily="var(--font-heading)">
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
          <polygon points={points} stroke={shape.strokeColor} fill={shape.fillColor || 'transparent'} strokeWidth={shape.strokeWidth} />
          {shape.text && (
            <text x={cx} y={bounds.y + (bounds.height * 2) / 3} textAnchor="middle" dominantBaseline="middle" fill={shape.strokeColor} fontSize={13} fontWeight="700" fontFamily="var(--font-heading)">
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
          <polygon points={pts.join(' ')} stroke={shape.strokeColor} fill={shape.fillColor || 'transparent'} strokeWidth={shape.strokeWidth} />
          {shape.text && (
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill={shape.strokeColor} fontSize={12} fontWeight="700" fontFamily="var(--font-heading)">
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
          <line x1={shape.x} y1={shape.y} x2={x2} y2={y2} stroke={shape.strokeColor} strokeWidth={shape.strokeWidth} strokeLinecap="round" />
          {shape.type === 'arrow' && (
            <marker id={`arrow_${shape.id}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={shape.strokeColor} />
            </marker>
          )}
        </g>
      );
    }

    if (shape.type === 'stickyNote') {
      return (
        <g key={shape.id} onDoubleClick={() => setEditingTextId(shape.id)}>
          <rect x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height} fill={shape.fillColor || '#FEF08A'} stroke={shape.strokeColor || '#F97316'} strokeWidth={1.5} rx={12} />
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
