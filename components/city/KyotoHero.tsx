'use client';

import { motion } from 'framer-motion';
import { usePlayer, useCity } from '@/hooks/usePlayer';

export function KyotoHero() {
  const { player } = usePlayer();
  const { progress } = useCity('kyoto');
  const isUnlocked = progress?.unlocked ?? false;

  return (
    <section className="relative overflow-hidden rounded-2xl mb-10">
      <div className="relative h-80 md:h-96 bg-amber-950">
        <img
          src="/images/cities/kyoto.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/70" />

        {/* Sakura petals */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{ left: `${Math.random() * 90 + 5}%`, top: '-5%', fontSize: `${Math.random() * 8 + 6}px` }}
            animate={{ y: ['0vh', '100vh'], x: [0, Math.sin(i) * 30, 0], rotate: [0, 180, 360], opacity: [0.4, 0.6, 0] }}
            transition={{ duration: 10 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 6, ease: 'linear' }}
          >
            🌸
          </motion.div>
        ))}

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-amber-300/60"
            style={{ left: `${10 + i * 14}%`, bottom: '25%' }}
            animate={{ y: [-5, -40, -5], opacity: [0, 0.6, 0] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent">
        <div className="flex items-end justify-between">
          <div>
            <motion.div className="flex items-center gap-2 mb-2" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <span className="text-2xl">⛩️</span>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">京都</h1>
              <span className="text-amber-300/70 text-sm">京都</span>
            </motion.div>
            <motion.div className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-amber-400/60 uppercase tracking-widest">城市等级</span>
                <span className="text-sm font-bold text-amber-400">{isUnlocked ? 'Lv.1' : '🔒'}</span>
              </div>
              <div className="w-px h-4 bg-amber-700/30" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-amber-400/60 uppercase tracking-widest">探索进度</span>
                <div className="w-24 h-1.5 bg-amber-950/60 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full" initial={{ width: 0 }} animate={{ width: isUnlocked ? `${progress?.completionPercent ?? 0}%` : '0%' }} transition={{ duration: 1.2, delay: 0.7 }} />
                </div>
                <span className="text-xs text-amber-400/60">{progress?.completionPercent ?? 0}%</span>
              </div>
            </motion.div>
          </div>
          <motion.div className="flex flex-col items-center gap-1 shrink-0" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.5, stiffness: 200 }}>
            <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center backdrop-blur-sm ${isUnlocked ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30' : 'bg-slate-800/40 border-slate-700/30'}`}>
              <span className={isUnlocked ? 'text-2xl' : 'text-xl opacity-30'}>{isUnlocked ? '⛩️' : '🔒'}</span>
            </div>
            <span className={`text-[10px] uppercase tracking-wider ${isUnlocked ? 'text-amber-400' : 'text-slate-600'}`}>{isUnlocked ? '京都徽章' : '未解锁'}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
