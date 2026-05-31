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
    canUnlock: canUnlockCity(cityId, state.cities),
    unlockHint: getCityUnlockHint(cityId, state.cities),
    dispatch,
  };
}

export function useUI() {
  const { state, dispatch } = useGame();
  return { ui: state.ui, dispatch };
}
