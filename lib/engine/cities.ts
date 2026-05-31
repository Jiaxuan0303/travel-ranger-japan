import { CityId, CityLevelState } from '@/lib/types';

/** Check if a city can be unlocked — previous city must have at least 1 completed level */
export function canUnlockCity(
  cityId: CityId,
  cityStates: Record<CityId, CityLevelState>
): boolean {
  const unlockOrder: CityId[] = ['tokyo', 'osaka', 'kyoto', 'kamakura'];
  const idx = unlockOrder.indexOf(cityId);
  if (idx <= 0) return true; // Tokyo always unlocked
  const prevCityId = unlockOrder[idx - 1];
  const prevCity = cityStates[prevCityId];
  if (!prevCity?.unlocked) return false;
  return Object.values(prevCity.levels).some((l) => l.completed);
}

/** Get a human-readable unlock hint */
export function getCityUnlockHint(
  cityId: CityId,
  cityStates: Record<CityId, CityLevelState>
): string | null {
  const unlockOrder: CityId[] = ['tokyo', 'osaka', 'kyoto', 'kamakura'];
  const idx = unlockOrder.indexOf(cityId);
  if (idx <= 0) return null;
  const prevCityId = unlockOrder[idx - 1];
  if (!cityStates[prevCityId]?.unlocked) {
    const prevNames: Record<string, string> = { osaka: '大阪', kyoto: '京都', kamakura: '镰仓' };
    const prevName = prevNames[prevCityId] ?? prevCityId;
    return `需要先解锁${prevName}`;
  }
  return '完成前一城市的任意一关即可解锁';
}
