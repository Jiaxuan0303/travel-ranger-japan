/**
 * Mock / Seed 数据 — 用于快速测试各种游戏状态
 * 在 GameProvider 初始化时注入，或通过 DevPanel 注入
 */
import { GameState } from '@/lib/store/types';
import { CityId, PlayerTitle } from '@/lib/types';

export const MOCK_LOW_LEVEL: Partial<GameState> = {
  player: {
    level: 2,
    xp: 120,
    skillPoints: 2,
    title: '见习游侠',
    totalVideosWatched: 1,
    joinDate: new Date().toISOString(),
  },
};

/** 中级玩家：Level 6，解锁了东京+大阪，有一些技能 */
export const MOCK_MID_LEVEL: Partial<GameState> = {
  player: {
    level: 6,
    xp: 650,
    skillPoints: 4,
    title: '初级游侠',
    totalVideosWatched: 8,
    joinDate: new Date().toISOString(),
  },
  cities: {
    tokyo: {
      cityId: 'tokyo',
      unlocked: true,
      completionPercent: 50,
      questsCompleted: ['quest-tokyo-1', 'quest-tokyo-2', 'quest-tokyo-3'],
      landmarksVisited: [],
    },
    osaka: {
      cityId: 'osaka',
      unlocked: true,
      completionPercent: 20,
      questsCompleted: ['quest-osaka-1'],
      landmarksVisited: [],
    },
    kyoto: {
      cityId: 'kyoto',
      unlocked: false,
      completionPercent: 0,
      questsCompleted: [],
      landmarksVisited: [],
    },
    kamakura: {
      cityId: 'kamakura',
      unlocked: false,
      completionPercent: 0,
      questsCompleted: [],
      landmarksVisited: [],
    },
  },
  skills: {
    unlocked: ['tokyo-language-1', 'tokyo-transport-1', 'tokyo-food-1'],
    points: 4,
  },
};

/** 高级玩家：Level 16，四城全解锁，技能树点满 */
export const MOCK_HIGH_LEVEL: Partial<GameState> = {
  player: {
    level: 16,
    xp: 3200,
    skillPoints: 6,
    title: '资深游侠',
    totalVideosWatched: 18,
    joinDate: new Date().toISOString(),
  },
  cities: {
    tokyo: {
      cityId: 'tokyo' as CityId,
      unlocked: true,
      completionPercent: 100,
      questsCompleted: [
        'quest-tokyo-1', 'quest-tokyo-2', 'quest-tokyo-3',
        'quest-tokyo-4', 'quest-tokyo-5', 'quest-tokyo-6',
      ],
      landmarksVisited: [],
    },
    osaka: {
      cityId: 'osaka' as CityId,
      unlocked: true,
      completionPercent: 80,
      questsCompleted: ['quest-osaka-1', 'quest-osaka-2', 'quest-osaka-3', 'quest-osaka-4'],
      landmarksVisited: [],
    },
    kyoto: {
      cityId: 'kyoto' as CityId,
      unlocked: true,
      completionPercent: 33,
      questsCompleted: ['quest-kyoto-1', 'quest-kyoto-2'],
      landmarksVisited: [],
    },
    kamakura: {
      cityId: 'kamakura' as CityId,
      unlocked: true,
      completionPercent: 0,
      questsCompleted: [],
      landmarksVisited: [],
    },
  },
  skills: {
    unlocked: [
      'tokyo-language-1', 'tokyo-language-2',
      'tokyo-transport-1', 'tokyo-transport-2',
      'tokyo-food-1', 'tokyo-culture-1', 'tokyo-history-1',
      'osaka-food-1', 'osaka-language-1', 'osaka-history-1', 'osaka-transport-1',
      'kyoto-culture-1', 'kyoto-food-1', 'kyoto-history-1', 'kyoto-culture-2',
      'kamakura-transport-1', 'kamakura-culture-1', 'kamakura-history-1',
    ],
    points: 6,
  },
};

/** 从当前 state 合并 mock 数据 */
export function applyMockData(
  baseState: GameState,
  mock: Partial<GameState>
): GameState {
  return {
    ...baseState,
    ...mock,
    player: { ...baseState.player, ...mock.player },
    cities: { ...baseState.cities, ...mock.cities },
    skills: { ...baseState.skills, ...mock.skills },
  };
}
