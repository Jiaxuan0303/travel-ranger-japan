'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface BadgePopupProps {
  open: boolean;
  badgeName: string;
  badgeEmoji: string;
  description: string;
  onClose: () => void;
}

export function BadgePopup({
  open,
  badgeName,
  badgeEmoji,
  description,
  onClose,
}: BadgePopupProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pointer-events-auto text-center">
              {/* Outer glow rings */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
                }}
                animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.3, 0.5, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }}
              />

              {/* Badge card */}
              <motion.div
                className="relative bg-gradient-to-b from-slate-800 to-slate-900 border border-indigo-500/30 rounded-2xl p-8 shadow-[0_0_60px_rgba(139,92,246,0.15)]"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {/* Sparkles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-amber-400"
                    style={{
                      left: `${10 + (i % 4) * 27}%`,
                      top: `${15 + Math.floor(i / 4) * 30}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.12,
                    }}
                  />
                ))}

                <motion.div
                  className="text-7xl mb-4 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {badgeEmoji}
                </motion.div>

                <motion.h2
                  className="text-xl font-bold text-white mb-2"
                  style={{ fontFamily: "'DotGothic16', monospace" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  获得徽章
                </motion.h2>

                <motion.p
                  className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {badgeName}
                </motion.p>

                <motion.p
                  className="text-xs text-slate-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {description}
                </motion.p>

                <motion.button
                  className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={onClose}
                >
                  继续冒险 →
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
