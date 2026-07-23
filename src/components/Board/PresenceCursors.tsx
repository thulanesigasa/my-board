'use client';

import React from 'react';
import { UserPresence, CanvasViewport } from '@/types/board';
import { MousePointer2 } from 'lucide-react';

interface PresenceCursorsProps {
  presences: UserPresence[];
  currentUserId: string;
  viewport: CanvasViewport;
}

export const PresenceCursors: React.FC<PresenceCursorsProps> = ({
  presences,
  currentUserId,
  viewport,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {presences
        .filter((p) => p.id !== currentUserId && p.cursor)
        .map((presence) => {
          if (!presence.cursor) return null;

          const screenX = presence.cursor.x * viewport.zoom + viewport.x;
          const screenY = presence.cursor.y * viewport.zoom + viewport.y;

          return (
            <div
              key={presence.id}
              className="absolute left-0 top-0 transition-transform duration-75 ease-out flex items-start gap-1"
              style={{
                transform: `translate3d(${screenX}px, ${screenY}px, 0)`,
              }}
            >
              <MousePointer2
                className="w-5 h-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                style={{ color: presence.color, fill: presence.color }}
              />
              <div
                className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold text-white shadow-xl flex items-center gap-1.5 backdrop-blur-md ring-1 ring-white/20 font-mono tracking-tight"
                style={{ backgroundColor: presence.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>{presence.name}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
};
