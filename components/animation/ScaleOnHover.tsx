'use client';

import { motion } from 'framer-motion';

interface ScaleOnHoverProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

export function ScaleOnHover({
  children,
  scale = 1.03,
  className = '',
}: ScaleOnHoverProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
}
