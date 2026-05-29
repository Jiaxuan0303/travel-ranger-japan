/**
 * 全局动画变体库 — 所有页面和组件共享
 * 基于 Framer Motion Variants 规范
 */
import { Variants, Transition } from 'framer-motion';

// ============ Timing Presets ============

export const timing = {
  fast: { duration: 0.2, ease: 'easeOut' } as Transition,
  normal: { duration: 0.35, ease: 'easeOut' } as Transition,
  slow: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } as Transition,
  spring: { type: 'spring' as const, stiffness: 300, damping: 25 },
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 15 },
  smooth: { type: 'spring' as const, stiffness: 180, damping: 20 },
};

// ============ Page Transition ============

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: timing.normal },
  exit: { opacity: 0, y: -12, transition: timing.fast },
};

// ============ Fade / Slide ============

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: timing.normal },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: timing.normal },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: timing.normal },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: timing.normal },
};

// ============ Scale ============

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: timing.spring },
};

export const scaleBounce: Variants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: timing.bouncy,
  },
};

// ============ Stagger Container ============

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// ============ Card Hover ============

export const cardHover = {
  rest: { y: 0, scale: 1, transition: timing.fast },
  hover: { y: -6, scale: 1.02, transition: timing.spring },
  tap: { scale: 0.97, transition: timing.fast },
};

// ============ Glow / Pulse ============

export const pulseGlow: Variants = {
  idle: { opacity: 0.3, scale: 1 },
  pulse: {
    opacity: [0.3, 0.7, 0.3],
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const neonFlicker: Variants = {
  solid: { opacity: 1 },
  flicker: {
    opacity: [1, 0.8, 1, 0.9, 0.6, 1],
    transition: { duration: 2, repeat: Infinity },
  },
};

// ============ Unlock / Reveal ============

export const unlockReveal: Variants = {
  hidden: { scale: 0, rotate: -180, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { ...timing.bouncy, duration: 0.8 },
  },
  exit: { scale: 1.5, opacity: 0, transition: { duration: 0.3 } },
};

// ============ Particle ============

export const floatUp: Variants = {
  start: { y: 0, opacity: 1, scale: 0.5 },
  end: { y: -60, opacity: 0, scale: 1.2, transition: { duration: 1.5 } },
};

// ============ Gradient ============

export const gradientShift: Variants = {
  a: { backgroundPosition: '0% 50%' },
  b: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: { duration: 8, repeat: Infinity, ease: 'linear' },
  },
};

// ============ Helper: Stagger Delay ============

export function staggerDelay(index: number, base: number = 0.08): number {
  return base * index;
}

// ============ Helper: Random Duration ============

export function randomDuration(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
