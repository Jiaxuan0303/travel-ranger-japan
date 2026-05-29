import { Skill } from '@/lib/types';
import { skillsById, allSkills } from '@/data/skills';
import { canUnlockSkill as checkSkill } from './cities';
import { SkillsState } from '@/lib/types/skill';

export { canUnlockSkill } from './cities';

/** 获取一个技能解锁后连带解锁的技能（后续解锁链） */
export function getUnlockableChain(
  unlocked: string[],
  availablePoints: number
): string[] {
  const skills: SkillsState = { unlocked, points: availablePoints };
  return allSkills
    .filter((s) => !unlocked.includes(s.id))
    .map((s) => s.id);
}

/** 按分支分组技能 */
export function getSkillsByBranch(): Record<string, Skill[]> {
  const grouped: Record<string, Skill[]> = {};
  for (const skill of allSkills) {
    if (!grouped[skill.branch]) grouped[skill.branch] = [];
    grouped[skill.branch].push(skill);
  }
  return grouped;
}
