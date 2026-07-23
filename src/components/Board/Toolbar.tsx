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
  '#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F97316',
  '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#FFFFFF', '#000000',
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
      <div className="glass-card px-4 py-2 flex items-center gap-4 text-xs shadow-2xl">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Color</span>
          <div className="flex gap-1.5">
            {COLOR_PALETTE.slice(0, 7).map((color) => (
              <button
                key={color}
                onClick={() => setStrokeColor(color)}
                className={`w-4.5 h-4.5 rounded-full border transition-all ${
                  strokeColor === color
                    ? 'ring-2 ring-indigo-500 scale-125 border-white shadow-lg'
                    : 'border-slate-700/80 hover:scale-110 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Thickness</span>
          <input
            type="range"
            min={2}
            max={24}
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-20 accent-indigo-500 cursor-pointer"
          />
          <span className="text-slate-300 font-mono w-4 text-center font-bold">{strokeWidth}</span>
        </div>
      </div>

      {/* Main Tool Bar */}
      <div className="glass-card p-1.5 flex items-center gap-1 shadow-2xl">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              title={tool.label}
              className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center relative ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tool.icon}
              {isActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-ping" />
              )}
            </button>
          );
        })}

        <div className="h-5 w-px bg-white/10 mx-1" />

        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 disabled:opacity-30 disabled:hover:bg-transparent transition"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 disabled:opacity-30 disabled:hover:bg-transparent transition"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onClear}
          title="Clear Board"
          className="p-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
