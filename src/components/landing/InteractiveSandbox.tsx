'use client';

import React, { useState } from 'react';

export const InteractiveSandbox: React.FC = () => {
  const [activeShape, setActiveShape] = useState<'rect' | 'circle' | 'note'>('rect');
  const [shapes, setShapes] = useState<Array<{ id: number; type: string; x: number; y: number; text: string }>>([
    { id: 1, type: 'note', x: 40, y: 50, text: 'UX Brainstorming Note' },
    { id: 2, type: 'rect', x: 260, y: 70, text: 'System Architecture' },
    { id: 3, type: 'circle', x: 500, y: 60, text: 'PostgreSQL DB' },
  ]);

  const addShape = () => {
    const newShape = {
      id: Date.now(),
      type: activeShape,
      x: Math.floor(Math.random() * 400) + 40,
      y: Math.floor(Math.random() * 120) + 40,
      text: activeShape === 'note' ? 'New Sticky Note' : activeShape === 'rect' ? 'New Rectangle' : 'New Circle',
    };
    setShapes([...shapes, newShape]);
  };

  const clearSandbox = () => {
    setShapes([]);
  };

  return (
    <section id="sandbox" className="py-20 bg-[var(--color-bg)] relative z-10 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
          Try The Live Interactive Canvas Sandbox
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mb-10 leading-relaxed font-body">
          Test placing vector shapes and sticky notes on the canvas below. No installation or registration required.
        </p>

        {/* Sandbox Glass Container */}
        <div className="glass-card p-6 shadow-2xl relative overflow-hidden max-w-4xl mx-auto text-left">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">Tool:</span>
              <button
                onClick={() => setActiveShape('rect')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeShape === 'rect' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Rectangle
              </button>
              <button
                onClick={() => setActiveShape('circle')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeShape === 'circle' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Circle
              </button>
              <button
                onClick={() => setActiveShape('note')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeShape === 'note' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Sticky Note
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={addShape}
                className="btn-primary text-xs !py-1.5 !px-4"
              >
                + Place Shape
              </button>
              <button
                onClick={clearSandbox}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition"
              >
                Reset Canvas
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="h-80 rounded-2xl bg-white border border-slate-200 relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-60" />

            {shapes.map((s) => {
              if (s.type === 'note') {
                return (
                  <div
                    key={s.id}
                    className="absolute w-36 h-28 p-3 rounded-xl bg-amber-100 border border-amber-300 text-slate-900 font-bold text-xs shadow-lg transition-all hover:scale-105"
                    style={{ left: `${s.x}px`, top: `${s.y}px` }}
                  >
                    {s.text}
                  </div>
                );
              }
              if (s.type === 'circle') {
                return (
                  <div
                    key={s.id}
                    className="absolute w-28 h-28 rounded-full bg-blue-50 border-2 border-blue-600 text-blue-900 font-bold text-xs flex items-center justify-center text-center p-2 shadow-lg transition-all hover:scale-105"
                    style={{ left: `${s.x}px`, top: `${s.y}px` }}
                  >
                    {s.text}
                  </div>
                );
              }
              return (
                <div
                  key={s.id}
                  className="absolute w-44 h-24 rounded-xl bg-slate-100 border-2 border-slate-700 text-slate-900 font-bold text-xs flex items-center justify-center text-center p-2 shadow-lg transition-all hover:scale-105"
                  style={{ left: `${s.x}px`, top: `${s.y}px` }}
                >
                  {s.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
