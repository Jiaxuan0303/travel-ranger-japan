'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KyotoHero, KyotoQuestLine, KyotoSkillTree, KyotoAIAbilities, BadgePopup } from '@/components/city';
import { useQuests, useCity, usePlayer } from '@/hooks/usePlayer';

export default function KyotoPage() {
  const { quests } = useQuests();
  const { progress } = useCity('kyoto');
  const { player } = usePlayer();
  const isUnlocked = progress?.unlocked ?? false;
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const kyotoCompleted = quests.completed.filter((id) =>
      id.startsWith('kyoto-')
    ).length;
    if (kyotoCompleted >= 2) {
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
          className="text-xs text-amber-400/60 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
        >
          <span>←</span> 返回城市地图
        </a>
      </motion.div>

      {/* 1. Hero */}
      <KyotoHero />

      {/* Locked overlay banner */}
      {!isUnlocked && (
        <motion.div
          className="mb-8 p-4 rounded-xl bg-amber-950/20 border border-amber-800/20 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-amber-400/70">
            🔒 需要 Lv.10 并先解锁大阪，即可探索京都
          </p>
          <p className="text-xs text-amber-600/50 mt-1">
            当前 Lv.{player.level} — 继续完成东京和大阪的任务来提升等级
          </p>
        </motion.div>
      )}

      {/* 2. Quest Line */}
      <KyotoQuestLine />

      {/* 3. Skill Tree */}
      <KyotoSkillTree />

      {/* 4. AI Abilities */}
      <KyotoAIAbilities />

      <div className="h-12" />

      {/* 5. Badge */}
      <BadgePopup
        open={showBadge}
        badgeName="京都文化游侠"
        badgeEmoji="⛩️"
        description="完成京都主线任务，千年古都的静谧之美尽在心中。"
        onClose={() => setShowBadge(false)}
      />
    </div>
  );
}
