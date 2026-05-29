'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Quest, DIFFICULTY_LABELS } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useQuests } from '@/hooks/usePlayer';
import { cities } from '@/data/cities';

interface QuestCardProps {
  quest: Quest;
  index?: number;
}

export function QuestCard({ quest, index = 0 }: QuestCardProps) {
  const { quests } = useQuests();
  const isCompleted = quests.completed.includes(quest.id);
  const city = cities[quest.cityId];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
    >
      <Link href={isCompleted ? '#' : `/quests/${quest.id}`}>
        <Card
          hover={!isCompleted}
          className={`${isCompleted ? 'opacity-50' : ''}`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {city && <span>{city.emoji}</span>}
              <h3 className="font-semibold text-slate-100">{quest.title}</h3>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {isCompleted && <span className="text-emerald-400 text-xs">✓</span>}
              <Badge color={
                quest.difficulty === 1 ? 'bg-emerald-500/20 text-emerald-400' :
                quest.difficulty === 2 ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }>
                {DIFFICULTY_LABELS[quest.difficulty]}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-slate-400 line-clamp-2">{quest.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span>⏱ {Math.floor(quest.durationSec / 60)}分{quest.durationSec % 60}秒</span>
            <span>⭐ {quest.xpReward} EXP</span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
