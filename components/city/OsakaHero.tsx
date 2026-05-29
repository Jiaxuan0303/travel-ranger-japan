'use client';

import { motion } from 'framer-motion';
import { usePlayer, useCity } from '@/hooks/usePlayer';

export function OsakaHero() {
  const { player } = usePlayer();
  const { progress } = useCity('osaka');
  const isUnlocked = progress?.unlocked ?? false;

  return (
    <section className="relative overflow-hidden rounded-2xl mb-10">
      <div className="relative h-80 md:h-96 bg-slate-950">
        <img
          src="/images/cities/osaka.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/70" />

        {/* Marquee lights */}
        <div className="absolute top-6 left-0 right-0 flex justify-center">
          <div className="flex gap-3">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#ef4444' : '#ec4899', boxShadow: i % 3 === 0 ? '0 0 10px rgba(249,115,22,0.6)' : i % 3 === 1 ? '0 0 10px rgba(239,68,68,0.6)' : '0 0 10px rgba(236,72,153,0.6)' }}
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>

        {/* Floating neon particles */}
        {[...Array(6)].map((_, i) => {
          const colors = ['#f97316', '#ef4444', '#ec4899', '#fbbf24'];
          return (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ left: `${8 + i * 15}%`, bottom: '30%', background: colors[i % 4], boxShadow: `0 0 6px ${colors[i % 4]}` }}
              animate={{ y: [-5, -50, -5], opacity: [0, 0.9, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
            />
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent">
        <div className="flex items-end justify-between">
          <div>
            <motion.div className="flex items-center gap-2 mb-2" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <span className="text-2xl">🏯</span>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">大阪</h1>
              <span className="text-orange-400/70 text-sm">大阪</span>
            </motion.div>
            <motion.div className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-orange-400/60 uppercase tracking-widest">城市等级</span>
                <span className="text-sm font-bold text-orange-400">{isUnlocked ? 'Lv.1' : '🔒'}</span>
              </div>
              <div className="w-px h-4 bg-orange-700/30" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-orange-400/60 uppercase tracking-widest">探索进度</span>
                <div className="w-24 h-1.5 bg-orange-950/60 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-full" initial={{ width: 0 }} animate={{ width: isUnlocked ? `${progress?.completionPercent ?? 0}%` : '0%' }} transition={{ duration: 1, delay: 0.7 }} />
                </div>
                <span className="text-xs text-orange-400/60">{progress?.completionPercent ?? 0}%</span>
              </div>
            </motion.div>
          </div>
          <motion.div className="flex flex-col items-center gap-1 shrink-0" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.5, stiffness: 250 }}>
            <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center backdrop-blur-sm ${isUnlocked ? 'bg-gradient-to-br from-orange-500/20 to-pink-500/20 border-orange-500/30' : 'bg-slate-800/40 border-slate-700/30'}`}>
              <span className={isUnlocked ? 'text-2xl' : 'text-xl opacity-30'}>{isUnlocked ? '🏯' : '🔒'}</span>
            </div>
            <span className={`text-[10px] uppercase tracking-wider ${isUnlocked ? 'text-orange-400' : 'text-slate-600'}`}>{isUnlocked ? '大阪徽章' : '未解锁'}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
