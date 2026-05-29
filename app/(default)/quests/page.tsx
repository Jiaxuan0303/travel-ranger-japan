'use client';

import { useState } from 'react';
import { CityId, CITY_IDS } from '@/lib/types';
import { allQuests } from '@/data/quests';
import { QuestCard } from '@/components/rpg/QuestCard';
import { PageTransition } from '@/components/animation';

const cityFilterLabels: { key: string; label: string; emoji: string }[] = [
  { key: 'all', label: '全部', emoji: '🌏' },
  { key: 'tokyo', label: '东京', emoji: '🗼' },
  { key: 'osaka', label: '大阪', emoji: '🏯' },
  { key: 'kyoto', label: '京都', emoji: '⛩️' },
  { key: 'kamakura', label: '镰仓', emoji: '🗿' },
];

export default function QuestsPage() {
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'all'
      ? allQuests
      : allQuests.filter((q) => q.cityId === filter);

  return (
    <PageTransition>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-100">任务板</h1>
        <p className="text-sm text-slate-500 mt-1">
          观看视频完成任务，获得经验与技能
        </p>
      </div>

      {/* 城市筛选 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {cityFilterLabels.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              filter === f.key
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <span>{f.emoji}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((quest, i) => (
          <QuestCard key={quest.id} quest={quest} index={i} />
        ))}
      </div>
    </PageTransition>
  );
}
