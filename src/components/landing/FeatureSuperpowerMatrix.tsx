'use client';

import React, { useState } from 'react';

export const FeatureSuperpowerMatrix: React.FC = () => {
  const [activeColor, setActiveColor] = useState('#2563EB');
  const [strokeWidth, setStrokeWidth] = useState(6);
  const [crdtCount, setCrdtCount] = useState(1);

  return (
    <section id="features" className="py-20 bg-white relative z-10 border-b border-slate-200 font-sans">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 font-heading">
          Unified Interactive Canvas Workbench
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mb-12 leading-relaxed font-body">
          Explore all whiteboard capabilities integrated into a single unified 120Hz high-refresh rate canvas workspace.
        </p>

        {/* Single Unified Canvas Board */}
        <div className="glass-card p-6 shadow-2xl relative overflow-hidden max-w-5xl mx-auto text-left border-2 border-slate-200">
          {/* Top Workbench Status Bar */}
          <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-slate-900 font-heading">
                my-board // CANVAS WORKBENCH
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold font-mono border border-blue-200">
                120Hz ENGINE
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
              <span>Sync: <strong className="text-blue-600">120Hz High-Refresh</strong></span>
              <span>DB: <strong className="text-emerald-600">Supabase RLS</strong></span>
            </div>
          </div>

          {/* Large Unified Canvas Workspace Grid */}
          <div className="min-h-[500px] rounded-2xl bg-slate-50 border border-slate-200 relative overflow-hidden p-6 shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />

            {/* SVG Connecting Lines between Canvas Shape Nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <line x1="280" y1="100" x2="420" y2="100" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
              <line x1="680" y1="100" x2="780" y2="100" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
              <line x1="200" y1="200" x2="200" y2="300" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
              <line x1="550" y1="200" x2="550" y2="300" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
            </svg>

            {/* Interactive Connected Nodes in Canvas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {/* Node 01: Bezier Ink Stroke Canvas Node */}
              <div className="bg-white p-5 rounded-2xl border-2 border-slate-300 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                    NODE 01 // 120Hz INK ENGINE
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{strokeWidth}px</span>
                </div>
                <p className="text-xs font-bold text-slate-900">120Hz Bezier Pressure Generator</p>
                <input
                  type="range"
                  min={2}
                  max={16}
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <svg className="w-full h-12 bg-slate-50 rounded-xl border border-slate-200">
                  <path
                    d="M 10 24 Q 60 5, 120 24 T 220 24"
                    fill="none"
                    stroke={activeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Node 02: CRDT LWW Sync Engine Node */}
              <div className="bg-white p-5 rounded-2xl border-2 border-slate-300 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                    NODE 02 // CRDT SYNC
                  </span>
                  <span className="text-[10px] font-mono text-blue-600 font-bold">v{crdtCount}.0</span>
                </div>
                <p className="text-xs font-bold text-slate-900">Conflict-Free LWW Resolver</p>
                <p className="text-[10px] text-slate-600">Deterministic timestamp delta merging:</p>
                <button
                  onClick={() => setCrdtCount((c) => c + 1)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-md"
                >
                  + Push WebSocket Delta
                </button>
              </div>

              {/* Node 03: Vector Shapes & Color Element Node */}
              <div className="bg-white p-5 rounded-2xl border-2 border-slate-300 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                    NODE 03 // VECTOR PALETTE
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">Vector Shape Color Picker</p>
                <div className="flex items-center justify-between pt-1">
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
                    className="w-10 h-10 rounded-xl border-2 shadow-md flex items-center justify-center font-bold text-[9px] text-white"
                    style={{ backgroundColor: activeColor, borderColor: activeColor }}
                  >
                    Shape
                  </div>
                </div>
              </div>

              {/* Node 04: Real-time Multi-Cursor Element Node */}
              <div className="bg-white p-5 rounded-2xl border-2 border-slate-300 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                    NODE 04 // MULTI-CURSORS
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">Multiplayer Cursor Stream</p>
                <div className="bg-slate-900 p-3 rounded-xl flex items-center justify-center">
                  <div className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold font-mono flex items-center gap-2 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>Sarah (Live 120Hz Stream)</span>
                  </div>
                </div>
              </div>

              {/* Node 05: Vector SVG & JSON Code Node */}
              <div className="bg-white p-5 rounded-2xl border-2 border-slate-300 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                    NODE 05 // EXPORT FORMATS
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">SVG & JSON Markup Inspector</p>
                <div className="bg-slate-950 p-2.5 rounded-xl text-[10px] font-mono text-emerald-400">
                  <code>&lt;path stroke="{activeColor}" /&gt;</code>
                </div>
              </div>

              {/* Node 06: Supabase PostgreSQL DB Persistence Node */}
              <div className="bg-white p-5 rounded-2xl border-2 border-slate-300 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                    NODE 06 // DB PERSISTENCE
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">Supabase RLS Table Sync</p>
                <div className="bg-slate-100 p-2.5 rounded-xl flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">PostgreSQL:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                    CONNECTED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
