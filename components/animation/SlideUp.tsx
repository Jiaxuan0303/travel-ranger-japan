'use client';

import { motion } from 'framer-motion';

interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function SlideUp({ children, delay = 0, className = '' }: SlideUpProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
