'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkills, usePlayer } from '@/hooks/usePlayer';
import { SkillNodeGlow } from '@/components/animation/SkillNodeGlow';

interface TokyoSkill {
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

const skills: TokyoSkill[] = [
  {
    id: 'city-explore', globalId: 'tokyo-transport-1',
    name: 'IC卡入门', icon: '💳',
    description: '了解Suica/Pasmo的使用方法，刷遍东京地铁。',
    tier: 1, prereq: null, cost: 1,
    color: '#8b5cf6',
  },
  {
    id: 'metro-survival', globalId: 'tokyo-transport-2',
    name: '山手线攻略', icon: '🚃',
    description: '掌握山手线29站，东京核心交通动脉了然于胸。',
    tier: 2, prereq: 'city-explore', cost: 2,
    color: '#06b6d4',
  },
  {
    id: 'photo-eye', globalId: 'tokyo-culture-1',
    name: '神社参拜', icon: '⛩️',
    description: '学习手水之仪、二礼二拍一礼，正确参拜神社。',
    tier: 2, prereq: 'city-explore', cost: 2,
    color: '#ec4899',
  },
  {
    id: 'anime-culture', globalId: 'tokyo-food-1',
    name: '拉面品鉴', icon: '🍜',
    description: '从一兰到面屋武藏，学会分辨拉面流派与吃法。',
    tier: 3, prereq: 'photo-eye', cost: 3,
    color: '#f97316',
  },
  {
    id: 'food-master', globalId: 'tokyo-language-2',
    name: '餐厅点餐', icon: '🗣️',
    description: '用日语点餐，不再对着菜单比手画脚。',
    tier: 3, prereq: 'metro-survival', cost: 3,
    color: '#fbbf24',
  },
];

const edges = [
  { from: 'city-explore', to: 'metro-survival' },
  { from: 'city-explore', to: 'photo-eye' },
  { from: 'photo-eye', to: 'anime-culture' },
  { from: 'metro-survival', to: 'food-master' },
];

export function TokyoSkillTree() {
  const { skills: store, dispatch } = useSkills();
  const { player } = usePlayer();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isLearned = (s: TokyoSkill) => store.unlocked.includes(s.globalId);

  const canUnlock = (s: TokyoSkill): boolean => {
    if (store.unlocked.includes(s.globalId)) return false;
    if (store.points < s.cost) return false;
    if (s.prereq) {
      const pre = skills.find((x) => x.id === s.prereq);
      if (pre && !store.unlocked.includes(pre.globalId)) return false;
    }
    return true;
  };

  const handleUnlock = (s: TokyoSkill) => {
    if (!canUnlock(s)) return;
    dispatch({ type: 'SKILL_UNLOCK', skillId: s.globalId });
  };

  // Compute SVG line positions from known layout
  const getNodeCenter = (skillId: string) => {
    const s = skills.find((x) => x.id === skillId);
    if (!s) return null;
    const tierSkills = skills.filter((x) => x.tier === s.tier);
    const idx = tierSkills.findIndex((x) => x.id === skillId);
    const count = tierSkills.length;
    const tier = s.tier;
    // tier spacing: each tier is ~100px apart vertically
    const y = tier * 108;
    // nodes spread 200px apart, center offset based on position
    const x = 52 + (idx / Math.max(1, count - 1)) * 48;
    return { x: `${x}%`, y: `${y}px`, xPct: x, yPx: y };
  };

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">⭐</span>
        <h2 className="text-lg font-bold text-white tracking-wide" style={{ fontFamily: "'DotGothic16', monospace" }}>
          东京技能树
        </h2>
        <span className="text-xs text-amber-400 ml-auto" style={{ fontFamily: "'DotGothic16', monospace" }}>
          SP: {store.points}
        </span>
      </div>

      <div className="relative bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6 md:p-8 overflow-hidden">
        {/* Background dots */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.3) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        {/* SVG edge lines with real coordinates */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          {edges.map((edge) => {
            const from = getNodeCenter(edge.from);
            const to = getNodeCenter(edge.to);
            if (!from || !to) return null;
            const active = isLearned(skills.find((s) => s.id === edge.from)!) &&
                          isLearned(skills.find((s) => s.id === edge.to)!);
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.xPct + '%'}
                y1={from.yPx}
                x2={to.xPct + '%'}
                y2={to.yPx}
                stroke={active ? 'rgba(139,92,246,0.5)' : 'rgba(100,116,139,0.15)'}
                strokeWidth={active ? 2 : 1}
                strokeDasharray={active ? 'none' : '4 4'}
              />
            );
          })}
        </svg>

        {/* Skill tiers */}
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
                    <motion.div
                      key={skill.id}
                      className="relative"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: tier * 0.2 + i * 0.1 }}
                      onMouseEnter={() => setHoveredId(skill.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <SkillNodeGlow unlocked={unlocked} available={available} color={skill.color}>
                        <motion.button
                          onClick={() => handleUnlock(skill)}
                          disabled={!available}
                          whileHover={available ? { scale: 1.08 } : {}}
                          whileTap={available ? { scale: 0.95 } : {}}
                          className={`
                            relative w-36 md:w-44 p-4 rounded-xl border text-center transition-all duration-300
                            ${unlocked
                              ? 'bg-emerald-500/10 border-emerald-500/30 cursor-default'
                              : available
                              ? 'bg-indigo-500/10 border-indigo-500/30 cursor-pointer hover:bg-indigo-500/20'
                              : 'bg-slate-800/20 border-slate-700/10 cursor-not-allowed opacity-40'
                            }
                          `}
                          style={available ? { boxShadow: `0 0 12px ${skill.color}20` } : {}}
                        >
                          <div className="text-2xl mb-1">{skill.icon}</div>
                          <div className="text-sm font-medium text-slate-200" style={{ fontFamily: "'DotGothic16', monospace" }}>
                            {skill.name}
                          </div>
                          <div className="text-[10px] mt-0.5" style={{ fontFamily: "'DotGothic16', monospace" }}>
                            {unlocked ? (
                              <span className="text-emerald-400">★ 已习得</span>
                            ) : available ? (
                              <span className="text-amber-400">{skill.cost} SP</span>
                            ) : skill.prereq && !skills.find((x) => x.id === skill.prereq && isLearned(x)) ? (
                              <span className="text-slate-500">前置锁定</span>
                            ) : (
                              <span className="text-slate-500">SP不足</span>
                            )}
                          </div>
                        </motion.button>
                      </SkillNodeGlow>

                      {/* Tooltip */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-800 border border-slate-600 rounded-lg p-3 z-50 pointer-events-none"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                          >
                            <p className="text-xs text-slate-300 leading-relaxed">{skill.description}</p>
                            {!unlocked && <p className="text-[10px] text-slate-500 mt-1">消耗 {skill.cost} SP</p>}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800" />
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
          <span className="text-slate-500"><span className="text-amber-400">★</span> 可解锁</span>
          <span className="text-slate-600">○ 锁定</span>
        </div>
      </div>
    </section>
  );
}
