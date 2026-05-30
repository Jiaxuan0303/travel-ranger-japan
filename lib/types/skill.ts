export type SkillBranch = 'language' | 'transport' | 'food' | 'culture' | 'history';

export const SKILL_BRANCHES: SkillBranch[] = [
  'language',
  'transport',
  'food',
  'culture',
  'history',
];

export const SKILL_BRANCH_META: Record<
  SkillBranch,
  { name: string; icon: string; color: string }
> = {
  language:  { name: '实用日语', icon: '🗣️', color: 'from-blue-400 to-cyan-500' },
  transport: { name: '出行系统', icon: '🚃', color: 'from-green-400 to-emerald-500' },
  food:      { name: '饮食文化', icon: '🍣', color: 'from-orange-400 to-red-500' },
  culture:   { name: '礼仪传统', icon: '⛩️', color: 'from-purple-400 to-pink-500' },
  history:   { name: '战国幕府', icon: '⚔️', color: 'from-amber-400 to-yellow-600' },
};

export interface Skill {
  id: string;
  name: string;
  description: string;
  detail: string;
  branch: SkillBranch;
  tier: 1 | 2 | 3 | 4;
  cost: number;
  prerequisites: string[];
  cityId: string;
}

export interface SkillsState {
  unlocked: string[];
  points: number;
}
