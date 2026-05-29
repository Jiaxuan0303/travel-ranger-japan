'use client';

import { motion } from 'framer-motion';
import { usePlayer, useQuests } from '@/hooks/usePlayer';
import { xpProgressPercent, xpForNextLevel, xpProgressInLevel } from '@/data/constants';

export function TopBar() {
  const { player } = usePlayer();
  const { quests } = useQuests();
  const xpPct = xpProgressPercent(player.xp);
  const xpIn = xpProgressInLevel(player.xp);
  const xpNeed = xpForNextLevel(player.level);

  return (
    <motion.header
      className="relative z-20 border-b border-white/5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-[90rem] mx-auto">
        {/* Left: Level & EXP */}
        <div className="flex items-center gap-6">
          {/* Level badge */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center backdrop-blur-sm">
              <span className="text-amber-400 font-bold text-sm">Lv</span>
            </div>
            <div>
              <div className="text-lg font-bold text-white leading-none">
                {player.level}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                {player.title}
              </div>
            </div>
          </div>

          {/* EXP Bar */}
          <div className="hidden sm:block w-48">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                EXP
              </span>
              <span className="text-[10px] text-slate-600 tabular-nums">
                {xpIn} / {xpNeed}
              </span>
            </div>
            <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex items-center gap-4">
          {/* Daily Quests */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30 backdrop-blur-sm">
            <span className="text-sm">📜</span>
            <div className="text-right">
              <div className="text-xs text-slate-400">今日任务</div>
              <div className="text-sm font-bold text-emerald-400 tabular-nums">
                {quests.completed.length} <span className="text-slate-600">/ 3</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30 backdrop-blur-sm">
            <span className="text-sm">🏅</span>
            <div className="text-right">
              <div className="text-xs text-slate-400">徽章</div>
              <div className="text-sm font-bold text-purple-400 tabular-nums">
                {Math.floor(quests.completed.length / 3)}
              </div>
            </div>
          </div>

          {/* Skill Points */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30 backdrop-blur-sm">
            <span className="text-sm">⭐</span>
            <div className="text-right">
              <div className="text-xs text-slate-400">技能点</div>
              <div className="text-sm font-bold text-amber-400 tabular-nums">
                {player.skillPoints}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
