'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TokyoHero,
  QuestLine,
  TokyoSkillTree,
  AIAbilities,
  BadgePopup,
} from '@/components/city';
import { useQuests } from '@/hooks/usePlayer';

export default function TokyoPage() {
  const { quests } = useQuests();
  const [showBadge, setShowBadge] = useState(false);

  // Show badge popup when player completes 2+ quests
  useEffect(() => {
    const tokyoCompleted = quests.completed.filter((id) =>
      id.startsWith('tokyo-')
    ).length;
    if (tokyoCompleted >= 2) {
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
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1"
        >
          <span>←</span> 返回城市地图
        </a>
      </motion.div>

      {/* 1. Hero */}
      <TokyoHero />

      {/* 2. Main Quest Line */}
      <QuestLine />

      {/* 3. Skill Tree */}
      <TokyoSkillTree />

      {/* 4. AI Abilities */}
      <AIAbilities />

      {/* Bottom spacer */}
      <div className="h-12" />

      {/* 5. Badge Popup */}
      <BadgePopup
        open={showBadge}
        badgeName="东京新人游侠"
        badgeEmoji="🏅"
        description="完成东京主线任务，获得新人游侠徽章。东京的霓虹为你点亮！"
        onClose={() => setShowBadge(false)}
      />
    </div>
  );
}
