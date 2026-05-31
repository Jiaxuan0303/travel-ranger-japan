import { GameState, GameAction } from './types';
import { calcLevelUp } from '@/lib/engine';
import { cities } from '@/data/cities';
import { levelsById, levelsByCity, TOTAL_LEVELS_PER_CITY } from '@/data/levels';
import { GAME_CONSTANTS } from '@/data/constants';
import { CityId, CityLevelState, LevelProgress, getTitleForLevel } from '@/lib/types';

function createCityState(cityId: CityId, unlocked: boolean): CityLevelState {
  return {
    cityId,
    unlocked,
    currentLevel: 1,
    levels: {},
  };
}

export function createInitialState(): GameState {
  const initialCities = {} as Record<CityId, CityLevelState>;
  initialCities['tokyo' as CityId] = createCityState('tokyo' as CityId, true);
  for (const cid of ['osaka', 'kyoto', 'kamakura'] as CityId[]) {
    initialCities[cid] = createCityState(cid, false);
  }

  return {
    player: {
      level: 1,
      xp: 0,
      title: '见习游侠',
      totalVideosWatched: 0,
      joinDate: new Date().toISOString(),
    },
    cities: initialCities,
    ui: {
      showLevelUp: false,
      levelsGained: 0,
      showCulturalPopup: false,
      culturalPopupData: null,
      popupCityId: null,
      popupLevelNumber: null,
    },
  };
}

/** 城市解锁条件：前一个城市至少完成1关 */
function canUnlockCitySimple(
  cityId: CityId,
  citiesState: Record<CityId, CityLevelState>
): boolean {
  const unlockOrder: CityId[] = ['tokyo', 'osaka', 'kyoto', 'kamakura'];
  const idx = unlockOrder.indexOf(cityId);
  if (idx <= 0) return true; // Tokyo is always unlocked
  const prevCityId = unlockOrder[idx - 1];
  const prevCity = citiesState[prevCityId];
  if (!prevCity?.unlocked) return false;
  // 前一个城市至少完成1关
  return Object.values(prevCity.levels).some((l) => l.completed);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'LEVEL_COMPLETE': {
      const cityState = state.cities[action.cityId];
      if (!cityState) return state;

      // 防止重复完成
      if (cityState.levels[action.levelNumber]?.completed) return state;

      const levelData = levelsById[`${action.cityId}-level-${action.levelNumber}`];
      if (!levelData) return state;

      // XP 奖励根据难度
      const xpMap: Record<number, number> = { 3: 50, 5: 100, 10: 200 };
      const xpAmount = xpMap[levelData.gridSize] ?? 100;
      const levelResult = calcLevelUp(state.player.xp, xpAmount);

      const completedAt = new Date().toISOString();
      const levelProgress: LevelProgress = {
        completed: true,
        moves: action.moves,
        completedAt,
      };

      // 推进 currentLevel
      const nextLevel = action.levelNumber + 1;
      const maxLevel = TOTAL_LEVELS_PER_CITY[action.cityId] ?? 3;

      const updatedCity: CityLevelState = {
        ...cityState,
        currentLevel: nextLevel > maxLevel ? maxLevel : nextLevel,
        levels: {
          ...cityState.levels,
          [action.levelNumber]: levelProgress,
        },
      };

      const newCities = { ...state.cities, [action.cityId]: updatedCity };

      // 检查是否可以解锁下一个城市
      for (const cid of Object.keys(cities) as CityId[]) {
        if (!newCities[cid]?.unlocked && canUnlockCitySimple(cid, newCities)) {
          newCities[cid] = { ...newCities[cid], unlocked: true };
        }
      }

      return {
        ...state,
        player: {
          ...state.player,
          xp: levelResult.newTotal,
          level: levelResult.newLevel,
          title: levelResult.newTitle,
        },
        cities: newCities,
        ui: {
          ...state.ui,
          showLevelUp: levelResult.levelsGained > 0,
          levelsGained: levelResult.levelsGained,
          showCulturalPopup: true,
          culturalPopupData: levelData.culturalInfo,
          popupCityId: action.cityId,
          popupLevelNumber: action.levelNumber,
        },
      };
    }

    case 'CITY_UNLOCK': {
      if (state.cities[action.cityId]?.unlocked) return state;
      return {
        ...state,
        cities: {
          ...state.cities,
          [action.cityId]: {
            ...state.cities[action.cityId],
            unlocked: true,
          },
        },
      };
    }

    case 'DISMISS_LEVELUP': {
      return {
        ...state,
        ui: {
          ...state.ui,
          showLevelUp: false,
          levelsGained: 0,
        },
      };
    }

    case 'DISMISS_CULTURAL_POPUP': {
      return {
        ...state,
        ui: {
          ...state.ui,
          showCulturalPopup: false,
          culturalPopupData: null,
          popupCityId: null,
          popupLevelNumber: null,
        },
      };
    }

    case 'XP_GAIN': {
      const result = calcLevelUp(state.player.xp, action.amount);
      return {
        ...state,
        player: {
          ...state.player,
          xp: result.newTotal,
          level: result.newLevel,
          title: result.newTitle,
        },
        ui: {
          ...state.ui,
          showLevelUp: result.levelsGained > 0,
          levelsGained: result.levelsGained,
        },
      };
    }

    case 'RESET_GAME': {
      return createInitialState();
    }

    case 'LOAD_SAVE': {
      // 加载存档时重新评估城市解锁
      const loadedState = {
        ...action.state,
        cities: { ...action.state.cities },
      };
      for (const cid of Object.keys(cities) as CityId[]) {
        if (!loadedState.cities[cid]?.unlocked && canUnlockCitySimple(cid, loadedState.cities)) {
          loadedState.cities[cid] = { ...loadedState.cities[cid], unlocked: true };
        }
      }
      return loadedState;
    }

    default:
      return state;
  }
}
