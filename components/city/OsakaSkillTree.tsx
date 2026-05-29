'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkills, useCity } from '@/hooks/usePlayer';
import { SkillNodeGlow } from '@/components/animation/SkillNodeGlow';

interface OsakaSkill {
  id: string;
  globalId: string;
  name: string;
  icon: string;
  description: string;
  tier: number;
  prereq: string | null;
  cost: number;
  color: string;
}

const skills: OsakaSkill[] = [
  {
    id: 'food-explore', globalId: 'osaka-food-1',
    name: '街头小吃', icon: '🐙',
    description: '章鱼烧、大阪烧、串カツ——大阪B级美食全攻略。',
    tier: 1, prereq: null, cost: 1, color: '#f97316',
  },
  {
    id: 'night-life', globalId: 'osaka-language-1',
    name: '关西方言', icon: '🌙',
    description: '了解大阪腔：おおきに（谢谢）、なんでやねん（吐槽）。',
    tier: 2, prereq: 'food-explore', cost: 2, color: '#ec4899',
  },
  {
    id: 'street-culture', globalId: 'osaka-history-1',
    name: '战国风云', icon: '⚔️',
    description: '丰臣秀吉、织田信长——战国三杰的起落与大阪。',
    tier: 2, prereq: 'food-explore', cost: 2, color: '#06b6d4',
  },
  {
    id: 'social-talk', globalId: 'osaka-transport-1',
    name: '新干线体验', icon: '🚅',
    description: '学习新干线购票与乘坐流程，从东京到大阪只需2.5小时。',
    tier: 3, prereq: 'night-life', cost: 3, color: '#fbbf24',
  },
];

const edges = [
  { from: 'food-explore', to: 'night-life' },
  { from: 'food-explore', to: 'street-culture' },
  { from: 'night-life', to: 'social-talk' },
];

export function OsakaSkillTree() {
  const { skills: store, dispatch } = useSkills();
  const { progress } = useCity('osaka');
  const isUnlocked = progress?.unlocked ?? false;
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isLearned = (s: OsakaSkill) => store.unlocked.includes(s.globalId);

  const canUnlock = (s: OsakaSkill): boolean => {
    if (!isUnlocked) return false;
    if (store.unlocked.includes(s.globalId)) return false;
    if (store.points < s.cost) return false;
    if (s.prereq) {
      const pre = skills.find((x) => x.id === s.prereq);
      if (pre && !store.unlocked.includes(pre.globalId)) return false;
    }
    return true;
  };

  const handleUnlock = (s: OsakaSkill) => {
    if (!canUnlock(s)) return;
    dispatch({ type: 'SKILL_UNLOCK', skillId: s.globalId });
  };

  const getNodeCenter = (skillId: string) => {
    const s = skills.find((x) => x.id === skillId);
    if (!s) return null;
    const tierSkills = skills.filter((x) => x.tier === s.tier);
    const idx = tierSkills.findIndex((x) => x.id === skillId);
    const count = tierSkills.length;
    return { xPct: 52 + (idx / Math.max(1, count - 1)) * 48, yPx: s.tier * 108 };
  };

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">⭐</span>
        <h2 className="text-lg font-bold text-white tracking-wide" style={{ fontFamily: "'DotGothic16', monospace" }}>
          大阪技能树
        </h2>
        <span className="text-xs text-orange-400 ml-auto" style={{ fontFamily: "'DotGothic16', monospace" }}>
          SP: {store.points}
        </span>
      </div>

      <div className="relative bg-slate-900/60 border border-orange-800/20 rounded-2xl p-6 md:p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.3) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }} />

        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          {edges.map((edge) => {
            const from = getNodeCenter(edge.from);
            const to = getNodeCenter(edge.to);
            if (!from || !to) return null;
            const fromSkill = skills.find((s) => s.id === edge.from);
            const active = isLearned(skills.find((s) => s.id === edge.from)!) &&
                          isLearned(skills.find((s) => s.id === edge.to)!);
            return (
              <line key={`${edge.from}-${edge.to}`}
                x1={from.xPct + '%'} y1={from.yPx}
                x2={to.xPct + '%'} y2={to.yPx}
                stroke={active ? (fromSkill?.color ?? '#f97316') + '80' : 'rgba(100,80,60,0.15)'}
                strokeWidth={active ? 2 : 1}
                strokeDasharray={active ? 'none' : '4 4'} />
            );
          })}
        </svg>

        <div className="relative z-10 space-y-11">
          {[1, 2, 3].map((tier) => {
            const tierSkills = skills.filter((s) => s.tier === tier);
            return (
              <div key={tier} className="flex flex-wrap justify-center gap-4">
                {tierSkills.map((skill, i) => {
                  const unlocked = isLearned(skill);
                  const available = canUnlock(skill);
                  const isHovered = hoveredId === skill.id;
                  return (
                    <motion.div key={skill.id} className="relative"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: isUnlocked ? 1 : 0.4, scale: 1 }}
                      transition={{ delay: tier * 0.2 + i * 0.1 }}
                      onMouseEnter={() => setHoveredId(skill.id)}
                      onMouseLeave={() => setHoveredId(null)}>
                      <SkillNodeGlow unlocked={unlocked} available={available} color={skill.color}>
                        <motion.button
                          onClick={() => handleUnlock(skill)} disabled={!available}
                          whileHover={available ? { scale: 1.08 } : {}}
                          whileTap={available ? { scale: 0.95 } : {}}
                          className={`relative w-36 md:w-44 p-4 rounded-xl border text-center transition-all duration-300
                            ${unlocked ? 'bg-emerald-500/10 border-emerald-500/20 cursor-default'
                            : available ? 'bg-orange-500/10 border-orange-500/30 cursor-pointer hover:bg-orange-500/20'
                            : 'bg-slate-800/20 border-slate-700/10 cursor-not-allowed opacity-40'}`}
                          style={available ? { boxShadow: `0 0 12px ${skill.color}30` } : {}}>
                          <div className="text-2xl mb-1">{skill.icon}</div>
                          <div className="text-sm font-medium text-slate-200" style={{ fontFamily: "'DotGothic16', monospace" }}>{skill.name}</div>
                          <div className="text-[10px] mt-0.5" style={{ fontFamily: "'DotGothic16', monospace" }}>
                            {unlocked ? <span className="text-emerald-400">★ 已习得</span>
                            : !isUnlocked ? <span className="text-slate-600">城市锁定</span>
                            : available ? <span className="text-orange-400">{skill.cost} SP</span>
                            : <span className="text-slate-500">前置锁定</span>}
                          </div>
                        </motion.button>
                      </SkillNodeGlow>
                      <AnimatePresence>
                        {isHovered && isUnlocked && (
                          <motion.div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-900 border border-orange-700/40 rounded-lg p-3 z-50 pointer-events-none backdrop-blur-md"
                            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <p className="text-xs text-slate-300 leading-relaxed">{skill.description}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 mt-8 text-[10px]" style={{ fontFamily: "'DotGothic16', monospace" }}>
          <span className="text-slate-500"><span className="text-emerald-400">★</span> 已习得</span>
          <span className="text-slate-500"><span className="text-orange-400">★</span> 可解锁</span>
          <span className="text-slate-600">○ 锁定</span>
        </div>
      </div>
    </section>
  );
}
