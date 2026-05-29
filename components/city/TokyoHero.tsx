'use client';

import { motion } from 'framer-motion';
import { usePlayer } from '@/hooks/usePlayer';

export function TokyoHero() {
  const { player } = usePlayer();

  return (
    <section className="relative overflow-hidden rounded-2xl mb-10">
      <div className="relative h-80 md:h-96 bg-slate-950">
        {/* 真实照片背景 */}
        <img
          src="/images/cities/tokyo.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />
        {/* 底部渐变（仅保证文字可读） */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/70" />

        {/* 浮动粒子 */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ background: i % 2 === 0 ? '#ec4899' : '#8b5cf6', left: `${15 + i * 14}%`, bottom: '25%' }}
            animate={{ y: [-10, -60, -10], opacity: [0, 0.8, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent">
        <div className="flex items-end justify-between">
          <div>
            <motion.div className="flex items-center gap-2 mb-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <span className="text-2xl">🗼</span>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">东京</h1>
              <span className="text-slate-400 text-sm">東京</span>
            </motion.div>
            <motion.div className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">城市等级</span>
                <span className="text-sm font-bold text-amber-400">Lv.2</span>
              </div>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">探索进度</span>
                <div className="w-24 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full" initial={{ width: 0 }} animate={{ width: '25%' }} transition={{ duration: 1, delay: 0.8 }} />
                </div>
                <span className="text-xs text-slate-400">25%</span>
              </div>
            </motion.div>
          </div>
          <motion.div className="flex flex-col items-center gap-1 shrink-0" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.7, stiffness: 300 }}>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500/20 to-cyan-400/20 border-2 border-pink-500/30 flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">🏅</span>
            </div>
            <span className="text-[10px] text-pink-400 uppercase tracking-wider">东京徽章</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
