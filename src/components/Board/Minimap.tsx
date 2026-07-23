'use client';

import React from 'react';
import { BaseShape } from '@/types/board';

interface MinimapProps {
  shapes: BaseShape[];
}

export const Minimap: React.FC<MinimapProps> = ({ shapes }) => {
  return (
    <div className="fixed bottom-6 right-6 z-30 w-44 h-28 bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl p-2 hidden md:block">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
        <span>Minimap</span>
        <span className="text-slate-400 font-mono">{shapes.length} items</span>
      </div>
      <div className="w-full h-20 bg-slate-950/80 rounded-xl relative overflow-hidden border border-slate-800/50">
        <svg className="w-full h-full text-indigo-400 opacity-60">
          {shapes.map((s) => {
            const scaledX = (s.x / 3000) * 160 + 10;
            const scaledY = (s.y / 2000) * 80 + 10;
            const scaledW = Math.max(4, ((s.width || 20) / 3000) * 160);
            const scaledH = Math.max(4, ((s.height || 20) / 2000) * 80);

            return (
              <rect
                key={`mini_${s.id}`}
                x={Math.max(0, Math.min(150, scaledX))}
                y={Math.max(0, Math.min(70, scaledY))}
                width={scaledW}
                height={scaledH}
                fill={s.strokeColor || '#6366F1'}
                rx={1}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};
