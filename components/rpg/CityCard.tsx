'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CityId } from '@/lib/types';
import { useCity } from '@/hooks/usePlayer';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface CityCardProps {
  cityId: CityId;
  index?: number;
}

export function CityCard({ cityId, index = 0 }: CityCardProps) {
  const { city, progress, canUnlock, unlockHint } = useCity(cityId);

  if (!city || !progress) return null;

  const isUnlocked = progress.unlocked;

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
            <ProgressBar
              value={progress.completionPercent}
              color="from-white/40 to-white/60"
              size="sm"
            />
          ) : (
            <p className="text-xs text-slate-400 mt-2">
              🔒 {unlockHint ?? '条件未知'}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
