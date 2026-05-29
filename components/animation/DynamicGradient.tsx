'use client';

import { motion } from 'framer-motion';

interface DynamicGradientProps {
  children?: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

const defaultColors = [
  'rgba(139, 92, 246, 0.15)',
  'rgba(59, 130, 246, 0.12)',
  'rgba(236, 72, 153, 0.1)',
  'rgba(139, 92, 246, 0.08)',
  'rgba(59, 130, 246, 0.15)',
];

export function DynamicGradient({
  children,
  className = '',
  colors = defaultColors,
  speed = 20,
}: DynamicGradientProps) {
  const gradient = `linear-gradient(135deg, ${colors.join(', ')})`;

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{ background: gradient, backgroundSize: '400% 400%' }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
    >
      {children}
    </motion.div>
  );
}
