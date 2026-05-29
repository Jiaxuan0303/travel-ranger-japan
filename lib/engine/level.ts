import { PlayerTitle } from '@/lib/types/player';
import { levelFromXp, xpToLevel } from '@/data/constants';
import { getTitleForLevel } from '@/lib/types/player';

export { levelFromXp };

/** 计算获得经验后能升级多少级 */
export function calcLevelUp(
  currentXp: number,
  gainedXp: number
): {
  newTotal: number;
  newLevel: number;
  levelsGained: number;
  newTitle: PlayerTitle;
} {
  const newTotal = currentXp + gainedXp;
  const oldLevel = levelFromXp(currentXp);
  const newLevel = levelFromXp(newTotal);
  const levelsGained = newLevel - oldLevel;

  return {
    newTotal,
    newLevel,
    levelsGained: Math.max(0, levelsGained),
    newTitle: getTitleForLevel(newLevel),
  };
}

/** 生成初始玩家状态 */
export function createInitialPlayer(): import('@/lib/types').PlayerState {
  return {
    level: 1,
    xp: 0,
    skillPoints: 3,
    title: '见习游侠',
    totalVideosWatched: 0,
    joinDate: new Date().toISOString(),
  };
}
