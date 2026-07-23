'use client';

import React from 'react';

export const TrustStatsBar: React.FC = () => {
  const specs = [
    { title: 'Socket.IO WebSockets', detail: 'Real-time CRDT Sync Engine' },
    { title: 'Supabase PostgreSQL', detail: 'Row Level Security Persistence' },
    { title: 'HTML5 + Bezier Ink', detail: 'Dual-Layer Drawing Renderer' },
    { title: 'Vector SVG & JSON', detail: 'Instant Export Formats' },
  ];

  return (
    <section className="bg-slate-900 text-white py-10 relative z-10 border-y border-slate-800 font-sans">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {specs.map((spec, i) => (
            <div key={i} className="space-y-1">
              <p className="text-base sm:text-lg font-extrabold text-blue-400 font-heading tracking-tight">
                {spec.title}
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold font-mono">
                {spec.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
