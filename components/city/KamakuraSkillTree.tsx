'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkills, useCity } from '@/hooks/usePlayer';
import { SkillNodeGlow } from '@/components/animation/SkillNodeGlow';

interface KamakuraSkill {
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

const skills: KamakuraSkill[] = [
  {
    id: 'seaside-explore', globalId: 'kamakura-transport-1',
    name: '江之电之旅', icon: '🚃',
    description: '乘坐百年江之电，穿梭于海街与古都之间。',
    tier: 1, prereq: null, cost: 1, color: '#38bdf8',
  },
  {
    id: 'youth-photo', globalId: 'kamakura-culture-1',
    name: '禅宗冥想', icon: '🧘',
    description: '在镰仓的禅寺中体验坐禅，感受武士的精神修行。',
    tier: 2, prereq: 'seaside-explore', cost: 2, color: '#0ea5e9',
  },
  {
    id: 'train-travel', globalId: 'kamakura-history-1',
    name: '镰仓幕府', icon: '🏯',
    description: '源赖朝与武士政权的诞生——日本历史的转折点。',
    tier: 2, prereq: 'seaside-explore', cost: 2, color: '#06b6d4',
  },
  {
    id: 'summer-culture', globalId: 'kyoto-food-2',
    name: '清酒入门', icon: '🍶',
    description: '认识清酒的种类、等级与饮用礼仪。',
    tier: 3, prereq: 'youth-photo', cost: 3, color: '#14b8a6',
  },
];

const edges = [
  { from: 'seaside-explore', to: 'youth-photo' },
  { from: 'seaside-explore', to: 'train-travel' },
  { from: 'youth-photo', to: 'summer-culture' },
];

export function KamakuraSkillTree() {
  const { skills: store, dispatch } = useSkills();
  const { progress } = useCity('kamakura');
  const isUnlocked = progress?.unlocked ?? false;
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isLearned = (s: KamakuraSkill) => store.unlocked.includes(s.globalId);

  const canUnlock = (s: KamakuraSkill): boolean => {
    if (!isUnlocked) return false;
    if (store.unlocked.includes(s.globalId)) return false;
    if (store.points < s.cost) return false;
    if (s.prereq) {
      const pre = skills.find((x) => x.id === s.prereq);
      if (pre && !store.unlocked.includes(pre.globalId)) return false;
    }
    return true;
  };

  const handleUnlock = (s: KamakuraSkill) => {
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
          镰仓技能树
        </h2>
        <span className="text-xs text-sky-400 ml-auto" style={{ fontFamily: "'DotGothic16', monospace" }}>
          SP: {store.points}
        </span>
      </div>

      <div className="relative bg-sky-950/10 border border-sky-800/20 rounded-2xl p-6 md:p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(56,189,248,0.3) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          {edges.map((edge) => {
            const from = getNodeCenter(edge.from);
            const to = getNodeCenter(edge.to);
            if (!from || !to) return null;
            const active = isLearned(skills.find((s) => s.id === edge.from)!) &&
                          isLearned(skills.find((s) => s.id === edge.to)!);
            return (
              <line key={`${edge.from}-${edge.to}`}
                x1={from.xPct + '%'} y1={from.yPx}
                x2={to.xPct + '%'} y2={to.yPx}
                stroke={active ? 'rgba(56,189,248,0.4)' : 'rgba(56,189,248,0.12)'}
                strokeWidth={active ? 1.5 : 1}
                strokeDasharray={active ? 'none' : '3 3'} />
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
                          className={`relative w-36 md:w-44 p-4 rounded-xl border text-center transition-all duration-500
                            ${unlocked ? 'bg-emerald-500/10 border-emerald-500/20 cursor-default'
                            : available ? 'bg-sky-500/10 border-sky-500/20 cursor-pointer hover:bg-sky-500/20'
                            : 'bg-slate-800/20 border-slate-700/10 cursor-not-allowed opacity-40'}`}
                          style={available ? { boxShadow: '0 0 12px rgba(56,189,248,0.15)' } : {}}>
                          <div className="text-2xl mb-1">{skill.icon}</div>
                          <div className="text-sm font-medium text-slate-200" style={{ fontFamily: "'DotGothic16', monospace" }}>{skill.name}</div>
                          <div className="text-[10px] mt-0.5" style={{ fontFamily: "'DotGothic16', monospace" }}>
                            {unlocked ? <span className="text-emerald-400">★ 已习得</span>
                            : !isUnlocked ? <span className="text-slate-600">城市锁定</span>
                            : available ? <span className="text-sky-400">{skill.cost} SP</span>
                            : <span className="text-slate-500">前置锁定</span>}
                          </div>
                        </motion.button>
                      </SkillNodeGlow>
                      <AnimatePresence>
                        {isHovered && isUnlocked && (
                          <motion.div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-sky-950/90 border border-sky-700/30 rounded-lg p-3 z-50 pointer-events-none backdrop-blur-md"
                            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <p className="text-xs text-sky-200/80 leading-relaxed">{skill.description}</p>
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
          <span className="text-slate-500"><span className="text-sky-400">★</span> 可解锁</span>
          <span className="text-slate-600">○ 锁定</span>
        </div>
      </div>
    </section>
  );
}
