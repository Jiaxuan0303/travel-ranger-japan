import { City, CityId, PlayerState, SkillsState } from '@/lib/types';
import { cities } from '@/data/cities';
import { skillsById } from '@/data/skills';

/** 检查城市是否满足解锁条件 */
export function canUnlockCity(
  city: City,
  player: PlayerState,
  skills: SkillsState,
  cityStates: Record<CityId, { unlocked: boolean }>
): boolean {
  // 无解锁条件 = 初始城市，始终可解锁
  if (!city.unlockCondition) return true;

  const { minLevel, requiredSkills, requiredCities } = city.unlockCondition;

  // 检查等级
  if (player.level < minLevel) return false;

  // 检查必需技能
  for (const sid of requiredSkills) {
    if (!skills.unlocked.includes(sid)) return false;
  }

  // 检查必需城市
  for (const cid of requiredCities) {
    if (!cityStates[cid]?.unlocked) return false;
  }

  return true;
}

/** 获取城市解锁状态（含未解锁的原因简要描述） */
export function getCityUnlockHint(
  city: City,
  player: PlayerState,
  skills: SkillsState,
  cityStates: Record<CityId, { unlocked: boolean }>
): string | null {
  if (!city.unlockCondition) return null; // 已解锁或无需条件

  const reasons: string[] = [];
  const { minLevel, requiredSkills, requiredCities } = city.unlockCondition;

  if (player.level < minLevel) {
    reasons.push(`需要等级 ${minLevel}`);
  }

  for (const sid of requiredSkills) {
    if (!skills.unlocked.includes(sid)) {
      const skill = skillsById[sid];
      reasons.push(`需要技能：${skill?.name ?? sid}`);
    }
  }

  for (const cid of requiredCities) {
    if (!cityStates[cid]?.unlocked) {
      const city = cities[cid];
      reasons.push(`需要解锁：${city?.name ?? cid}`);
    }
  }

  return reasons.length > 0 ? reasons.join('、') : null;
}

/** 检查某个技能是否可以被解锁（前置技能已满足、有足够技能点） */
export function canUnlockSkill(
  skillId: string,
  skills: SkillsState
): boolean {
  const skill = skillsById[skillId];
  if (!skill) return false;

  // 已经解锁了
  if (skills.unlocked.includes(skillId)) return false;

  // 技能点不够
  if (skills.points < skill.cost) return false;

  // 前置技能不满足
  for (const prereq of skill.prerequisites) {
    if (!skills.unlocked.includes(prereq)) return false;
  }

  return true;
}
