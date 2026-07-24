'use client';

import React, { useRef, useEffect } from 'react';

interface TransparentHeroVideoProps {
  src: string;
}

export const TransparentHeroVideo: React.FC<TransparentHeroVideoProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animId: number;

    const processFrame = () => {
      if (video.videoWidth && video.videoHeight) {
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = frame.data;
          const len = data.length;

          for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Average brightness of paper background pixel
            const avg = (r + g + b) / 3;

            // Key out grey paper background texture
            if (avg > 185) {
              // Completely transparent for bright paper background
              data[i + 3] = 0;
            } else if (avg > 150) {
              // Smooth anti-aliased edge falloff for pen strokes
              const alphaFactor = (185 - avg) / 35;
              data[i + 3] = Math.floor(255 * alphaFactor);
            }
          }

          ctx.putImageData(frame, 0, 0);
        }
      }

      animId = requestAnimationFrame(processFrame);
    };

    animId = requestAnimationFrame(processFrame);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center">
      {/* Hidden Source Video Element */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="hidden"
      />

      {/* Real-time Transparent Keyed Canvas Output */}
      <canvas
        ref={canvasRef}
        className="w-full h-auto object-cover pointer-events-none drop-shadow-md"
      />
    </div>
  );
};
