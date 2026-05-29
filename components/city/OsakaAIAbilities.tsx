'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayer, useCity } from '@/hooks/usePlayer';

const osakaAI = [
  {
    id: 'ai-osaka-food',
    name: 'AI 大阪美食路线',
    icon: '🍣',
    unlockLevel: 8,
    description: 'AI 根据你的口味自动规划大阪一日美食之旅',
    demoResult: [
      '早餐: 黑门市场的海鲜丼',
      '午餐: 道顿堀的章鱼烧 + 大阪烧',
      '晚餐: 心斋桥的炸串放题',
    ],
    color: 'from-orange-500 via-red-500 to-pink-500',
  },
];

export function OsakaAIAbilities() {
  const { player } = usePlayer();
  const { progress } = useCity('osaka');
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
          <p className="text-slate-600 text-sm">解锁大阪后即可查看 AI 能力</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {osakaAI.map((ability, i) => {
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
                  transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
                  onClick={() => unlocked && setFlippedId(isFlipped ? null : ability.id)}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front */}
                  <div
                    className={`rounded-xl border p-5 ${
                      unlocked
                        ? `bg-gradient-to-br ${ability.color} border-white/10`
                        : 'bg-slate-800/20 border-orange-800/20 opacity-60'
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
                          transition={{ repeat: Infinity, duration: 2.5 }}
                        >
                          ✓
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-orange-500/60">
                          <span>🔒</span>Lv.{ability.unlockLevel}
                        </div>
                      )}
                    </div>
                    {!unlocked && (
                      <div className="mt-3">
                        <div className="text-[10px] text-orange-600/50 mb-1">解锁进度</div>
                        <div className="h-1 bg-orange-950/60 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"
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
                    className="absolute inset-0 rounded-xl border p-5 bg-gradient-to-br from-orange-950 to-red-950 border-orange-700/30"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{ability.icon}</span>
                      <span className="text-xs font-bold text-orange-400">DEMO</span>
                    </div>
                    <ul className="space-y-2">
                      {ability.demoResult.map((line, j) => (
                        <motion.li
                          key={j}
                          className="text-xs text-orange-100/70 flex items-start gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + j * 0.1 }}
                        >
                          <span className="text-orange-400 mt-0.5">▸</span>
                          {line}
                        </motion.li>
                      ))}
                    </ul>
                    <p className="text-[10px] text-orange-600/50 mt-3">点击翻转回去</p>
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
