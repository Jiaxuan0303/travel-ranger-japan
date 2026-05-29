'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingParticleProps {
  key_trigger?: string | number;
  text?: string;
  color?: string;
  duration?: number;
}

export function FloatingParticle({
  key_trigger,
  text = '+XP',
  color = 'text-amber-400',
  duration = 1.5,
}: FloatingParticleProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (key_trigger !== undefined) {
      setShow(true);
      const t = setTimeout(() => setShow(false), duration * 1000 + 100);
      return () => clearTimeout(t);
    }
  }, [key_trigger, duration]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed pointer-events-none z-50 font-bold text-lg ${color}`}
          initial={{ opacity: 1, y: 0, scale: 0.5 }}
          animate={{ opacity: 0, y: -60, scale: 1.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration, ease: 'easeOut' }}
          style={{
            left: `${40 + Math.random() * 20}%`,
            bottom: '30%',
          }}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
