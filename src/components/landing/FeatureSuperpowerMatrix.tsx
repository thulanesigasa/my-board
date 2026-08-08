'use client';

import React, { useState } from 'react';

export const FeatureSuperpowerMatrix: React.FC = () => {
  const [strokeWidth, setStrokeWidth] = useState(6);
  const [crdtCount, setCrdtCount] = useState(14);
  const [activeColor, setActiveColor] = useState('#F97316');

  return (
    <section id="features" className="py-20 bg-[var(--color-bg)] relative z-10 border-b border-slate-200 font-sans">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 font-heading">
          Unified Canvas Workbench Engine
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mb-16 leading-relaxed font-body">
          State-of-the-art vector engine designed for zero input lag and real-time multiplayer editing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {/* Card 1 */}
          <div className="glass-card p-6 space-y-4 hover:border-orange-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 font-heading">
                Bezier Smooth Freehand Ink
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold font-mono border border-orange-200">
                Smooth Ink
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              Catmull-Rom spline interpolation converts raw cursor input into fluid pressure-sensitive vector curves.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-500 flex justify-between">
              <span>Interpolation: Bezier</span>
              <span>Sync: <strong className="text-orange-500">120Hz High-Refresh</strong></span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 space-y-4 hover:border-orange-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 font-heading">
                Dynamic Stroke Thickness
              </span>
              <span className="text-xs font-mono font-bold text-slate-700">{strokeWidth}px</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              Adjust stroke width dynamically with live preview across freehand drawings and vector shapes.
            </p>
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-orange-500 uppercase">
                  Adjust Width:
                </span>
                <input
                  type="range"
                  min={2}
                  max={24}
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 space-y-4 hover:border-orange-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 font-heading">
                Last-Write-Wins CRDT Engine
              </span>
              <button
                onClick={() => setCrdtCount((c) => c + 1)}
                className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-[10px] font-bold font-mono transition"
              >
                + Sim Delta
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              Conflict-free replicated data type engine guarantees eventual consistency across all connected room peers.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-orange-500 uppercase">
                Deltas Synced: {crdtCount}
              </span>
              <span className="text-[10px] font-mono text-orange-500 font-bold">v{crdtCount}.0</span>
            </div>
            <div>
              <button
                onClick={() => setCrdtCount((c) => c + 1)}
                className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition shadow-md"
              >
                Dispatch Real-Time Delta ({crdtCount})
              </button>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card p-6 space-y-4 hover:border-orange-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 font-heading">
                Curated Color Palette
              </span>
              <div
                className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
                style={{ backgroundColor: activeColor }}
              />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              Switch stroke and fill colors seamlessly across rectangles, circles, notes, and freehand ink.
            </p>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-orange-500 uppercase">
                Palette:
              </span>
              <div className="flex gap-1.5">
                {['#F97316', '#2563EB', '#10B981', '#F59E0B', '#EF4444'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveColor(c)}
                    className={`w-4 h-4 rounded-full border transition-transform ${
                      activeColor === c ? 'scale-125 ring-2 ring-orange-500 border-white' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="glass-card p-6 space-y-4 hover:border-orange-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 font-heading">
                Vector SVG & JSON Export
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold font-mono">
                SVG/JSON
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              Export entire whiteboard sessions into clean scale-independent vector SVG graphics or JSON state snapshots.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-500 flex justify-between">
              <span>Precision: 100% Vector</span>
              <span className="text-orange-500 font-bold">Instant Export</span>
            </div>
          </div>

          {/* Card 6 */}
          <div className="glass-card p-6 space-y-4 hover:border-orange-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 font-heading">
                Supabase PostgreSQL Saves
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold font-mono">
                PostgreSQL
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              Persistent room board storage backed by Supabase PostgreSQL RLS policies for security.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-500 flex justify-between">
              <span>Database: Supabase</span>
              <span className="text-orange-500 font-bold">RLS Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
