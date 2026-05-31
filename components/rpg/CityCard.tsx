'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CityId, cityCompletionPercent } from '@/lib/types';
import { useCity } from '@/hooks/usePlayer';
import { TOTAL_LEVELS_PER_CITY } from '@/data/levels';

interface CityCardProps {
  cityId: CityId;
  index?: number;
}

export function CityCard({ cityId, index = 0 }: CityCardProps) {
  const { city, progress, unlockHint } = useCity(cityId);

  if (!city || !progress) return null;

  const isUnlocked = progress.unlocked;
  const totalLevels = TOTAL_LEVELS_PER_CITY[cityId] ?? 3;
  const pct = cityCompletionPercent(progress, totalLevels);
  const completedLevels = Object.values(progress.levels).filter((l) => l.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link href={isUnlocked ? `/cities/${cityId}` : '#'}>
        <div
          className={`
            relative rounded-2xl border p-5 transition-all duration-300 overflow-hidden
            ${isUnlocked
              ? `bg-gradient-to-br ${city.color} border-transparent cursor-pointer hover:shadow-lg hover:shadow-${city.color.split(' ')[1]}/30 hover:-translate-y-0.5`
              : 'bg-slate-800/40 border-slate-700/50 cursor-not-allowed opacity-60'
            }
          `}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{city.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{city.name}</h3>
                  <span className="text-sm opacity-80">{city.nameJa}</span>
                </div>
              </div>
              <p className="text-sm mt-1 opacity-70">{city.subtitle}</p>
            </div>
            {isUnlocked && (
              <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white">
                已解锁
              </span>
            )}
          </div>

          {isUnlocked ? (
            <div>
              <div className="flex justify-between text-xs opacity-70 mb-1">
                <span>关卡</span>
                <span>{completedLevels}/{totalLevels}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-white/40"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 mt-2">
              🔒 {unlockHint ?? '完成前一城市关卡解锁'}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
