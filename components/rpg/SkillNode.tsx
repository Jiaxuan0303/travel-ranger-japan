'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Skill } from '@/lib/types';
import { canUnlockSkill } from '@/lib/engine';
import { useSkills } from '@/hooks/usePlayer';

interface SkillNodeProps {
  skill: Skill;
}

export function SkillNode({ skill }: SkillNodeProps) {
  const router = useRouter();
  const { skills } = useSkills();
  const unlocked = skills.unlocked.includes(skill.id);
  const canUnlock = canUnlockSkill(skill.id, skills);

  const handleClick = () => {
    router.push(`/skills/${skill.id}`);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={`
        relative w-full rounded-xl border p-3 text-left transition-colors duration-300 cursor-pointer
        ${unlocked
          ? 'border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-500/60'
          : canUnlock
          ? 'border-indigo-500/40 bg-indigo-500/10 hover:border-indigo-500/70'
          : 'border-slate-700/40 bg-slate-800/30 hover:border-slate-600/50'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-200">{skill.name}</div>
          <div className="text-xs text-slate-500 mt-0.5">{skill.description}</div>
        </div>
        <div className="flex flex-col items-end ml-2 shrink-0">
          {unlocked ? (
            <span className="text-emerald-400 text-xs">✓ 已习得</span>
          ) : (
            <span className="text-xs text-slate-500">{skill.cost} SP</span>
          )}
          <span className="text-xs text-slate-600 mt-0.5">T{skill.tier}</span>
        </div>
      </div>

      {unlocked && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-emerald-400/5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.button>
  );
}
