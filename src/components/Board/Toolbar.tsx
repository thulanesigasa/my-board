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
  '#000000', '#FFFFFF', '#EF4444', '#F97316', '#F59E0B',
  '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
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
    { id: 'select', label: 'Select / Move', icon: <MousePointer className="w-5 h-5" /> },
    { id: 'pencil', label: 'Pencil', icon: <Pencil className="w-5 h-5" /> },
    { id: 'highlighter', label: 'Highlighter', icon: <Highlighter className="w-5 h-5" /> },
    { id: 'rectangle', label: 'Rectangle', icon: <Square className="w-5 h-5" /> },
    { id: 'circle', label: 'Circle', icon: <CircleIcon className="w-5 h-5" /> },
    { id: 'line', label: 'Line', icon: <Minus className="w-5 h-5" /> },
    { id: 'arrow', label: 'Arrow', icon: <MoveRight className="w-5 h-5" /> },
    { id: 'text', label: 'Text', icon: <Type className="w-5 h-5" /> },
    { id: 'stickyNote', label: 'Sticky Note', icon: <StickyIcon className="w-5 h-5" /> },
    { id: 'eraser', label: 'Eraser', icon: <Eraser className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3">
      {/* Secondary Controls: Colors & Thickness */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl px-4 py-2 shadow-2xl flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Stroke:</span>
          <div className="flex gap-1">
            {COLOR_PALETTE.slice(0, 7).map((color) => (
              <button
                key={color}
                onClick={() => setStrokeColor(color)}
                className={`w-5 h-5 rounded-full border transition ${
                  strokeColor === color ? 'ring-2 ring-indigo-500 scale-110 border-white' : 'border-slate-700 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Size:</span>
          <input
            type="range"
            min={2}
            max={24}
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-20 accent-indigo-500 cursor-pointer"
          />
          <span className="text-slate-300 font-mono w-4 text-center">{strokeWidth}</span>
        </div>
      </div>

      {/* Main Tool Bar */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-2 shadow-2xl flex items-center gap-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            title={tool.label}
            className={`p-2.5 rounded-xl transition flex items-center justify-center ${
              activeTool === tool.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            {tool.icon}
          </button>
        ))}

        <div className="h-6 w-px bg-slate-800 mx-1" />

        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/70 disabled:opacity-30 disabled:hover:bg-transparent transition"
        >
          <Undo2 className="w-5 h-5" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/70 disabled:opacity-30 disabled:hover:bg-transparent transition"
        >
          <Redo2 className="w-5 h-5" />
        </button>

        <button
          onClick={onClear}
          title="Clear Board"
          className="p-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
