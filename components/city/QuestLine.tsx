'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuests } from '@/hooks/usePlayer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AIPanel } from '@/components/ai';
import type { QuestContext } from '@/components/ai';

interface TokyoQuest {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  skillTag: string;
  skillColor: string;
  xpReward: number;
  description: string;
  knowledge: string[];
}

const tokyoQuests: TokyoQuest[] = [
  {
    id: 'tokyo-ginza',
    title: '银座夜景探索',
    subtitle: 'Ginza Night Walk',
    cover: '🌃',
    skillTag: '城市探索',
    skillColor: 'from-violet-500 to-purple-500',
    xpReward: 150,
    description: '漫步银座的霓虹灯海，从和光百货到歌舞伎座，感受东京最奢华街区的夜晚魅力。',
    knowledge: [
      '银座地价曾为日本最高，一平方米超3000万日元',
      '周末的银座中央通会变成步行者天国，车辆禁行',
      '和光百货的钟楼是银座地标，整点报时自1894年起',
    ],
  },
  {
    id: 'tokyo-akihabara',
    title: '秋叶原动漫文化',
    subtitle: 'Akihabara Anime Quest',
    cover: '🎮',
    skillTag: '动漫文化',
    skillColor: 'from-pink-500 to-rose-500',
    xpReward: 200,
    description: '深入御宅族圣地，从电器街到女仆咖啡厅，探索日本动漫文化的核心。',
    knowledge: [
      '秋叶原二战后是黑市电器街，逐渐发展为全球御宅圣地',
      '女仆咖啡厅文化起源于2000年代初，现已成秋叶原名物',
      'Radio会馆是秋叶原地标，内有数十家模型与同人志店铺',
    ],
  },
  {
    id: 'tokyo-subway',
    title: '东京地铁生存指南',
    subtitle: 'Metro Survival',
    cover: '🚇',
    skillTag: '地铁生存',
    skillColor: 'from-cyan-500 to-blue-500',
    xpReward: 180,
    description: '解密东京地下迷宫：山手线、都营线、Metro线——学会像东京人一样通勤。',
    knowledge: [
      '山手线全长34.5km，绕东京核心区一圈约60分钟',
      '东京Metro+都营共13条线路，日均运送超800万人次',
      'Suica企鹅卡可在全日本主要城市通用，还能在便利店支付',
    ],
  },
  {
    id: 'tokyo-konbini',
    title: '深夜便利店体验',
    subtitle: 'Konbini After Dark',
    cover: '🏪',
    skillTag: '美食发现',
    skillColor: 'from-amber-500 to-orange-500',
    xpReward: 120,
    description: '24小时的日本文化博物馆：从饭团到关东煮，便利店的深夜魔法。',
    knowledge: [
      '日本三大便利店：7-Eleven、全家、罗森，全国超5万家',
      '便利店おでん（关东煮）是冬季人气商品，汤底用昆布鲣鱼',
      '日本便利店可代收快递、买演唱会门票、打印文件、ATM取款',
    ],
  },
];

type QuestStep = 'idle' | 'done';

export function QuestLine() {
  const { dispatch } = useQuests();
  const [aiOpen, setAiOpen] = useState(false);
  const [activeQuest, setActiveQuest] = useState<TokyoQuest | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const questIdMap: Record<string, string> = {
    'tokyo-ginza': 'quest-tokyo-1',
    'tokyo-akihabara': 'quest-tokyo-2',
    'tokyo-subway': 'quest-tokyo-3',
    'tokyo-konbini': 'quest-tokyo-4',
  };

  const handleStartLearning = (quest: TokyoQuest) => {
    setActiveQuest(quest);
    setAiOpen(true);
  };

  const handleCloseAI = () => {
    if (activeQuest) {
      const globalQuestId = questIdMap[activeQuest.id];
      dispatch({ type: 'XP_GAIN', amount: activeQuest.xpReward });
      if (globalQuestId) {
        dispatch({ type: 'QUEST_COMPLETE', questId: globalQuestId, cityId: 'tokyo' });
      }
      setCompletedIds((prev) => [...prev, activeQuest.id]);
    }
    setAiOpen(false);
    setActiveQuest(null);
  };

  // AI 面板任务上下文
  const questContext: QuestContext | null = activeQuest ? {
    questId: questIdMap[activeQuest.id] || '',
    questTitle: activeQuest.title,
    questDescription: activeQuest.description,
    cityName: '东京',
    cityNameJa: '東京',
    knowledge: activeQuest.knowledge,
    skillTag: activeQuest.skillTag,
    difficulty: 1,
  } : null;

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📜</span>
        <h2
          className="text-lg font-bold text-white tracking-wide"
          style={{ fontFamily: "'DotGothic16', monospace" }}
        >
          主线任务
        </h2>
        <span className="text-xs text-slate-600">
          {completedIds.length} / {tokyoQuests.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tokyoQuests.map((quest, i) => {
          const isCompleted = completedIds.includes(quest.id);
          const isActive = activeQuest?.id === quest.id;

          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div
                className={`
                  relative overflow-hidden rounded-xl border p-4
                  transition-all duration-500
                  ${isCompleted
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : isActive
                    ? 'bg-indigo-500/10 border-indigo-500/30 ring-2 ring-indigo-500/30'
                    : 'bg-slate-800/40 border-slate-700/30 hover:border-slate-600/50'
                  }
                `}
              >
                {/* Cover area */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${quest.skillColor} flex items-center justify-center text-2xl shrink-0`}>
                    {quest.cover}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-100 text-sm">
                      {quest.title}
                    </h3>
                    <p className="text-xs text-slate-500">{quest.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge color={`bg-gradient-to-r ${quest.skillColor} text-white text-[10px]`}>
                        {quest.skillTag}
                      </Badge>
                      <span className="text-[10px] text-amber-400">⭐ {quest.xpReward}</span>
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
                  {isCompleted ? '✓ 已完成' : isActive ? '🤖 学习中...' : '开始学习'}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI 学习面板 */}
      <AIPanel
        open={aiOpen}
        questContext={questContext}
        onClose={handleCloseAI}
      />
    </section>
  );
}
