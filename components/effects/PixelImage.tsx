'use client';

import { useEffect, useRef, useCallback } from 'react';

interface PixelImageProps {
  src: string;
  pixelSize?: number;
  className?: string;
  overlayColor?: string;
  overlayGradient?: string;
}

export function PixelImage({
  src,
  pixelSize = 4,
  className = '',
  overlayColor,
  overlayGradient,
}: PixelImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const renderPixel = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const smallW = Math.max(1, Math.floor(w / pixelSize));
      const smallH = Math.max(1, Math.floor(h / pixelSize));

      const offscreen = document.createElement('canvas');
      offscreen.width = smallW;
      offscreen.height = smallH;
      const offCtx = offscreen.getContext('2d')!;
      offCtx.drawImage(img, 0, 0, smallW, smallH);

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offscreen, 0, 0, w, h);
    };
    img.src = src;
  }, [src, pixelSize]);

  useEffect(() => {
    // Wait one frame for layout
    const raf = requestAnimationFrame(() => renderPixel());
    return () => cancelAnimationFrame(raf);
  }, [renderPixel]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => renderPixel());
    ro.observe(container);
    return () => ro.disconnect();
  }, [renderPixel]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
      {overlayColor && (
        <div className="absolute inset-0" style={{ background: overlayColor }} />
      )}
      {overlayGradient && (
        <div className="absolute inset-0" style={{ background: overlayGradient }} />
      )}
    </div>
  );
}
