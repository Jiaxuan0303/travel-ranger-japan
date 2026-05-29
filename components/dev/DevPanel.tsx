'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/store';
import { MOCK_MID_LEVEL, MOCK_HIGH_LEVEL, applyMockData } from '@/lib/engine/mockData';
import { CityId, CITY_IDS } from '@/lib/types';

export function DevPanel() {
  const { state, dispatch } = useGame();
  const [open, setOpen] = useState(false);

  const handleAddXP = (amount: number) => {
    dispatch({ type: 'XP_GAIN', amount });
  };

  const handleUnlockSkill = (skillId: string) => {
    dispatch({ type: 'SKILL_UNLOCK', skillId });
  };

  const handleUnlockCity = (cityId: CityId) => {
    dispatch({ type: 'CITY_UNLOCK', cityId });
  };

  const handleLoadMock = (level: 'mid' | 'high') => {
    const mock = level === 'mid' ? MOCK_MID_LEVEL : MOCK_HIGH_LEVEL;
    const newState = applyMockData(state, mock);
    dispatch({ type: 'LOAD_SAVE', state: newState });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 z-50 w-10 h-10 rounded-full bg-slate-800 border border-slate-600 text-slate-400 text-xs hover:text-white hover:border-slate-500 transition-colors flex items-center justify-center"
        title="Dev Panel"
      >
        🔧
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center pb-24 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto bg-slate-900 border border-slate-700 rounded-2xl p-4 max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-300">🛠 Dev Panel</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-500 hover:text-white text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Current State */}
              <div className="bg-slate-800 rounded-lg p-3 mb-3 text-xs font-mono text-slate-400 space-y-0.5">
                <div>Lv.{state.player.level} | XP:{state.player.xp} | SP:{state.skills.points}</div>
                <div>城市: {CITY_IDS.filter(c => state.cities[c]?.unlocked).join(', ') || '仅东京'}</div>
                <div>技能: {state.skills.unlocked.length}个</div>
              </div>

              {/* Quick SP */}
              <div className="mb-3">
                <div className="text-[10px] text-slate-500 mb-1">SP 点数</div>
                <button
                  onClick={() => dispatch({ type: 'SET_SKILL_POINTS', amount: 999 })}
                  className="px-2 py-1 text-[10px] rounded bg-amber-600/30 border border-amber-500/30 text-amber-300 hover:bg-amber-600/50 transition-colors"
                >
                  SP = 999
                </button>
              </div>

              {/* Quick XP */}
              <div className="mb-3">
                <div className="text-[10px] text-slate-500 mb-1">EXP 注入</div>
                <div className="flex gap-1.5 flex-wrap">
                  {[50, 100, 200, 500, 1000, 5000].map((n) => (
                    <button
                      key={n}
                      onClick={() => handleAddXP(n)}
                      className="px-2 py-1 text-[10px] rounded bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/50 transition-colors"
                    >
                      +{n}
                    </button>
                  ))}
                </div>
              </div>

              {/* City Unlock */}
              <div className="mb-3">
                <div className="text-[10px] text-slate-500 mb-1">城市解锁</div>
                <div className="flex gap-1.5">
                  {CITY_IDS.filter(c => !state.cities[c]?.unlocked).map((cid) => (
                    <button
                      key={cid}
                      onClick={() => handleUnlockCity(cid)}
                      className="px-2 py-1 text-[10px] rounded bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/50 transition-colors"
                    >
                      解锁{cid}
                    </button>
                  ))}
                  {CITY_IDS.filter(c => !state.cities[c]?.unlocked).length === 0 && (
                    <span className="text-[10px] text-slate-600">全部已解锁</span>
                  )}
                </div>
              </div>

              {/* Mock Presets */}
              <div className="mb-3">
                <div className="text-[10px] text-slate-500 mb-1">快速预设</div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleLoadMock('mid')}
                    className="px-2 py-1 text-[10px] rounded bg-amber-600/30 border border-amber-500/30 text-amber-300 hover:bg-amber-600/50 transition-colors"
                  >
                    Lv.6 中级
                  </button>
                  <button
                    onClick={() => handleLoadMock('high')}
                    className="px-2 py-1 text-[10px] rounded bg-purple-600/30 border border-purple-500/30 text-purple-300 hover:bg-purple-600/50 transition-colors"
                  >
                    Lv.16 高级
                  </button>
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={handleReset}
                className="w-full py-1.5 text-[10px] rounded bg-red-600/20 border border-red-500/20 text-red-400 hover:bg-red-600/40 transition-colors"
              >
                重置游戏
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
