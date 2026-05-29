'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayer, useCity } from '@/hooks/usePlayer';

const kyotoAI = [
  {
    id: 'ai-kyoto-garden',
    name: 'AI 枯山水解读',
    icon: '🏯',
    unlockLevel: 12,
    description: 'AI 为你解读京都寺庙枯山水的禅意与美学',
    demoResult: [
      '龙安寺: 十五石の庭，仅十四石可见',
      '大德寺: 枯山水与茶室的共生',
      '东福寺: 棋盘格纹枯山水，现代禅意',
    ],
    color: 'from-amber-500 to-yellow-600',
  },
];

export function KyotoAIAbilities() {
  const { player } = usePlayer();
  const { progress } = useCity('kyoto');
  const isUnlocked = progress?.unlocked ?? false;
  const [flippedId, setFlippedId] = useState<string | null>(null);

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🤖</span>
        <h2 className="text-lg font-bold text-white tracking-wide" style={{ fontFamily: "'DotGothic16', monospace" }}>
          AI 能力
        </h2>
      </div>

      {!isUnlocked ? (
        <div className="bg-slate-900/20 border border-slate-800/20 rounded-2xl p-8 text-center">
          <p className="text-slate-600 text-sm">解锁京都后即可查看 AI 能力</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {kyotoAI.map((ability, i) => {
            const unlocked = player.level >= ability.unlockLevel;
            const isFlipped = flippedId === ability.id;

            return (
              <motion.div
                key={ability.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                style={{ perspective: '1000px' }}
              >
                <motion.div
                  className="relative cursor-pointer"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.7, type: 'spring', stiffness: 180 }}
                  onClick={() => unlocked && setFlippedId(isFlipped ? null : ability.id)}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front */}
                  <div
                    className={`rounded-xl border p-5 ${
                      unlocked
                        ? `bg-gradient-to-br ${ability.color} border-white/10`
                        : 'bg-amber-950/20 border-amber-800/20 opacity-60'
                    }`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{ability.icon}</span>
                          <h3 className="font-bold text-white">{ability.name}</h3>
                        </div>
                        <p className="text-xs text-white/70">{ability.description}</p>
                      </div>
                      {unlocked ? (
                        <motion.div
                          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm"
                          animate={{ scale: [1, 1.08, 1] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                        >
                          ✓
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-amber-500/60">
                          <span>🔒</span>Lv.{ability.unlockLevel}
                        </div>
                      )}
                    </div>
                    {!unlocked && (
                      <div className="mt-3">
                        <div className="text-[10px] text-amber-600/50 mb-1">解锁进度</div>
                        <div className="h-1 bg-amber-950/60 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (player.level / ability.unlockLevel) * 100)}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 rounded-xl border p-5 bg-gradient-to-br from-amber-950 to-orange-950 border-amber-700/30"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{ability.icon}</span>
                      <span className="text-xs font-bold text-amber-400">DEMO</span>
                    </div>
                    <ul className="space-y-2">
                      {ability.demoResult.map((line, j) => (
                        <motion.li
                          key={j}
                          className="text-xs text-amber-100/70 flex items-start gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + j * 0.1 }}
                        >
                          <span className="text-amber-400 mt-0.5">▸</span>
                          {line}
                        </motion.li>
                      ))}
                    </ul>
                    <p className="text-[10px] text-amber-600/50 mt-3">点击翻转回去</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
