'use client';

import { motion } from 'framer-motion';
import { CITY_IDS, CityId } from '@/lib/types';
import { CityCard } from '@/components/dashboard/CityCard';
import { useGame } from '@/lib/store/GameProvider';

export default function DashboardPage() {
  const { state } = useGame();
  const unlockedCount = (Object.keys(state.cities) as CityId[]).filter(
    (cid) => state.cities[cid]?.unlocked
  ).length;

  return (
    <div className="max-w-[90rem] mx-auto px-6">
      {/* Title */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p
          className="text-xs text-violet-400 uppercase tracking-[0.2em] mb-2"
          style={{ fontFamily: "'DotGothic16', monospace" }}
        >
          ── Select Destination ──
        </p>
        <h1 className="text-3xl font-bold text-white tracking-wide">
          探索日本
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          选择城市，开始你的拼图之旅
        </p>
      </motion.div>

      {/* City Grid - 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
        {CITY_IDS.map((cityId, index) => (
          <CityCard key={cityId} cityId={cityId} index={index} />
        ))}
      </div>

      {/* Bottom decorative text */}
      <motion.div
        className="mt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <p
          className="text-[11px] text-slate-700 tracking-[0.3em]"
          style={{ fontFamily: "'DotGothic16', monospace" }}
        >
          {unlockedCount} / {CITY_IDS.length} CITIES UNLOCKED
        </p>
      </motion.div>
    </div>
  );
}
