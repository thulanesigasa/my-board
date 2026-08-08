'use client';

import React from 'react';

export const ComparisonMatrix: React.FC = () => {
  const rows = [
    { feature: 'WebSocket Real-Time Sync Latency', myboard: '< 16ms Instant', traditional: '200ms - 800ms Laggy' },
    { feature: 'Canvas Ink High-Refresh Engine', myboard: '120Hz Smooth Bezier', traditional: '60Hz Choppy' },
    { feature: 'Conflict-Free Sync Engine', myboard: 'Last-Write-Wins CRDT', traditional: 'Locking / Overwrites' },
    { feature: 'Vector SVG & JSON Export', myboard: 'Instant 100% Vector', traditional: 'Raster PNG Only' },
    { feature: 'Pricing & Room Sessions', myboard: 'Unlimited Free Rooms', traditional: 'Restricted Freemium Limits' },
  ];

  return (
    <section className="py-20 bg-[var(--color-bg)] relative z-10 border-b border-slate-200 font-sans">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 font-heading">
          Why Teams Choose my-board
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mb-12 leading-relaxed font-body">
          Compare our high-refresh vector engine performance against traditional whiteboards.
        </p>

        <div className="glass-card overflow-hidden shadow-xl border border-slate-200/80 rounded-2xl">
          <table className="w-full text-left text-xs sm:text-sm font-body">
            <thead>
              <tr className="bg-slate-900 text-white font-heading">
                <th className="p-4 sm:p-6 font-extrabold">Feature / Capability</th>
                <th className="p-4 sm:p-6 text-orange-400 font-extrabold">my-board</th>
                <th className="p-4 sm:p-6 text-slate-400 font-medium">Traditional Apps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 sm:p-6 font-semibold text-slate-900">{row.feature}</td>
                  <td className="p-4 sm:p-6 font-bold text-orange-500">{row.myboard}</td>
                  <td className="p-4 sm:p-6 text-slate-500">{row.traditional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
