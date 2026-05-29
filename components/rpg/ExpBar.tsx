'use client';

import { usePlayer } from '@/hooks/usePlayer';
import { xpProgressPercent, xpForNextLevel, xpProgressInLevel } from '@/data/constants';

export function ExpBar() {
  const { player } = usePlayer();
  const pct = xpProgressPercent(player.xp);
  const progress = xpProgressInLevel(player.xp);
  const needed = xpForNextLevel(player.level);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-amber-400">Lv.{player.level}</span>
      <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-slate-500">
        {progress}/{needed}
      </span>
    </div>
  );
}
