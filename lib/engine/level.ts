import { PlayerTitle } from '@/lib/types/player';
import { levelFromXp } from '@/data/constants';
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
