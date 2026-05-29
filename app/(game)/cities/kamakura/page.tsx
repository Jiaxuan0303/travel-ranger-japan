'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  KamakuraHero,
  KamakuraQuestLine,
  KamakuraSkillTree,
  KamakuraAIAbilities,
  BadgePopup,
} from '@/components/city';
import { useQuests, useCity, usePlayer } from '@/hooks/usePlayer';

export default function KamakuraPage() {
  const { quests } = useQuests();
  const { progress } = useCity('kamakura');
  const { player } = usePlayer();
  const isUnlocked = progress?.unlocked ?? false;
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const completed = quests.completed.filter((id) =>
      id.startsWith('kamakura-')
    ).length;
    if (completed >= 2) {
      const timer = setTimeout(() => setShowBadge(true), 500);
      return () => clearTimeout(timer);
    }
  }, [quests.completed]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6">
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <a
          href="/cities"
          className="text-xs text-sky-400/60 hover:text-sky-300 transition-colors inline-flex items-center gap-1"
        >
          <span>←</span> 返回城市地图
        </a>
      </motion.div>

      <KamakuraHero />

      {!isUnlocked && (
        <motion.div
          className="mb-8 p-4 rounded-xl bg-sky-950/20 border border-sky-800/20 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-sky-400/70">
            🔒 需要 Lv.15 并先解锁京都，即可探索镰仓
          </p>
          <p className="text-xs text-sky-600/50 mt-1">
            当前 Lv.{player.level} — 完成前三座城市的任务来提升等级
          </p>
        </motion.div>
      )}

      <KamakuraQuestLine />
      <KamakuraSkillTree />
      <KamakuraAIAbilities />

      <div className="h-12" />

      <BadgePopup
        open={showBadge}
        badgeName="镰仓青春游侠"
        badgeEmoji="🗿"
        description="江之电的海风、镰仓高校前的夕阳——青春的夏天永远留在这里。"
        onClose={() => setShowBadge(false)}
      />
    </div>
  );
}
