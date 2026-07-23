'use client';

import React from 'react';

export const ComparisonMatrix: React.FC = () => {
  const comparison = [
    { feature: 'Unlimited Collaborative Rooms', myBoard: true, legacy: false },
    { feature: 'Real-time WebSocket Sync', myBoard: true, legacy: true },
    { feature: 'Zero Subscription Cost ($0/mo)', myBoard: true, legacy: false },
    { feature: 'Bezier Freehand Ink Smoothing', myBoard: true, legacy: true },
    { feature: 'Supabase PostgreSQL Snapshots', myBoard: true, legacy: false },
    { feature: 'Open Source & Self-Hostable', myBoard: true, legacy: false },
  ];

  return (
    <section className="py-20 bg-[var(--color-bg)] relative z-10 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
          Why Choose my-board?
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mb-12 leading-relaxed font-body">
          Compare my-board's conflict-free real-time engine against traditional expensive whiteboard apps.
        </p>

        <div className="glass-card overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-mono uppercase tracking-wider">
                <th className="p-4 sm:p-6 text-slate-300">Features & Capabilities</th>
                <th className="p-4 sm:p-6 text-blue-400 font-extrabold">my-board</th>
                <th className="p-4 sm:p-6 text-slate-400">Legacy Whiteboards</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {comparison.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="p-4 sm:p-6 font-semibold text-slate-900">{row.feature}</td>
                  <td className="p-4 sm:p-6 font-bold text-blue-600">
                    {row.myBoard ? '✓ Included' : '—'}
                  </td>
                  <td className="p-4 sm:p-6 text-slate-500 font-mono">
                    {row.legacy ? '✓ Paid Plan' : '✗ Restricted'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
