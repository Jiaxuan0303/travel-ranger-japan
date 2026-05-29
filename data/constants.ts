export const GAME_CONSTANTS = {
  /** 每级所需经验基数（实际 = 基数 × 等级²） */
  XP_PER_LEVEL_BASE: 100,
  /** 每次完成任务获得的基础经验 */
  BASE_QUEST_XP: 100,
  /** 答题全对额外经验加成比例 */
  QUIZ_PERFECT_BONUS: 0.5,
  /** 城市解锁后首次进入额外经验 */
  FIRST_VISIT_BONUS: 50,
  /** localStorage key */
  STORAGE_KEY: 'travel-ranger-save-v1',
  /** 存档版本 */
  SAVE_VERSION: 1,
  /** 防抖延迟 (ms) */
  SAVE_DEBOUNCE_MS: 500,
  /** 初始技能点 */
  STARTING_SKILL_POINTS: 3,
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
