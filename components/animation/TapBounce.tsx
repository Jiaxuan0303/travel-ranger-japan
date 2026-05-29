'use client';

import { motion } from 'framer-motion';

interface TapBounceProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  disabled?: boolean;
  onClick?: () => void;
}

export function TapBounce({
  children,
  className = '',
  scale = 0.95,
  disabled = false,
  onClick,
}: TapBounceProps) {
  return (
    <motion.div
      className={className}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={{ cursor: disabled ? 'default' : 'pointer' }}
    >
      {children}
    </motion.div>
  );
}
