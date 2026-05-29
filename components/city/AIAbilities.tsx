'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '@/hooks/usePlayer';

interface AIAbility {
  id: string;
  name: string;
  icon: string;
  unlockLevel: number;
  description: string;
  demoResult: string[];
  color: string;
}

const aiAbilities: AIAbility[] = [
  {
    id: 'ai-route',
    name: 'AI 东京三日路线',
    icon: '🤖',
    unlockLevel: 5,
    description: 'AI 根据你的兴趣自动规划东京三日精华路线',
    demoResult: [
      'Day 1: 浅草 → 晴空塔 → 秋叶原',
      'Day 2: 明治神宫 → 原宿 → 涩谷',
      'Day 3: 筑地 → 银座 → 六本木',
    ],
    color: 'from-violet-500 to-indigo-600',
  },
  {
    id: 'ai-packing',
    name: 'AI 旅行打包建议',
    icon: '🧳',
    unlockLevel: 10,
    description: 'AI 根据季节、行程自动生成行李打包清单',
    demoResult: [
      '春季: 薄外套 + 折叠伞',
      '电子: 充电宝 + Suica卡',
      '必备: 护照复印件 + 药品',
    ],
    color: 'from-cyan-500 to-teal-600',
  },
];

export function AIAbilities() {
  const { player } = usePlayer();
  const [flippedId, setFlippedId] = useState<string | null>(null);

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🤖</span>
        <h2
          className="text-lg font-bold text-white tracking-wide"
          style={{ fontFamily: "'DotGothic16', monospace" }}
        >
          AI 能力
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {aiAbilities.map((ability, i) => {
          const isUnlocked = player.level >= ability.unlockLevel;
          const isFlipped = flippedId === ability.id;

          return (
            <motion.div
              key={ability.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className=""
              style={{ perspective: '1000px' }}
            >
              <motion.div
                className="relative cursor-pointer"
                animate={{
                  rotateY: isFlipped ? 180 : 0,
                }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
                onClick={() => {
                  if (isUnlocked) {
                    setFlippedId(isFlipped ? null : ability.id);
                  }
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div
                  className={`
                    rounded-xl border p-5
                    ${isUnlocked
                      ? `bg-gradient-to-br ${ability.color} border-white/10`
                      : 'bg-slate-800/30 border-slate-700/20 opacity-50'
                    }
                  `}
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
                    {isUnlocked ? (
                      <motion.div
                        className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        ✓
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <span>🔒</span>
                        Lv.{ability.unlockLevel}
                      </div>
                    )}
                  </div>

                  {!isUnlocked && (
                    <div className="mt-3">
                      <div className="text-[10px] text-slate-600 mb-1">
                        解锁进度
                      </div>
                      <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${ability.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(100, (player.level / ability.unlockLevel) * 100)}%`,
                          }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-600 mt-1 text-right">
                        {player.level} / {ability.unlockLevel}
                      </div>
                    </div>
                  )}
                </div>

                {/* Back - demo content */}
                <div
                  className={`
                    absolute inset-0 rounded-xl border p-5
                    bg-gradient-to-br from-slate-800 to-slate-900 border-indigo-500/30
                  `}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{ability.icon}</span>
                    <span className="text-xs font-bold text-indigo-400">DEMO</span>
                  </div>
                  <ul className="space-y-2">
                    {ability.demoResult.map((line, j) => (
                      <motion.li
                        key={j}
                        className="text-xs text-slate-300 flex items-start gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + j * 0.1 }}
                      >
                        <span className="text-indigo-400 mt-0.5">▸</span>
                        {line}
                      </motion.li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-slate-600 mt-3">点击翻转回去</p>
                </div>
              </motion.div>

              {/* Unlock particle burst */}
              <AnimatePresence>
                {isUnlocked && player.level === ability.unlockLevel && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[...Array(8)].map((_, k) => (
                      <motion.div
                        key={k}
                        className="absolute w-1.5 h-1.5 rounded-full bg-indigo-400"
                        style={{
                          left: '50%',
                          top: '50%',
                        }}
                        animate={{
                          x: [0, (Math.random() - 0.5) * 120],
                          y: [0, (Math.random() - 0.5) * 120],
                          opacity: [1, 0],
                          scale: [1, 0],
                        }}
                        transition={{
                          duration: 0.8,
                          delay: k * 0.05,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
