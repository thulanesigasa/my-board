'use client';

import React from 'react';
import { BaseShape } from '@/types/board';

interface MinimapProps {
  shapes: BaseShape[];
}

export const Minimap: React.FC<MinimapProps> = ({ shapes }) => {
  return (
    <div className="fixed bottom-6 right-6 z-30 w-48 h-30 glass-card overflow-hidden shadow-xl p-2.5 hidden md:block pointer-events-auto border border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between font-mono">
        <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 font-mono font-bold text-[9px] border border-orange-200">
          MINIMAP
        </span>
        <span className="text-slate-500 font-mono">{shapes.length} items</span>
      </div>

      <div className="w-full h-20 bg-white rounded-xl relative overflow-hidden border border-slate-200 shadow-inner">
        {/* Background Light Dot Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] opacity-70 pointer-events-none" />

        <svg className="w-full h-full relative z-10">
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
                fill={s.strokeColor || '#F97316'}
                rx={2}
                opacity={0.85}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};
