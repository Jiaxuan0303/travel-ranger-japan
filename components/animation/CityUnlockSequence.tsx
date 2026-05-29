'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface CityUnlockSequenceProps {
  trigger: boolean;
  cityName: string;
  cityEmoji: string;
  subtitle: string;
  onComplete?: () => void;
}

export function CityUnlockSequence({
  trigger,
  cityName,
  cityEmoji,
  subtitle,
  onComplete,
}: CityUnlockSequenceProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {trigger && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.5 } }}
        >
          {/* Dark backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Radiating rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-40 h-40 rounded-full border border-violet-500/20"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: [1, 3 + i], opacity: [0.5, 0] }}
              transition={{
                duration: 1.5,
                delay: i * 0.25,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Particle burst */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`p-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#8b5cf6' : '#ec4899',
              }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 300,
                scale: 0,
                opacity: 0,
              }}
              transition={{ duration: 0.8 + Math.random() * 0.4, ease: 'easeOut' }}
            />
          ))}

          {/* Center content */}
          <motion.div
            className="relative text-center z-10"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20, delay: 0.2 }}
          >
            {/* Emoji reveal */}
            <motion.div
              className="text-8xl mb-4 drop-shadow-[0_0_40px_rgba(139,92,246,0.6)]"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 1 }}
            >
              {cityEmoji}
            </motion.div>

            {/* "New City Unlocked!" label */}
            <motion.div
              className="text-xs uppercase tracking-[0.3em] text-violet-400 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              ── New City Unlocked ──
            </motion.div>

            {/* City name */}
            <motion.h2
              className="text-3xl font-bold text-white mb-1"
              style={{ fontFamily: "'DotGothic16', monospace" }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 300 }}
            >
              {cityName}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-sm text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {subtitle}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
