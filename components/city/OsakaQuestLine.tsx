'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuests, useCity, usePlayer } from '@/hooks/usePlayer';
import { Button } from '@/components/ui/Button';

interface OsakaQuest {
  id: string; title: string; subtitle: string; cover: string;
  skillTag: string; skillColor: string; xpReward: number;
  description: string; knowledge: string[];
}

const osakaQuests: OsakaQuest[] = [
  { id: 'osaka-okonomiyaki', title: '大阪烧探索', subtitle: 'Okonomiyaki Quest', cover: '🧑‍🍳',
    skillTag: '美食探索', skillColor: 'from-orange-500 to-red-600', xpReward: 160,
    description: '从道顿堀到鹤桥，寻找最地道的大阪烧，体验"面粉文化"的极致。',
    knowledge: ['大阪烧（お好み焼き）意为"随你喜好烧"，是大阪灵魂食物','关西风大阪烧将面糊与食材混合煎制，不同于广岛风的分层做法','鹤桥是的大阪烧激战区，数十家老铺密集排列'] },
  { id: 'osaka-dotonbori', title: '道顿堀夜游', subtitle: 'Dotonbori Night', cover: '🌃',
    skillTag: '夜生活', skillColor: 'from-pink-500 to-rose-600', xpReward: 200,
    description: '霓虹灯海中的美食天堂，格力高广告牌下感受大阪最热闹的夜晚。',
    knowledge: ['道顿堀运河建于1612年，曾是剧场聚集区，今为美食地标','格力高跑男广告牌自1935年起就是大阪标志，已更新六代','かに道楽的巨型螃蟹招牌会动，是道顿堀最出名的地标'] },
  { id: 'osaka-arcade', title: '日本街机文化', subtitle: 'Game Center', cover: '🕹️',
    skillTag: '街头文化', skillColor: 'from-cyan-500 to-blue-600', xpReward: 180,
    description: '从太鼓达人到UFO抓娃娃机，探索日本街机游戏厅。',
    knowledge: ['日本街机（ゲーセン）文化始于1978年《太空侵略者》热潮','太鼓达人已发行20余年，是全球最知名的音乐街机游戏','UFOキャッチャー（抓娃娃机）是日本街机最吸金的品类之一'] },
  { id: 'osaka-kuromon', title: '黑门市场', subtitle: 'Kuromon Market', cover: '🦀',
    skillTag: '社交交流', skillColor: 'from-red-500 to-orange-600', xpReward: 170,
    description: '"大阪的厨房"，用关西腔和摊主聊天，品尝最新鲜的海鲜与和牛。',
    knowledge: ['黑门市场有近200年历史，原名"圆明寺市场"','市场全长约580米，聚集了150多家店铺','大阪人用"おおきに"表示谢谢，比"ありがとう"更地道'] },
];

type QuestStep = 'idle' | 'knowledge' | 'learning' | 'done';

export function OsakaQuestLine() {
  const { dispatch } = useQuests();
  const { progress } = useCity('osaka');
  const { player } = usePlayer();
  const isUnlocked = progress?.unlocked ?? false;
  const [step, setStep] = useState<QuestStep>('idle');
  const [activeQuest, setActiveQuest] = useState<OsakaQuest | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const questIdMap: Record<string, string> = {
    'osaka-okonomiyaki': 'quest-osaka-1', 'osaka-dotonbori': 'quest-osaka-2',
    'osaka-arcade': 'quest-osaka-3', 'osaka-kuromon': 'quest-osaka-4',
  };

  const handleStartLearning = (quest: OsakaQuest) => {
    if (!isUnlocked) return;
    setActiveQuest(quest); setStep('knowledge');
    setTimeout(() => setStep('learning'), 3000);
    setTimeout(() => {
      dispatch({ type: 'XP_GAIN', amount: quest.xpReward });
      const gid = questIdMap[quest.id];
      if (gid) dispatch({ type: 'QUEST_COMPLETE', questId: gid, cityId: 'osaka' });
      setCompletedIds((prev) => [...prev, quest.id]);
      setStep('done');
      setTimeout(() => { setStep('idle'); setActiveQuest(null); }, 1500);
    }, 5000);
  };

  if (!isUnlocked) {
    return (
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📜</span>
          <h2 className="text-lg font-bold text-slate-600 tracking-wide" style={{ fontFamily: "'DotGothic16', monospace" }}>主线任务</h2>
        </div>
        <div className="bg-slate-900/30 border border-slate-800/30 rounded-2xl p-10 text-center">
          <motion.div className="text-6xl mb-3 opacity-30" animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}>🔒</motion.div>
          <p className="text-slate-600 text-sm">提升等级并解锁东京技能后，大阪任务将为你开放</p>
          <p className="text-slate-700 text-xs mt-1">当前等级: Lv.{player.level} / 需要 Lv.5</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📜</span>
        <h2 className="text-lg font-bold text-white tracking-wide" style={{ fontFamily: "'DotGothic16', monospace" }}>主线任务</h2>
        <span className="text-xs text-orange-400/60 ml-auto">{completedIds.length} / {osakaQuests.length}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {osakaQuests.map((quest, i) => {
          const isCompleted = completedIds.includes(quest.id);
          const isActive = activeQuest?.id === quest.id;
          const isKnowledge = isActive && step === 'knowledge';
          const isLearning = isActive && step === 'learning';
          const justDone = isActive && step === 'done';
          return (
            <motion.div key={quest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-500 ${
                isCompleted ? 'bg-emerald-500/5 border-emerald-500/20'
                : isKnowledge ? 'bg-amber-500/10 border-amber-500/30 ring-2 ring-amber-400/30'
                : isLearning ? 'bg-orange-500/10 border-orange-500/40 ring-2 ring-orange-500/30'
                : 'bg-slate-800/30 border-orange-800/20 hover:border-orange-600/40'}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${quest.skillColor} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>{quest.cover}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-100 text-sm">{quest.title}</h3>
                    <p className="text-xs text-orange-400/50">{quest.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] text-white bg-gradient-to-r ${quest.skillColor}`}>{quest.skillTag}</span>
                      <span className="text-[10px] text-orange-400">⭐ {quest.xpReward}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-3 line-clamp-2">{quest.description}</p>
                <AnimatePresence>
                  {isActive && !justDone && (
                    <motion.div className="absolute inset-0 backdrop-blur-md flex items-center justify-center rounded-xl z-10"
                      style={{ background: isKnowledge ? 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(15,23,42,0.9))' : 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(15,23,42,0.9))' }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="text-center p-3">
                        {isKnowledge && (<>
                          <motion.div className="text-2xl mb-2" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2 }}>💡</motion.div>
                          <p className="text-[11px] text-amber-300 font-medium mb-2" style={{ fontFamily: "'DotGothic16', monospace" }}>旅行知识</p>
                          <ul className="space-y-1.5 text-left">
                            {quest.knowledge.map((k, j) => (
                              <motion.li key={j} className="text-[10px] text-slate-300 flex items-start gap-1" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: j * 0.3 }}>
                                <span className="text-amber-400 mt-0.5 shrink-0">•</span>{k}
                              </motion.li>
                            ))}
                          </ul>
                        </>)}
                        {isLearning && (<>
                          <motion.div className="text-4xl mb-2" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>🎮</motion.div>
                          <p className="text-sm text-orange-300 font-medium">探索中...</p>
                          <div className="mt-2 flex gap-1 justify-center">
                            {[...Array(10)].map((_, j) => (
                              <motion.div key={j} className="w-1 h-3 rounded-sm" style={{ background: j % 2 === 0 ? '#f97316' : '#ec4899' }}
                                animate={{ scaleY: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.6, delay: j * 0.06 }} />
                            ))}
                          </div>
                        </>)}
                      </div>
                    </motion.div>
                  )}
                  {justDone && (
                    <motion.div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <motion.div className="text-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                        <div className="text-3xl mb-1">✅</div>
                        <p className="text-xs text-emerald-300 font-medium">完成！+{quest.xpReward} EXP</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Button size="sm" variant={isCompleted ? 'secondary' : 'primary'} className="w-full"
                  disabled={isCompleted || isActive} onClick={() => handleStartLearning(quest)}>
                  {isCompleted ? '✓ 已完成' : isActive ? '学习中...' : '开始探索'}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
