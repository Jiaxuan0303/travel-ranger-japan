'use client';

import { motion } from 'framer-motion';
import { LevelDefinition, CityLevelState } from '@/lib/types';

interface LevelGridProps {
  levels: LevelDefinition[];
  cityState: CityLevelState;
  selectedLevel: number | null;
  onSelectLevel: (levelNumber: number) => void;
}

const difficultyLabels: Record<number, { label: string; color: string }> = {
  3: { label: '简单', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  5: { label: '中等', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  10: { label: '困难', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const gridSizeLabels: Record<number, string> = {
  3: '3×3',
  5: '5×5',
  10: '10×10',
};

export function LevelGrid({
  levels,
  cityState,
  selectedLevel,
  onSelectLevel,
}: LevelGridProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-100">关卡</h2>
        <span className="text-xs text-slate-500">
          {Object.values(cityState.levels).filter((l) => l.completed).length} / {levels.length} 完成
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {levels.map((level, index) => {
          const progress = cityState.levels[level.levelNumber];
          const isCompleted = progress?.completed ?? false;
          const isCurrent = cityState.currentLevel === level.levelNumber;
          const isLocked = level.levelNumber > cityState.currentLevel;
          const isSelected = selectedLevel === level.levelNumber;
          const diff = difficultyLabels[level.gridSize] ?? difficultyLabels[5];

          return (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.3 }}
              onClick={() => !isLocked && onSelectLevel(level.levelNumber)}
              disabled={isLocked}
              className={`relative rounded-2xl border p-4 text-left transition-all ${
                isLocked
                  ? 'border-slate-800/50 bg-slate-900/30 opacity-50 cursor-not-allowed'
                  : isSelected
                  ? 'border-indigo-500/60 bg-indigo-500/10 ring-1 ring-indigo-500/40 cursor-default'
                  : isCompleted
                  ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer'
                  : isCurrent
                  ? 'border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer animate-pulse'
                  : 'border-slate-700/60 bg-slate-900/40 hover:bg-slate-800/40 cursor-pointer'
              }`}
            >
              {/* Status icon */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-500">
                  LEVEL {level.levelNumber}
                </span>
                {isCompleted ? (
                  <span className="text-emerald-400 text-lg">✓</span>
                ) : isLocked ? (
                  <span className="text-slate-600 text-lg">🔒</span>
                ) : isCurrent ? (
                  <span className="text-amber-400 text-lg">▶</span>
                ) : null}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-slate-100 text-sm mb-1">
                {level.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                {level.description}
              </p>

              {/* Badges */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${diff.color}`}
                >
                  {gridSizeLabels[level.gridSize]} {diff.label}
                </span>
                {isCompleted && progress?.moves > 0 && (
                  <span className="text-[10px] text-slate-500">
                    {progress.moves} 步完成
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
