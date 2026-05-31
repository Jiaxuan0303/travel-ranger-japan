'use client';

import { motion } from 'framer-motion';
import { useCity, usePlayer } from '@/hooks/usePlayer';
import { CityId, cityCompletionPercent } from '@/lib/types';
import { TOTAL_LEVELS_PER_CITY } from '@/data/levels';

interface CityHeroProps {
  cityId: CityId;
}

export function CityHero({ cityId }: CityHeroProps) {
  const { city, progress } = useCity(cityId);
  const { player } = usePlayer();
  const totalLevels = TOTAL_LEVELS_PER_CITY[cityId] ?? 3;
  const pct = progress ? cityCompletionPercent(progress, totalLevels) : 0;

  if (!city || !progress) return null;

  return (
    <section className="relative mb-10 overflow-hidden rounded-2xl">
      <div className="relative h-80 bg-slate-950 md:h-96">
        <img
          src={`/images/cities/${cityId}.jpg`}
          className="absolute inset-0 h-full w-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/10 to-slate-950/80" />

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-cyan-300"
            style={{ left: `${14 + i * 14}%`, bottom: '25%' }}
            animate={{ y: [-10, -58, -10], opacity: [0, 0.8, 0] }}
            transition={{ duration: 3 + i * 0.45, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent p-6">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <motion.div
              className="mb-2 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-2xl">{city.emoji}</span>
              <h1 className="text-2xl font-bold tracking-wide text-white md:text-3xl">
                {city.name}
              </h1>
              <span className="text-sm text-slate-400">{city.nameJa}</span>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-widest text-slate-500">
                  玩家等级
                </span>
                <span className="text-sm font-bold text-amber-400">
                  Lv.{player.level}
                </span>
              </div>
              <div className="h-4 w-px bg-slate-700" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-slate-500">
                  探索进度
                </span>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-700/50">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${city.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </div>
                <span className="text-xs text-slate-400">{pct}%</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="flex shrink-0 flex-col items-center gap-1"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.5, stiffness: 280 }}
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br ${city.color} text-lg font-black text-white shadow-lg`}>
              {progress.unlocked ? '✓' : 'LOCK'}
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-300">
              {progress.unlocked ? `${city.name}徽章` : '未解锁'}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
