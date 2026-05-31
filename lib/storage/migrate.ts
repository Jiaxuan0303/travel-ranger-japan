import { cities } from '@/data/cities';
import { GameState } from '@/lib/store/types';
import { CityId, PlayerTitle } from '@/lib/types';
import { createInitialState } from '@/lib/store/gameReducer';
import { TOTAL_LEVELS_PER_CITY } from '@/data/levels';

export interface SaveData {
  version: number;
  state: unknown;
  savedAt: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function mergePlayer(
  base: GameState['player'],
  saved: unknown
): GameState['player'] {
  if (!isRecord(saved)) return base;
  return {
    ...base,
    level: typeof saved.level === 'number' ? saved.level : base.level,
    xp: typeof saved.xp === 'number' ? saved.xp : base.xp,
    title:
      typeof saved.title === 'string' ? (saved.title as PlayerTitle) : base.title,
    totalVideosWatched:
      typeof saved.totalVideosWatched === 'number'
        ? saved.totalVideosWatched
        : base.totalVideosWatched,
    joinDate: typeof saved.joinDate === 'string' ? saved.joinDate : base.joinDate,
  };
}

/** v1 jigsaw quest ID → v2 level mapping */
const QUEST_TO_LEVEL: Record<string, [CityId, number]> = {
  'quest-tokyo-7': ['tokyo' as CityId, 1],
  'quest-tokyo-8': ['tokyo' as CityId, 2],
  'quest-osaka-6': ['osaka' as CityId, 1],
  'quest-kyoto-7': ['kyoto' as CityId, 1],
  'quest-kamakura-5': ['kamakura' as CityId, 1],
};

function mergeCitiesV2(
  base: GameState['cities'],
  saved: unknown
): GameState['cities'] {
  if (!isRecord(saved)) return base;

  const next = { ...base };
  const savedCities = saved;

  for (const cityId of Object.keys(cities) as CityId[]) {
    const savedCity = savedCities[cityId];
    if (!isRecord(savedCity)) continue;

    next[cityId] = {
      ...next[cityId],
      unlocked:
        typeof savedCity.unlocked === 'boolean'
          ? savedCity.unlocked
          : next[cityId].unlocked,
      currentLevel: 1, // Start at level 1 in v2
      levels: {}, // Old quest progress maps via QUEST_TO_LEVEL below
    };
  }

  return next;
}

function mapQuestProgressToLevels(
  cities: GameState['cities'],
  savedQuests: unknown
): GameState['cities'] {
  if (!isRecord(savedQuests)) return cities;
  const completed = asStringArray(savedQuests.completed);

  for (const questId of completed) {
    const mapping = QUEST_TO_LEVEL[questId];
    if (!mapping) continue;
    const [cityId, levelNumber] = mapping;
    if (!cities[cityId]) continue;

    cities[cityId] = {
      ...cities[cityId],
      levels: {
        ...cities[cityId].levels,
        [levelNumber]: {
          completed: true,
          moves: 0, // Unknown from old save
          completedAt: null,
        },
      },
      // Advance currentLevel past completed level
      currentLevel: Math.max(
        cities[cityId].currentLevel,
        levelNumber + 1 > (TOTAL_LEVELS_PER_CITY[cityId] ?? 3)
          ? TOTAL_LEVELS_PER_CITY[cityId] ?? 3
          : levelNumber + 1
      ),
    };
  }

  return cities;
}

export function migrateSave(data: SaveData): GameState {
  const baseState = createInitialState();
  if (!isRecord(data.state)) return baseState;

  const state = data.state;

  // Player
  const player = mergePlayer(baseState.player, state.player);

  // Cities
  let migratedCities = mergeCitiesV2(baseState.cities, state.cities);

  // Map old quest completions to levels
  if (isRecord(state.quests || state)) {
    migratedCities = mapQuestProgressToLevels(migratedCities, state.quests || state);
  }

  // Re-evaluate city unlocks
  const unlockOrder: CityId[] = ['tokyo', 'osaka', 'kyoto', 'kamakura'];
  for (let i = 1; i < unlockOrder.length; i++) {
    const prev = unlockOrder[i - 1];
    const curr = unlockOrder[i];
    const prevHasCompleted = Object.values(migratedCities[prev]?.levels ?? {}).some(
      (l) => l.completed
    );
    if (prevHasCompleted && !migratedCities[curr]?.unlocked) {
      migratedCities[curr] = { ...migratedCities[curr], unlocked: true };
    }
  }

  return {
    player,
    cities: migratedCities,
    ui: baseState.ui,
  };
}
