'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CityId } from '@/lib/types';
import { useCity } from '@/hooks/usePlayer';

type CityTheme = {
  name: string;
  nameJa: string;
  subtitle: string;
  emoji: string;
  bgStyle: string;
  accentColor: string;
  glowColor: string;
  overlayStyle: string;
};

const cityThemes: Record<CityId, CityTheme> = {
  tokyo: {
    name: 'Tokyo',
    nameJa: '東京',
    subtitle: '霓虹之心',
    emoji: '🗼',
    bgStyle: `
      bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900
      before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_30%_50%,rgba(236,72,153,0.15),transparent_70%)]
      after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_70%_20%,rgba(59,130,246,0.15),transparent_60%)]
    `,
    accentColor: 'from-pink-500 to-cyan-400',
    glowColor: 'rgba(236, 72, 153, 0.3)',
    overlayStyle:
      'bg-[linear-gradient(rgba(15,23,42,0.3),rgba(15,23,42,0.6))]',
  },
  kyoto: {
    name: 'Kyoto',
    nameJa: '京都',
    subtitle: '千年古都',
    emoji: '⛩️',
    bgStyle: `
      bg-gradient-to-br from-rose-950 via-slate-900 to-rose-950
      before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_50%_30%,rgba(244,114,182,0.15),transparent_70%)]
      after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_80%_80%,rgba(251,191,36,0.08),transparent_60%)]
    `,
    accentColor: 'from-pink-300 to-rose-400',
    glowColor: 'rgba(244, 114, 182, 0.2)',
    overlayStyle:
      'bg-[linear-gradient(rgba(15,23,42,0.3),rgba(15,23,42,0.5))]',
  },
  osaka: {
    name: 'Osaka',
    nameJa: '大阪',
    subtitle: '天下厨房',
    emoji: '🏯',
    bgStyle: `
      bg-gradient-to-br from-orange-950 via-slate-900 to-red-950
      before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_20%_40%,rgba(251,146,60,0.2),transparent_60%)]
      after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_60%_70%,rgba(239,68,68,0.12),transparent_60%)]
    `,
    accentColor: 'from-orange-400 to-red-500',
    glowColor: 'rgba(251, 146, 60, 0.3)',
    overlayStyle:
      'bg-[linear-gradient(rgba(15,23,42,0.3),rgba(15,23,42,0.5))]',
  },
  kamakura: {
    name: 'Kamakura',
    nameJa: '鎌倉',
    subtitle: '古都禅意',
    emoji: '🗿',
    bgStyle: `
      bg-gradient-to-br from-teal-950 via-slate-900 to-cyan-950
      before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_40%_50%,rgba(45,212,191,0.15),transparent_70%)]
      after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_80%_20%,rgba(34,211,238,0.1),transparent_60%)]
    `,
    accentColor: 'from-teal-400 to-cyan-400',
    glowColor: 'rgba(45, 212, 191, 0.2)',
    overlayStyle:
      'bg-[linear-gradient(rgba(15,23,42,0.3),rgba(15,23,42,0.5))]',
  },
};

interface CityCardProps {
  cityId: CityId;
  index: number;
}

export function CityCard({ cityId, index }: CityCardProps) {
  const { city, progress } = useCity(cityId);
  const theme = cityThemes[cityId];
  const isUnlocked = progress?.unlocked ?? false;

  if (!city || !progress) return null;

  const completionPct = progress.completionPercent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.3 + index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link href={`/cities/${cityId}`}>
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            group relative overflow-hidden rounded-2xl
            border transition-all duration-500 cursor-pointer
            ${isUnlocked
              ? 'border-white/10 hover:border-white/20'
              : 'border-slate-800/50 hover:border-slate-700/50'
            }
            ${theme.bgStyle}
            h-64
          `}
        >
          {/* Glow border on hover - unlocked only */}
          {isUnlocked && (
            <motion.div
              className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
              style={{
                background: `linear-gradient(135deg, ${theme.glowColor}, transparent 50%, ${theme.glowColor})`,
                filter: 'blur(4px)',
              }}
            />
          )}

          {/* Pseudo-element radial gradients are in bgStyle, rendered via before:/after: */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Grid lines - cyberpunk style */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          {/* Overlay gradient */}
          <div className={`absolute inset-0 z-[1] ${theme.overlayStyle}`} />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-5">
            {/* Top: Lock or completion */}
            <div className="flex items-start justify-between">
              {isUnlocked ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                  <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
                    已解锁
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 backdrop-blur-md">
                  <span className="text-sm">🔒</span>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                    未解锁
                  </span>
                </div>
              )}
              <span className="text-3xl drop-shadow-lg">{theme.emoji}</span>
            </div>

            {/* Bottom: City name + info */}
            <div>
              <h3
                className="text-2xl font-bold text-white mb-0.5 tracking-wide"
                style={{ fontFamily: "'DotGothic16', monospace" }}
              >
                {theme.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-slate-400">{theme.nameJa}</span>
                <span className="text-slate-700">·</span>
                <span className="text-xs text-slate-500">{theme.subtitle}</span>
              </div>

              {/* Progress bar or unlock hint */}
              {isUnlocked ? (
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>探索进度</span>
                    <span>{completionPct}%</span>
                  </div>
                  <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${theme.accentColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPct}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.15 }}
                    />
                  </div>
                </div>
              ) : (
                <motion.div
                  className="text-xs text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                >
                  {city.unlockCondition && (
                    <span>需要 Lv.{city.unlockCondition.minLevel} 解锁</span>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Floating particles - unlocked only */}
          {isUnlocked && (
            <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${theme.accentColor}`}
                  style={{
                    left: `${20 + i * 30}%`,
                    bottom: `${30 + i * 20}%`,
                  }}
                  animate={{
                    y: [-20, -60, -20],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + i * 0.7,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}
