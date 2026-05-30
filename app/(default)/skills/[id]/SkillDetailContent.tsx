'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { skillsById } from '@/data/skills';
import { useSkills } from '@/hooks/usePlayer';
import { canUnlockSkill } from '@/lib/engine';
import { SKILL_BRANCH_META } from '@/lib/types';
import { PageTransition } from '@/components/animation';

export function SkillDetailContent({ skillId }: { skillId: string }) {
  const router = useRouter();
  const { skills, dispatch } = useSkills();

  const skill = skillsById[skillId];
  const meta = skill ? SKILL_BRANCH_META[skill.branch] : null;
  const unlocked = skill ? skills.unlocked.includes(skill.id) : false;
  const canUnlock = skill ? canUnlockSkill(skill.id, skills) : false;

  const prereqNames = useMemo(() => {
    if (!skill) return [];
    return skill.prerequisites
      .map((pid) => skillsById[pid]?.name)
      .filter(Boolean);
  }, [skill]);

  if (!skill) {
    return (
      <PageTransition>
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg">技能不存在</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm"
          >
            ← 返回
          </button>
        </div>
      </PageTransition>
    );
  }

  const handleUnlock = () => {
    if (canUnlock) {
      dispatch({ type: 'SKILL_UNLOCK', skillId: skill.id });
    }
  };

  return (
    <PageTransition>
      <button
        onClick={() => router.back()}
        className="text-slate-500 hover:text-slate-300 text-sm mb-4 transition-colors"
      >
        ← 返回技能树
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{meta?.icon}</span>
          <span className={`text-xs font-medium bg-gradient-to-r ${meta?.color} bg-clip-text text-transparent`}>
            {meta?.name} · T{skill.tier}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">{skill.name}</h1>
        <p className="text-sm text-slate-400 mt-1">{skill.description}</p>
      </div>

      <div className="mb-6">
        {unlocked ? (
          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-sm">
            ✓ 已习得
          </span>
        ) : canUnlock ? (
          <span className="inline-flex items-center gap-1 text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full text-sm">
            ⭐ 可解锁 · 消耗 {skill.cost} SP
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-700/30 px-3 py-1 rounded-full text-sm">
            🔒 锁定 · 消耗 {skill.cost} SP
          </span>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 mb-6"
      >
        <h2 className="text-sm font-semibold text-slate-300 mb-3">详细科普</h2>
        <p className="text-sm text-slate-400 leading-relaxed">{skill.detail}</p>
      </motion.div>

      {prereqNames.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-medium text-slate-500 mb-2">前置技能</h3>
          <div className="flex flex-wrap gap-2">
            {prereqNames.map((name, i) => (
              <span
                key={i}
                className="text-xs text-slate-400 bg-slate-800/60 border border-slate-700/40 px-2 py-1 rounded-lg"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {!unlocked && (
        <motion.button
          whileHover={canUnlock ? { scale: 1.02 } : {}}
          whileTap={canUnlock ? { scale: 0.97 } : {}}
          onClick={handleUnlock}
          disabled={!canUnlock}
          className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${
            canUnlock
              ? 'bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          {canUnlock
            ? `解锁技能 · 消耗 ${skill.cost} SP`
            : '前置技能不足或技能点不够'}
        </motion.button>
      )}
    </PageTransition>
  );
}
