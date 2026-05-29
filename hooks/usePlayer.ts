'use client';

import { useGame } from '@/lib/store';
import { CityId } from '@/lib/types';
import { canUnlockCity, getCityUnlockHint } from '@/lib/engine';
import { cities } from '@/data/cities';

export function usePlayer() {
  const { state, dispatch } = useGame();
  return { player: state.player, dispatch };
}

export function useCity(cityId: CityId) {
  const { state, dispatch } = useGame();
  const cityData = cities[cityId];
  const progress = state.cities[cityId];

  if (!cityData || !progress) {
    return { city: undefined, progress: undefined, canUnlock: false, unlockHint: null, dispatch };
  }

  return {
    city: cityData,
    progress,
    canUnlock: canUnlockCity(cityData, state.player, state.skills, state.cities),
    unlockHint: getCityUnlockHint(cityData, state.player, state.skills, state.cities),
    dispatch,
  };
}

export function useSkills() {
  const { state, dispatch } = useGame();
  return { skills: state.skills, player: state.player, dispatch };
}

export function useQuests(cityId?: CityId) {
  const { state, dispatch } = useGame();
  return { quests: state.quests, player: state.player, dispatch, cityId };
}

export function useUI() {
  const { state, dispatch } = useGame();
  return { ui: state.ui, dispatch };
}
