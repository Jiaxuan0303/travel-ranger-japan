'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuests, useCity, usePlayer } from '@/hooks/usePlayer';
import { Button } from '@/components/ui/Button';
import { AIPanel } from '@/components/ai';
import type { QuestContext } from '@/components/ai';

interface KyotoQuest {
  id: string; title: string; subtitle: string; cover: string;
  skillTag: string; skillColor: string; xpReward: number;
  description: string; knowledge: string[];
}

const kyotoQuests: KyotoQuest[] = [
  { id: 'kyoto-shrine', title: '神社巡礼', subtitle: 'Shrine Pilgrimage', cover: '⛩️',
    skillTag: '神社文化', skillColor: 'from-amber-500 to-orange-600', xpReward: 180,
    description: '从伏见稻荷的千本鸟居到八坂神社的灯笼，踏上京都最神圣的巡礼之路。',
    knowledge: ['伏见稻荷大社有超过1万座鸟居，绵延4公里至稻荷山顶','八坂神社是祇园祭的主办神社，祇园祭是日本三大祭之一','参拜神社的正确礼仪：二礼二拍手一礼'] },
  { id: 'kyoto-kimono', title: '和服体验', subtitle: 'Kimono Experience', cover: '👘',
    skillTag: '慢旅行', skillColor: 'from-rose-400 to-pink-600', xpReward: 160,
    description: '穿上一袭和服，漫步在祇园的石板路上，感受千年古都的优雅时光。',
    knowledge: ['和服（着物）按场合分为振袖、訪問着、留袖等多种类型','袴（はかま）原是武士正装，现为毕业典礼礼服','穿和服时左襟必须压在右襟上，反穿是往生者的穿法'] },
  { id: 'kyoto-matcha', title: '抹茶文化', subtitle: 'Matcha Culture', cover: '🍵',
    skillTag: '茶道体验', skillColor: 'from-emerald-500 to-green-700', xpReward: 200,
    description: '在宇治的茶园中，从碾茶到点茶，亲手体验日本茶道的千年传承。',
    knowledge: ['抹茶是将遮光栽培的碾茶用石磨研磨成微粉','宇治是日本最著名的抹茶产地，始于镰仓时代','茶道精神「和敬清寂」：和=和谐 敬=尊重 清=纯净 寂=内心平静'] },
  { id: 'kyoto-kiyomizu', title: '清水寺路线', subtitle: 'Kiyomizu Route', cover: '🏯',
    skillTag: '历史理解', skillColor: 'from-amber-600 to-yellow-700', xpReward: 220,
    description: '从清水寺的舞台眺望京都全景，沿着二年坂三年坂，探索古都最美的散步路线。',
    knowledge: ['清水寺建于778年，本堂舞台由139根木柱支撑，完全不用一颗钉子','二年坂三年坂是通往清水寺的石板坡道，两旁多为江户时代建筑','「清水の舞台から飛び降りる」是日本谚语，意为下了很大的决心'] },
];

export function KyotoQuestLine() {
  const { dispatch } = useQuests();
  const { progress } = useCity('kyoto');
  const { player } = usePlayer();
  const isUnlocked = progress?.unlocked ?? false;
  const [aiOpen, setAiOpen] = useState(false);
  const [activeQuest, setActiveQuest] = useState<KyotoQuest | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const questIdMap: Record<string, string> = {
    'kyoto-shrine': 'quest-kyoto-1',
    'kyoto-kimono': 'quest-kyoto-2',
    'kyoto-matcha': 'quest-kyoto-3',
    'kyoto-kiyomizu': 'quest-kyoto-4',
  };

  const handleStartLearning = (quest: KyotoQuest) => {
    if (!isUnlocked) return;
    setActiveQuest(quest);
    setAiOpen(true);
  };

  const handleCloseAI = () => {
    if (activeQuest) {
      const gid = questIdMap[activeQuest.id];
      dispatch({ type: 'XP_GAIN', amount: activeQuest.xpReward });
      if (gid) dispatch({ type: 'QUEST_COMPLETE', questId: gid, cityId: 'kyoto' });
      setCompletedIds((prev) => [...prev, activeQuest.id]);
    }
    setAiOpen(false);
    setActiveQuest(null);
  };

  const questContext: QuestContext | null = activeQuest ? {
    questId: questIdMap[activeQuest.id] || '',
    questTitle: activeQuest.title,
    questDescription: activeQuest.description,
    cityName: '京都',
    cityNameJa: '京都',
    knowledge: activeQuest.knowledge,
    skillTag: activeQuest.skillTag,
    difficulty: 1,
  } : null;

  if (!isUnlocked) {
    return (
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📜</span>
          <h2 className="text-lg font-bold text-slate-600 tracking-wide" style={{ fontFamily: "'DotGothic16', monospace" }}>主线任务</h2>
        </div>
        <div className="bg-slate-900/30 border border-slate-800/30 rounded-2xl p-10 text-center">
          <p className="text-slate-600 text-sm">提升等级并解锁大阪后，京都任务将为你开放</p>
          <p className="text-slate-700 text-xs mt-1">当前等级: Lv.{player.level} / 需要 Lv.10</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📜</span>
        <h2 className="text-lg font-bold text-white tracking-wide" style={{ fontFamily: "'DotGothic16', monospace" }}>
          主线任务
        </h2>
        <span className="text-xs text-amber-400/60 ml-auto">
          {completedIds.length} / {kyotoQuests.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kyotoQuests.map((quest, i) => {
          const isCompleted = completedIds.includes(quest.id);
          const isActive = activeQuest?.id === quest.id;

          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-500 ${
                isCompleted
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : isActive
                  ? 'bg-indigo-500/10 border-indigo-500/30 ring-2 ring-indigo-500/30'
                  : 'bg-amber-950/20 border-amber-800/20 hover:border-amber-700/40'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${quest.skillColor} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
                    {quest.cover}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-100 text-sm">
                      {quest.title}
                    </h3>
                    <p className="text-xs text-amber-400/60">{quest.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] text-white bg-gradient-to-r ${quest.skillColor}`}>
                        {quest.skillTag}
                      </span>
                      <span className="text-[10px] text-amber-400/60">⭐ {quest.xpReward}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                  {quest.description}
                </p>

                {isActive && (
                  <div className="text-center py-2 mb-2">
                    <p className="text-xs text-indigo-400" style={{ fontFamily: "'DotGothic16', monospace" }}>
                      🤖 AI 助手已打开
                    </p>
                  </div>
                )}

                <Button
                  size="sm"
                  variant={isCompleted ? 'secondary' : 'primary'}
                  className="w-full"
                  disabled={isCompleted || isActive}
                  onClick={() => handleStartLearning(quest)}
                >
                  {isCompleted ? '✓ 已完成' : isActive ? '🤖 学习中...' : '开始探索'}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AIPanel
        open={aiOpen}
        questContext={questContext}
        onClose={handleCloseAI}
      />
    </section>
  );
}
