'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuests, useCity, usePlayer } from '@/hooks/usePlayer';
import { Button } from '@/components/ui/Button';
import { AIPanel } from '@/components/ai';
import type { QuestContext } from '@/components/ai';

interface KamakuraQuest {
  id: string; title: string; subtitle: string; cover: string;
  skillTag: string; skillColor: string; xpReward: number;
  description: string; knowledge: string[];
}

const kamakuraQuests: KamakuraQuest[] = [
  { id: 'kamakura-enoden', title: '江之电打卡', subtitle: 'Enoden Journey', cover: '🚃',
    skillTag: '电车旅行', skillColor: 'from-emerald-500 to-green-600', xpReward: 170,
    description: '乘坐百年江之电，从藤泽到镰仓，每一站都是风景。',
    knowledge: ['江之电（江ノ電）开业于1902年，是日本最古老的路面电车之一','镰仓高校前站因《灌篮高手》片头而闻名，每天都有粉丝朝圣','江之电一日券"のりおりくん"可无限次上下，是探索镰仓的最佳方式'] },
  { id: 'kamakura-bike', title: '海边骑行', subtitle: 'Seaside Cycling', cover: '🚲',
    skillTag: '海边探索', skillColor: 'from-sky-500 to-blue-600', xpReward: 150,
    description: '沿着湘南海岸骑行，海风吹拂，富士山在远方若隐若现。',
    knowledge: ['湘南海岸是日本最著名的海滨度假区之一，从镰仓延伸至小田原','天气晴朗时从由比浜可以远眺富士山，最佳观赏季节是冬季','湘南是日本冲浪文化的发源地，夏天海滩上全是冲浪爱好者'] },
  { id: 'kamakura-highschool', title: '镰仓高校前', subtitle: 'Slam Dunk Spot', cover: '🏀',
    skillTag: '青春摄影', skillColor: 'from-amber-500 to-orange-600', xpReward: 190,
    description: '站在灌篮高手片头曲的平交道口，定格属于你的青春瞬间。',
    knowledge: ['《灌篮高手》作者井上雄彦是镰仓出身，漫画中多处取景镰仓','片头曲平交道口位于镰仓高校前站步行1分钟处','镰仓高校是神奈川县立镰仓高等学校，原型就是漫画中的陵南高中'] },
  { id: 'kamakura-festival', title: '夏日祭典', subtitle: 'Summer Festival', cover: '🎆',
    skillTag: '夏日文化', skillColor: 'from-pink-500 to-fuchsia-600', xpReward: 210,
    description: '浴衣、花火、捞金鱼——在镰仓的夏日祭中感受最纯粹的日本夏天。',
    knowledge: ['镰仓花火大会每年7月在由比浜举行，是关东最著名的海上花火之一','捞金鱼（金魚すくい）是夏日祭的经典游戏，起源于江户时代','穿浴衣参加夏日祭是日本年轻人的夏季定番活动'] },
];

export function KamakuraQuestLine() {
  const { dispatch } = useQuests();
  const { progress } = useCity('kamakura');
  const { player } = usePlayer();
  const isUnlocked = progress?.unlocked ?? false;
  const [aiOpen, setAiOpen] = useState(false);
  const [activeQuest, setActiveQuest] = useState<KamakuraQuest | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const questIdMap: Record<string, string> = {
    'kamakura-enoden': 'quest-kamakura-1',
    'kamakura-bike': 'quest-kamakura-2',
    'kamakura-highschool': 'quest-kamakura-3',
    'kamakura-festival': 'quest-kamakura-4',
  };

  const handleStartLearning = (quest: KamakuraQuest) => {
    if (!isUnlocked) return;
    setActiveQuest(quest);
    setAiOpen(true);
  };

  const handleCloseAI = () => {
    if (activeQuest) {
      const gid = questIdMap[activeQuest.id];
      dispatch({ type: 'XP_GAIN', amount: activeQuest.xpReward });
      if (gid) dispatch({ type: 'QUEST_COMPLETE', questId: gid, cityId: 'kamakura' });
      setCompletedIds((prev) => [...prev, activeQuest.id]);
    }
    setAiOpen(false);
    setActiveQuest(null);
  };

  const questContext: QuestContext | null = activeQuest ? {
    questId: questIdMap[activeQuest.id] || '',
    questTitle: activeQuest.title,
    questDescription: activeQuest.description,
    cityName: '镰仓',
    cityNameJa: '鎌倉',
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
          <p className="text-slate-600 text-sm">提升等级并解锁京都后，镰仓的海风将为你而起</p>
          <p className="text-slate-700 text-xs mt-1">当前等级: Lv.{player.level} / 需要 Lv.15</p>
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
        <span className="text-xs text-teal-400/60 ml-auto">
          {completedIds.length} / {kamakuraQuests.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kamakuraQuests.map((quest, i) => {
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
                  : 'bg-sky-950/10 border-sky-800/20 hover:border-sky-600/30'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${quest.skillColor} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
                    {quest.cover}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-100 text-sm">
                      {quest.title}
                    </h3>
                    <p className="text-xs text-teal-400/60">{quest.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] text-white bg-gradient-to-r ${quest.skillColor}`}>
                        {quest.skillTag}
                      </span>
                      <span className="text-[10px] text-teal-400/60">⭐ {quest.xpReward}</span>
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
