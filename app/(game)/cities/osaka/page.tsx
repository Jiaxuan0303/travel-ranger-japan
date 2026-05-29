'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  OsakaHero,
  OsakaQuestLine,
  OsakaSkillTree,
  OsakaAIAbilities,
  BadgePopup,
} from '@/components/city';
import { useQuests, useCity, usePlayer } from '@/hooks/usePlayer';

export default function OsakaPage() {
  const { quests } = useQuests();
  const { progress } = useCity('osaka');
  const { player } = usePlayer();
  const isUnlocked = progress?.unlocked ?? false;
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const osakaCompleted = quests.completed.filter((id) =>
      id.startsWith('osaka-')
    ).length;
    if (osakaCompleted >= 2) {
      const timer = setTimeout(() => setShowBadge(true), 500);
      return () => clearTimeout(timer);
    }
  }, [quests.completed]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6">
      {/* Back nav */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <a
          href="/cities"
          className="text-xs text-orange-400/60 hover:text-orange-300 transition-colors inline-flex items-center gap-1"
        >
          <span>←</span> 返回城市地图
        </a>
      </motion.div>

      {/* 1. Hero */}
      <OsakaHero />

      {/* Locked banner */}
      {!isUnlocked && (
        <motion.div
          className="mb-8 p-4 rounded-xl bg-orange-950/20 border border-orange-800/20 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-orange-400/70">
            🔒 需要 Lv.5 并解锁 2 个东京技能，即可探索大阪
          </p>
          <p className="text-xs text-orange-600/50 mt-1">
            当前 Lv.{player.level} — 前往东京完成任务并解锁技能
          </p>
        </motion.div>
      )}

      {/* 2. Quest Line */}
      <OsakaQuestLine />

      {/* 3. Skill Tree */}
      <OsakaSkillTree />

      {/* 4. AI Abilities */}
      <OsakaAIAbilities />

      <div className="h-12" />

      {/* 5. Badge */}
      <BadgePopup
        open={showBadge}
        badgeName="大阪美食游侠"
        badgeEmoji="🏯"
        description="吃遍道顿堀，玩转大阪城——天下厨房的大门已为你打开！"
        onClose={() => setShowBadge(false)}
      />
    </div>
  );
}
