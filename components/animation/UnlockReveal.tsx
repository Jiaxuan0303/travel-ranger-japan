'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface UnlockRevealProps {
  trigger: boolean;
  emoji: string;
  label: string;
  onDone?: () => void;
}

export function UnlockReveal({ trigger, emoji, label, onDone }: UnlockRevealProps) {
  return (
    <AnimatePresence onExitComplete={onDone}>
      {trigger && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
          >
            <div className="text-7xl mb-4">{emoji}</div>
            <div className="text-2xl font-bold text-white drop-shadow-lg">{label}</div>
            <div className="text-slate-400 mt-2">解锁！</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
