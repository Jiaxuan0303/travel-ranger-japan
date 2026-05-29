'use client';

import { motion } from 'framer-motion';

interface SkillNodeGlowProps {
  children: React.ReactNode;
  unlocked: boolean;
  available: boolean;
  color?: string;
  className?: string;
}

export function SkillNodeGlow({
  children,
  unlocked,
  available,
  color = '#8b5cf6',
  className = '',
}: SkillNodeGlowProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Unlocked: steady emerald glow */}
      {unlocked && (
        <motion.div
          className="absolute -inset-[2px] rounded-xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, rgba(52,211,153,0.15), rgba(16,185,129,0.05))`,
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Available: pulsing unlock glow */}
      {available && !unlocked && (
        <>
          <motion.div
            className="absolute -inset-[2px] rounded-xl pointer-events-none blur-sm"
            style={{ background: color }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute -inset-[4px] rounded-xl pointer-events-none"
            style={{
              border: `1px solid ${color}40`,
            }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </>
      )}

      {children}
    </div>
  );
}
