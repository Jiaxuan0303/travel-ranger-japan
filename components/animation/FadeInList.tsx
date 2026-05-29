'use client';

import { motion } from 'framer-motion';

interface FadeInListProps {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
}

export function FadeInList({ children, className = '', staggerMs = 80 }: FadeInListProps) {
  const stagger = staggerMs / 1000;

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInItem({
  children,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const dirMap = { up: 16, down: -16, left: 16, right: -16 };
  const offset = dirMap[direction] ?? 16;
  const isY = direction === 'up' || direction === 'down';

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, x: isY ? 0 : offset, y: isY ? offset : 0 },
        visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.35 } },
      }}
    >
      {children}
    </motion.div>
  );
}
