export const GAME_CONSTANTS = {
  /** 每级所需经验基数（实际 = 基数 × 等级²） */
  XP_PER_LEVEL_BASE: 100,
  /** localStorage key */
  STORAGE_KEY: 'travel-ranger-save-v2',
  /** 存档版本 */
  SAVE_VERSION: 2,
  /** 防抖延迟 (ms) */
  SAVE_DEBOUNCE_MS: 500,
} as const;

/** 计算升至指定等级所需的总经验 */
export function xpToLevel(level: number): number {
  const { XP_PER_LEVEL_BASE } = GAME_CONSTANTS;
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += XP_PER_LEVEL_BASE * i * i;
  }
  return total;
}

/** 根据总经验计算当前等级 */
export function levelFromXp(totalXp: number): number {
  let level = 1;
  while (xpToLevel(level + 1) <= totalXp) {
    level++;
  }
  return Math.min(level, 30);
}

/** 当前等级到下一级所需的经验 */
export function xpForNextLevel(currentLevel: number): number {
  return xpToLevel(currentLevel + 1) - xpToLevel(currentLevel);
}

/** 当前等级已获得的经验（相对于当前等级起点） */
export function xpProgressInLevel(totalXp: number): number {
  const currentLevel = levelFromXp(totalXp);
  return totalXp - xpToLevel(currentLevel);
}

/** 经验条进度百分比 (0-100) */
export function xpProgressPercent(totalXp: number): number {
  const currentLevel = levelFromXp(totalXp);
  const needed = xpForNextLevel(currentLevel);
  const progress = xpProgressInLevel(totalXp);
  return Math.min(100, Math.round((progress / needed) * 100));
}
