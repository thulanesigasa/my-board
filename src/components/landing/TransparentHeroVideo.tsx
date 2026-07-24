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
          const w = canvas.width;
          const h = canvas.height;
          const cx = w / 2;
          const cy = h / 2;

          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const i = (y * w + x) * 4;
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];

              // Average brightness of paper background pixel
              const avg = (r + g + b) / 3;

              // Base Alpha calculation from pixel brightness
              let alpha = 255;
              if (avg > 185) {
                alpha = 0;
              } else if (avg > 150) {
                const alphaFactor = (185 - avg) / 35;
                alpha = Math.floor(255 * alphaFactor);
              }

              // Calculate 4-way distance factor from center for edge vignetting (0 to 1)
              const nx = Math.abs(x - cx) / cx;
              const ny = Math.abs(y - cy) / cy;
              const edgeDist = Math.max(Math.pow(nx, 3), Math.pow(ny, 3));
              const edgeAlphaFactor = Math.max(0, 1 - edgeDist);

              data[i + 3] = Math.floor(alpha * edgeAlphaFactor);
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

      {/* Real-time Feathered Transparent Canvas Output */}
      <canvas
        ref={canvasRef}
        style={{
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)',
        }}
        className="w-full h-auto object-cover pointer-events-none drop-shadow-md"
      />
    </div>
  );
};
