'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CulturalInfo, CityId } from '@/lib/types';

interface CulturalPopupProps {
  open: boolean;
  culturalInfo: CulturalInfo | null;
  cityId: CityId | null;
  levelNumber: number | null;
  hasNextLevel: boolean;
  nextCityName?: string; // 下一城市的名称，如"大阪"
  onNextLevel: () => void;
  onBackToCity: () => void;
}

const cityNames: Record<string, string> = {
  tokyo: '东京',
  osaka: '大阪',
  kyoto: '京都',
  kamakura: '镰仓',
};

const cityEmojis: Record<string, string> = {
  tokyo: '🗼',
  osaka: '🏯',
  kyoto: '⛩️',
  kamakura: '🗿',
};

export function CulturalPopup({
  open,
  culturalInfo,
  cityId,
  levelNumber,
  hasNextLevel,
  nextCityName,
  onNextLevel,
  onBackToCity,
}: CulturalPopupProps) {
  if (!culturalInfo) return null;

  const sections = [
    { key: 'culture', icon: '🏛️', title: '文化', content: culturalInfo.culture },
    { key: 'food', icon: '🍣', title: '饮食', content: culturalInfo.food },
    { key: 'history', icon: '⚔️', title: '历史', content: culturalInfo.history },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onBackToCity}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-700/70 shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-b from-slate-900 via-slate-900 to-transparent pt-6 px-6 pb-2">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{cityId ? cityEmojis[cityId] : '🎉'}</span>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">
                    {cityId ? cityNames[cityId] : ''} · 第{levelNumber}关完成！
                  </h2>
                  <p className="text-sm text-emerald-400 font-medium">🎉 拼图完成，以下是这座城市的科普知识</p>
                </div>
              </div>
            </div>

            {/* Content sections */}
            <div className="px-6 pb-4 space-y-3">
              {sections.map((section, i) => (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                  className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{section.icon}</span>
                    <h3 className="font-semibold text-slate-100">{section.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">{section.content}</p>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent px-6 pb-6 pt-2 space-y-2">
              {hasNextLevel && (
                <button
                  onClick={onNextLevel}
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-semibold text-white transition-colors"
                >
                  {nextCityName ? `▶ 前往${nextCityName}` : '▶ 下一关'}
                </button>
              )}
              <button
                onClick={onBackToCity}
                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 hover:bg-slate-700/60 py-3 text-sm font-semibold text-slate-300 transition-colors"
              >
                返回城市
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
