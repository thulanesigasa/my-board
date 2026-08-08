'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ToolType } from '@/types/board';
import {
  Smartphone,
  GitFork,
  Table as TableIcon,
  Clock,
  Kanban as KanbanIcon,
  FileText,
  Presentation,
  Target,
  Video,
  Plus,
} from 'lucide-react';

interface WidgetPickerMenuProps {
  onSelectWidget: (tool: ToolType) => void;
}

export const WidgetPickerMenu: React.FC<WidgetPickerMenuProps> = ({ onSelectWidget }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const items: { id: ToolType; label: string; icon: React.ReactNode; color: string; badge?: string }[] = [
    { id: 'prototype', label: 'Prototype', icon: <Smartphone className="w-4.5 h-4.5" />, color: 'text-purple-600', badge: '↑' },
    { id: 'diagram', label: 'Diagram', icon: <GitFork className="w-4.5 h-4.5" />, color: 'text-orange-500' },
    { id: 'table', label: 'Table', icon: <TableIcon className="w-4.5 h-4.5" />, color: 'text-emerald-600' },
    { id: 'timeline', label: 'Timeline', icon: <Clock className="w-4.5 h-4.5" />, color: 'text-green-600' },
    { id: 'kanban', label: 'Kanban', icon: <KanbanIcon className="w-4.5 h-4.5" />, color: 'text-emerald-500' },
    { id: 'doc', label: 'Doc', icon: <FileText className="w-4.5 h-4.5" />, color: 'text-cyan-600' },
    { id: 'slides', label: 'Slides', icon: <Presentation className="w-4.5 h-4.5" />, color: 'text-red-500' },
    { id: 'engage', label: 'Engage activities', icon: <Target className="w-4.5 h-4.5" />, color: 'text-rose-500' },
    { id: 'talktrack', label: 'Talktrack', icon: <Video className="w-4.5 h-4.5" />, color: 'text-teal-600' },
  ];

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card px-3.5 py-2 hover:border-orange-500/40 text-slate-900 font-bold text-xs transition shadow-md flex items-center gap-2 font-heading bg-white"
        title="Insert Feature Widgets & Templates"
      >
        <Plus className="w-4 h-4 text-orange-500" />
        <span className="hidden sm:inline">Add Feature</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 glass-card p-2 shadow-2xl z-50 bg-white border border-slate-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1 font-mono">
            Interactive Widgets & Tools
          </div>

          <div className="space-y-0.5">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectWidget(item.id);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-100/90 flex items-center justify-between text-left transition group"
              >
                <div className="flex items-center gap-3">
                  <span className={`${item.color} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 font-body group-hover:text-slate-900">
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold flex items-center justify-center font-mono border border-slate-200">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
