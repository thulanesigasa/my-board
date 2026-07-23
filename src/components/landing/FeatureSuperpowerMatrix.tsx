'use client';

import React, { useState } from 'react';

export const FeatureSuperpowerMatrix: React.FC = () => {
  const [activeColor, setActiveColor] = useState('#2563EB');
  const [strokeWidth, setStrokeWidth] = useState(6);
  const [crdtCount, setCrdtCount] = useState(1);

  return (
    <section id="features" className="py-20 bg-white relative z-10 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
          Core Whiteboard Superpowers
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mb-16 leading-relaxed font-body">
          Interactive vector elements and live canvas components powered by high-frequency Socket.IO & Supabase PostgreSQL.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {/* Card 1: Interactive Bezier Pen Stroke Preview */}
          <div className="glass-card p-6 shadow-lg hover:border-blue-500/50 transition flex flex-col justify-between h-72">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                  01 / LIVE INK ENGINE
                </span>
                <span className="text-[10px] font-mono text-slate-500">Width: {strokeWidth}px</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Freehand Ink Smoothing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-body mb-4">
                Adjust thickness slider to preview Bezier pressure stroke generation live:
              </p>
            </div>

            {/* Interactive Stroke Element Canvas */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-3">
              <input
                type="range"
                min={2}
                max={16}
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <svg className="w-full h-12 bg-white rounded-lg border border-slate-200 shadow-inner">
                <path
                  d="M 10 25 Q 60 5, 120 25 T 230 25"
                  fill="none"
                  stroke={activeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Card 2: Interactive CRDT Conflict Resolver Node */}
          <div className="glass-card p-6 shadow-lg hover:border-blue-500/50 transition flex flex-col justify-between h-72">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase block mb-2">
                02 / CONFLICT-FREE SYNC
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Conflict-Free LWW Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-body mb-4">
                Click button to trigger concurrent delta updates without merge conflicts:
              </p>
            </div>

            {/* Interactive Element Node */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600">Delta Updates:</span>
                <span className="font-bold text-blue-600">v{crdtCount}.0 (0ms conflict)</span>
              </div>
              <button
                onClick={() => setCrdtCount((c) => c + 1)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-md"
              >
                + Push Delta Update
              </button>
            </div>
          </div>

          {/* Card 3: Interactive Vector Shape & Color Element */}
          <div className="glass-card p-6 shadow-lg hover:border-blue-500/50 transition flex flex-col justify-between h-72">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase block mb-2">
                03 / VECTOR GRAPHICS
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Vector Shapes & Color Picker
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-body mb-4">
                Pick a color to instantly update vector shape elements:
              </p>
            </div>

            {/* Interactive Shape Element */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between">
              <div className="flex gap-1.5">
                {['#2563EB', '#10B981', '#F59E0B', '#EF4444'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveColor(c)}
                    className={`w-6 h-6 rounded-full border transition-transform ${
                      activeColor === c ? 'scale-125 ring-2 ring-blue-600 border-white' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <div
                className="w-12 h-12 rounded-xl border-2 shadow-md transition-all flex items-center justify-center font-bold text-[10px] text-white"
                style={{ backgroundColor: activeColor, borderColor: activeColor }}
              >
                Shape
              </div>
            </div>
          </div>

          {/* Card 4: Multi-Cursor Live Tag Node */}
          <div className="glass-card p-6 shadow-lg hover:border-blue-500/50 transition flex flex-col justify-between h-72">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase block mb-2">
                04 / MULTIPLAYER PRESENCE
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Real-Time Multi-Cursors
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-body mb-4">
                Live streaming collaborator cursor node element:
              </p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex items-center justify-center">
              <div className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold font-mono shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>Sarah (Live 60 FPS)</span>
              </div>
            </div>
          </div>

          {/* Card 5: High-Res SVG Code Generator */}
          <div className="glass-card p-6 shadow-lg hover:border-blue-500/50 transition flex flex-col justify-between h-72">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase block mb-2">
                05 / VECTOR EXPORT
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                High-Res SVG & JSON Export
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-body mb-4">
                Export vector shapes to SVG markup or raw JSON state:
              </p>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-[10px] font-mono text-emerald-400">
              <code>&lt;rect fill="{activeColor}" /&gt;</code>
            </div>
          </div>

          {/* Card 6: Supabase PostgreSQL DB Node */}
          <div className="glass-card p-6 shadow-lg hover:border-blue-500/50 transition flex flex-col justify-between h-72">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase block mb-2">
                06 / DB PERSISTENCE
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Supabase PostgreSQL Backup
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-body mb-4">
                Automatic table snapshot hydration & RLS security:
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600">PostgreSQL Status:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">CONNECTED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
