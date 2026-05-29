'use client';

import { motion } from 'framer-motion';

interface PulseGlowProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  size?: number;       // blur radius
  duration?: number;   // cycle seconds
}

export function PulseGlow({
  children,
  className = '',
  color = 'rgba(139, 92, 246, 0.4)',
  size = 12,
  duration = 2,
}: PulseGlowProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Glow rings */}
      <motion.div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
          filter: `blur(${size}px)`,
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Second ring offset */}
      <motion.div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${color} 0%, transparent 60%)`,
          filter: `blur(${size * 0.6}px)`,
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1.05, 0.95, 1.05],
        }}
        transition={{
          duration: duration * 0.9,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: duration * 0.3,
        }}
      />
      {children}
    </div>
  );
}
