'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/store/GameProvider';
import { CityId, LevelDefinition, JigsawPuzzleGame } from '@/lib/types';
import { cities } from '@/data/cities';
import { levelsByCity } from '@/data/levels';
import { CityHero } from './CityHero';
import { CulturalPopup } from './CulturalPopup';
import { JigsawGame } from '@/components/minigames/JigsawGame';
import type { MiniGameResult } from '@/components/minigames/MiniGameRenderer';

/** 城市解锁顺序 */
const CITY_ORDER: CityId[] = ['tokyo', 'osaka', 'kyoto', 'kamakura'];

interface CityPageContentProps {
  cityId: CityId;
}

export function CityPageContent({ cityId }: CityPageContentProps) {
  const { state, dispatch } = useGame();
  const router = useRouter();
  const cityData = cities[cityId];
  const cityState = state.cities[cityId];
  const levels = levelsByCity[cityId] ?? [];
  const level = levels[0]; // 每个城市只有一个关卡
  const isUnlocked = cityState?.unlocked ?? false;
  const isCompleted = level ? cityState?.levels[level.levelNumber]?.completed ?? false : false;

  const [playing, setPlaying] = useState(false);

  // 计算下一个城市
  const { nextCityId, nextCityName } = useMemo(() => {
    const idx = CITY_ORDER.indexOf(cityId);
    if (idx >= 0 && idx < CITY_ORDER.length - 1) {
      const nextId = CITY_ORDER[idx + 1];
      return { nextCityId: nextId, nextCityName: cities[nextId]?.name ?? undefined };
    }
    return { nextCityId: null as CityId | null, nextCityName: undefined as string | undefined };
  }, [cityId]);

  const handleStart = useCallback(() => {
    if (level) setPlaying(true);
  }, [level]);

  const handlePuzzleComplete = useCallback(
    (result: MiniGameResult) => {
      if (!level) return;
      dispatch({
        type: 'LEVEL_COMPLETE',
        cityId,
        levelNumber: level.levelNumber,
        moves: result.moves ?? 0,
      });
    },
    [dispatch, cityId, level]
  );

  // 完成拼图后前往下一个城市
  const handleNextCity = useCallback(() => {
    dispatch({ type: 'DISMISS_CULTURAL_POPUP' });
    setPlaying(false);
    if (nextCityId) {
      router.push(`/cities/${nextCityId}`);
    }
  }, [dispatch, nextCityId, router]);

  // 返回当前城市（重新挑战）
  const handleDismissPopup = useCallback(() => {
    dispatch({ type: 'DISMISS_CULTURAL_POPUP' });
    setPlaying(false);
  }, [dispatch]);

  // 拼图界面（全屏）
  if (playing && level) {
    const puzzleGame: JigsawPuzzleGame = {
      type: 'jigsaw' as const,
      instruction: level.instruction,
      imageUrl: level.imageUrl,
      gridSize: level.gridSize,
    };

    return (
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <motion.div className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            onClick={() => setPlaying(false)}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <span>←</span> 返回
          </button>
        </motion.div>

        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-100">{level.title}</h2>
          <p className="text-sm text-slate-400">{level.description}</p>
        </div>

        <JigsawGame game={puzzleGame} onComplete={handlePuzzleComplete} onReturn={() => setPlaying(false)} />

        <CulturalPopup
          open={state.ui.showCulturalPopup}
          culturalInfo={state.ui.culturalPopupData}
          cityId={state.ui.popupCityId}
          levelNumber={state.ui.popupLevelNumber}
          hasNextLevel={!!nextCityId}
          nextCityName={nextCityName}
          onNextLevel={handleNextCity}
          onBackToCity={handleDismissPopup}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6">
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <a
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-slate-300"
        >
          <span>←</span> 返回首页
        </a>
      </motion.div>

      <CityHero cityId={cityId} />

      {!isUnlocked && (
        <motion.div
          className="mb-8 rounded-xl border border-slate-700/30 bg-slate-900/35 p-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-lg mb-2">🔒</p>
          <p className="text-sm text-slate-400">
            需要先完成前一城市的拼图挑战才能解锁{cityData?.name ?? '此城市'}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            已解锁：{Object.values(state.cities).filter(c => c.unlocked).map(c => cities[c.cityId]?.name).join(' → ')}
          </p>
        </motion.div>
      )}

      {isUnlocked && (
        <motion.div
          className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isCompleted ? (
            <>
              <p className="text-2xl mb-2">✅</p>
              <h2 className="text-lg font-bold text-emerald-400 mb-1">挑战完成</h2>
              <p className="text-sm text-slate-400 mb-4">
                你已完成{level?.title ?? cityData?.name}的拼图挑战
              </p>
              <button
                onClick={handleStart}
                className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-2.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
              >
                再次挑战
              </button>
            </>
          ) : (
            <>
              <p className="text-3xl mb-3">🧩</p>
              <h2 className="text-xl font-bold text-slate-100 mb-2">
                {level?.title ?? cityData?.name}
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                {level?.description ?? '将图片拼回完整的画面'}
              </p>
              <button
                onClick={handleStart}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-8 py-3 text-sm font-semibold text-white transition-colors shadow-lg shadow-indigo-500/25"
              >
                开始挑战
              </button>
            </>
          )}
        </motion.div>
      )}

      <div className="h-12" />
    </div>
  );
}
