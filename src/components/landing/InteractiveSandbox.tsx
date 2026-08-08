'use client';

import React, { useState, useRef, useEffect } from 'react';

interface SandboxShape {
  id: number;
  type: 'rect' | 'circle' | 'note';
  x: number;
  y: number;
  title: string;
  bodyText: string;
  color: string;
}

const PALETTE = ['#F97316', '#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#475569'];

export const InteractiveSandbox: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'rect' | 'circle' | 'note'>('rect');
  const [shapes, setShapes] = useState<SandboxShape[]>([
    {
      id: 1,
      type: 'note',
      x: 40,
      y: 40,
      title: 'UX Brainstorming',
      bodyText: 'Double-click to write multiline notes below heading',
      color: '#F59E0B',
    },
    {
      id: 2,
      type: 'rect',
      x: 250,
      y: 50,
      title: 'System Architecture',
      bodyText: 'Socket.IO + Supabase DB',
      color: '#2563EB',
    },
    {
      id: 3,
      type: 'circle',
      x: 480,
      y: 45,
      title: 'PostgreSQL DB',
      bodyText: 'Realtime Snapshot Sync',
      color: '#10B981',
    },
  ]);

  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [editingId, setEditingId] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const draggingIdRef = useRef<number | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Instant Delete & Backspace Key Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId !== null) {
        e.preventDefault();
        setShapes((prev) => prev.filter((s) => s.id !== selectedId));
        setSelectedId(null);
        setEditingId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  const addShape = () => {
    const newId = Date.now();
    const newShape: SandboxShape = {
      id: newId,
      type: activeTool,
      x: Math.floor(Math.random() * 350) + 40,
      y: Math.floor(Math.random() * 100) + 40,
      title: activeTool === 'note' ? 'Sticky Note Title' : activeTool === 'rect' ? 'Rectangle Heading' : 'Circle Heading',
      bodyText: 'Type your detailed body text content underneath...',
      color: activeTool === 'note' ? '#F59E0B' : activeTool === 'rect' ? '#2563EB' : '#10B981',
    };
    setShapes([...shapes, newShape]);
    setSelectedId(newId);
    setEditingId(newId);
  };

  // High-frequency native pointer drag handling matching physical mouse cursor speed 1-to-1
  const handlePointerDown = (id: number, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    draggingIdRef.current = id;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const shape = shapes.find((s) => s.id === id);
    if (shape && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      dragOffsetRef.current = {
        x: e.clientX - rect.left - shape.x,
        y: e.clientY - rect.top - shape.y,
      };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingIdRef.current === null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.min(rect.width - 180, e.clientX - rect.left - dragOffsetRef.current.x));
    const newY = Math.max(10, Math.min(rect.height - 120, e.clientY - rect.top - dragOffsetRef.current.y));

    setShapes((prev) =>
      prev.map((s) => (s.id === draggingIdRef.current ? { ...s, x: newX, y: newY } : s))
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingIdRef.current !== null) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback if capture already released
      }
      draggingIdRef.current = null;
    }
  };

  // Deactivate active shapes when double-clicking or single-clicking on empty background
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).classList.contains('canvas-grid-bg')) {
      setSelectedId(null);
      setEditingId(null);
    }
  };

  const updateSelectedColor = (color: string) => {
    if (selectedId === null) return;
    setShapes((prev) => prev.map((s) => (s.id === selectedId ? { ...s, color } : s)));
  };

  const updateSelectedTitle = (title: string) => {
    if (selectedId === null) return;
    setShapes((prev) => prev.map((s) => (s.id === selectedId ? { ...s, title } : s)));
  };

  const updateSelectedBody = (bodyText: string) => {
    if (selectedId === null) return;
    setShapes((prev) => prev.map((s) => (s.id === selectedId ? { ...s, bodyText } : s)));
  };

  const selectedShape = shapes.find((s) => s.id === selectedId);

  return (
    <section id="sandbox" className="py-20 bg-[var(--color-bg)] relative z-10 border-b border-slate-200 font-sans">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 font-heading">
          Try The Live Interactive Canvas Sandbox
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mb-10 leading-relaxed font-body">
          Drag shapes around, double-click to edit, or press <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-xs font-mono font-bold">Delete</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-xs font-mono font-bold">Backspace</kbd> to remove shapes instantly.
        </p>

        {/* Sandbox Glass Container */}
        <div className="glass-card p-6 shadow-2xl relative overflow-hidden max-w-4xl mx-auto text-left">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">Tool:</span>
              <button
                onClick={() => setActiveTool('rect')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTool === 'rect' ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Rectangle
              </button>
              <button
                onClick={() => setActiveTool('circle')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTool === 'circle' ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Circle
              </button>
              <button
                onClick={() => setActiveTool('note')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTool === 'note' ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Sticky Note
              </button>
            </div>

            {/* Color Change Palette */}
            {selectedShape && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">Color:</span>
                <div className="flex gap-1.5">
                  {PALETTE.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateSelectedColor(c)}
                      className={`w-5 h-5 rounded-full border transition-transform ${
                        selectedShape.color === c ? 'scale-125 ring-2 ring-orange-500 border-white' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button onClick={addShape} className="btn-primary text-xs !py-1.5 !px-4">
                + Place Shape
              </button>
              <button
                onClick={() => setShapes([])}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition"
              >
                Clear Sandbox
              </button>
            </div>
          </div>

          {/* Interactive Drag & Drop Canvas */}
          <div
            ref={containerRef}
            onClick={handleBackgroundClick}
            onDoubleClick={handleBackgroundClick}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="canvas-grid-bg h-96 rounded-2xl bg-white border border-slate-200 relative overflow-hidden shadow-inner select-none cursor-crosshair touch-none"
          >
            <div className="canvas-grid-bg absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />

            {shapes.map((s) => {
              const isSelected = selectedId === s.id;
              const isEditing = editingId === s.id;

              const activeOutlineStyle = isSelected
                ? {
                    boxShadow: `0 0 0 2.5px ${s.color}, 0 10px 20px -5px ${s.color}40`,
                  }
                : {};

              if (s.type === 'note') {
                return (
                  <div
                    key={s.id}
                    onPointerDown={(e) => handlePointerDown(s.id, e)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingId(s.id);
                    }}
                    className={`absolute w-44 h-36 p-3 rounded-xl shadow-lg transition-transform cursor-grab active:cursor-grabbing font-bold text-xs flex flex-col justify-start touch-none ${
                      isSelected ? 'scale-105 z-30' : 'z-10'
                    }`}
                    style={{
                      left: `${s.x}px`,
                      top: `${s.y}px`,
                      backgroundColor: s.color === '#F59E0B' ? '#FEF3C7' : `${s.color}20`,
                      borderColor: s.color,
                      borderWidth: '1.5px',
                      color: '#0F172A',
                      ...activeOutlineStyle,
                    }}
                  >
                    {isEditing ? (
                      <div className="space-y-1 w-full h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          autoFocus
                          value={s.title}
                          onChange={(e) => updateSelectedTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setEditingId(null);
                          }}
                          className="w-full bg-transparent font-extrabold text-xs text-slate-900 border-b border-amber-300/60 focus:outline-none pb-1 font-heading"
                        />
                        <textarea
                          rows={3}
                          value={s.bodyText}
                          onChange={(e) => updateSelectedBody(e.target.value)}
                          className="w-full bg-transparent text-[10px] text-slate-700 font-normal leading-tight focus:outline-none resize-none flex-1 font-body pt-1"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col">
                        <h4 className="font-extrabold text-xs text-slate-900 mb-1 border-b border-amber-300/40 pb-1 font-heading">
                          {s.title}
                        </h4>
                        <p className="text-[10px] text-slate-700 font-normal leading-tight font-body flex-1">
                          {s.bodyText}
                        </p>
                      </div>
                    )}
                  </div>
                );
              }

              if (s.type === 'circle') {
                return (
                  <div
                    key={s.id}
                    onPointerDown={(e) => handlePointerDown(s.id, e)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingId(s.id);
                    }}
                    className={`absolute w-36 h-36 rounded-full border-2 font-bold text-xs flex flex-col items-center justify-center text-center p-3 shadow-lg cursor-grab active:cursor-grabbing touch-none ${
                      isSelected ? 'scale-105 z-30' : 'z-10'
                    }`}
                    style={{
                      left: `${s.x}px`,
                      top: `${s.y}px`,
                      borderColor: s.color,
                      backgroundColor: `${s.color}15`,
                      color: s.color,
                      ...activeOutlineStyle,
                    }}
                  >
                    {isEditing ? (
                      <div className="space-y-1 w-28 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          autoFocus
                          value={s.title}
                          onChange={(e) => updateSelectedTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setEditingId(null);
                          }}
                          className="w-full bg-transparent font-extrabold text-xs text-slate-900 focus:outline-none text-center font-heading border-b border-current/20 pb-0.5"
                        />
                        <textarea
                          rows={2}
                          value={s.bodyText}
                          onChange={(e) => updateSelectedBody(e.target.value)}
                          className="w-full bg-transparent text-[9px] text-slate-700 font-normal leading-tight focus:outline-none text-center resize-none font-body pt-1"
                        />
                      </div>
                    ) : (
                      <div className="w-full">
                        <h4 className="font-extrabold text-xs text-slate-900 mb-0.5 font-heading">{s.title}</h4>
                        <p className="text-[9px] text-slate-700 font-normal opacity-90 line-clamp-2 font-body">{s.bodyText}</p>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={s.id}
                  onPointerDown={(e) => handlePointerDown(s.id, e)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingId(s.id);
                  }}
                  className={`absolute w-48 h-32 rounded-xl border-2 font-bold text-xs flex flex-col justify-start p-3 shadow-lg cursor-grab active:cursor-grabbing touch-none ${
                    isSelected ? 'scale-105 z-30' : 'z-10'
                  }`}
                  style={{
                    left: `${s.x}px`,
                    top: `${s.y}px`,
                    borderColor: s.color,
                    backgroundColor: `${s.color}15`,
                    color: s.color,
                    ...activeOutlineStyle,
                  }}
                >
                  {isEditing ? (
                    <div className="space-y-1 w-full h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        autoFocus
                        value={s.title}
                        onChange={(e) => updateSelectedTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setEditingId(null);
                        }}
                        className="w-full bg-transparent font-extrabold text-xs text-slate-900 border-b border-current/20 focus:outline-none pb-1 font-heading"
                      />
                      <textarea
                        rows={2}
                        value={s.bodyText}
                        onChange={(e) => updateSelectedBody(e.target.value)}
                        className="w-full bg-transparent text-[10px] text-slate-700 font-normal leading-tight focus:outline-none resize-none flex-1 font-body pt-1"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col">
                      <h4 className="font-extrabold text-xs text-slate-900 mb-1 border-b border-current/20 pb-1 font-heading">{s.title}</h4>
                      <p className="text-[10px] text-slate-700 font-normal opacity-90 leading-tight font-body flex-1">{s.bodyText}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
