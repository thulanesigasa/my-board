'use client';

import React from 'react';
import {
  MousePointer,
  Pencil,
  Highlighter,
  Square,
  Circle as CircleIcon,
  Minus,
  MoveRight,
  Type,
  StickyNote as StickyIcon,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  SlidersHorizontal,
} from 'lucide-react';
import { ToolType } from '@/types/board';

interface ToolbarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  fillColor: string;
  setFillColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClear: () => void;
}

const COLOR_PALETTE = [
  '#2563EB', '#3B82F6', '#0F172A', '#475569', '#EF4444',
  '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#FFFFFF', '#000000',
];

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  setActiveTool,
  strokeColor,
  setStrokeColor,
  fillColor,
  setFillColor,
  strokeWidth,
  setStrokeWidth,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClear,
}) => {
  const tools: { id: ToolType; label: string; icon: React.ReactNode }[] = [
    { id: 'select', label: 'Select & Move', icon: <MousePointer className="w-4 h-4" /> },
    { id: 'pencil', label: 'Freehand Pencil', icon: <Pencil className="w-4 h-4" /> },
    { id: 'highlighter', label: 'Highlighter', icon: <Highlighter className="w-4 h-4" /> },
    { id: 'rectangle', label: 'Rectangle', icon: <Square className="w-4 h-4" /> },
    { id: 'circle', label: 'Circle', icon: <CircleIcon className="w-4 h-4" /> },
    { id: 'line', label: 'Straight Line', icon: <Minus className="w-4 h-4" /> },
    { id: 'arrow', label: 'Vector Arrow', icon: <MoveRight className="w-4 h-4" /> },
    { id: 'text', label: 'Text Box', icon: <Type className="w-4 h-4" /> },
    { id: 'stickyNote', label: 'Sticky Note', icon: <StickyIcon className="w-4 h-4" /> },
    { id: 'eraser', label: 'Eraser', icon: <Eraser className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2.5 pointer-events-auto">
      {/* Secondary Customization Bar */}
      <div className="glass-card px-4 py-2 flex items-center gap-4 text-xs shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Color</span>
          <div className="flex gap-1.5">
            {COLOR_PALETTE.slice(0, 7).map((color) => (
              <button
                key={color}
                onClick={() => setStrokeColor(color)}
                className={`w-4.5 h-4.5 rounded-full border transition-all ${
                  strokeColor === color
                    ? 'ring-2 ring-blue-600 scale-125 border-white shadow-md'
                    : 'border-slate-300 hover:scale-110 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Thickness</span>
          <input
            type="range"
            min={2}
            max={24}
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-20 accent-blue-600 cursor-pointer"
          />
          <span className="text-slate-700 font-mono w-4 text-center font-bold">{strokeWidth}</span>
        </div>
      </div>

      {/* Main Tool Bar */}
      <div className="glass-card p-1.5 flex items-center gap-1 shadow-xl">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              title={tool.label}
              className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tool.icon}
              {isActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
              )}
            </button>
          );
        })}

        <div className="h-5 w-px bg-slate-200 mx-1" />

        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
          className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
          className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onClear}
          title="Clear Board"
          className="p-2.5 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
