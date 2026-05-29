'use client';

import { ReactNode } from 'react';

interface GlowBorderProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  borderRadius?: string;
}

export function GlowBorder({
  children,
  className = '',
  glowColor = 'rgba(139, 92, 246, 0.4)',
  borderRadius = '1.25rem',
}: GlowBorderProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{ borderRadius }}
    >
      {/* Glow layer */}
      <div
        className="absolute -inset-[1px] opacity-60 blur-sm transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: glowColor,
          borderRadius,
          zIndex: -1,
        }}
      />
      {/* Content */}
      {children}
    </div>
  );
}
