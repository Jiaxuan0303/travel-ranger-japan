'use client';

import { SKILL_BRANCHES, SKILL_BRANCH_META, SkillBranch } from '@/lib/types';
import { SkillNode } from './SkillNode';
import { getSkillsByBranch } from '@/lib/engine';
import { useSkills } from '@/hooks/usePlayer';

export function SkillTree() {
  const { skills } = useSkills();
  const grouped = getSkillsByBranch();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-100">技能树</h2>
        <span className="text-sm text-amber-400 font-medium">
          ⭐ {skills.points} 可用技能点
        </span>
      </div>

      {SKILL_BRANCHES.map((branch) => {
        const meta = SKILL_BRANCH_META[branch];
        const branchSkills = grouped[branch] ?? [];

        return (
          <div key={branch} className="space-y-2">
            <div className="flex items-center gap-2">
              <span>{meta.icon}</span>
              <span className={`text-sm font-semibold bg-gradient-to-r ${meta.color} bg-clip-text text-transparent`}>
                {meta.name}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {branchSkills.map((skill) => (
                <SkillNode key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
