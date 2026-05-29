import { GameState, GameAction } from './types';
import { calcLevelUp, canUnlockCity } from '@/lib/engine';
import { cities } from '@/data/cities';
import { skillsById } from '@/data/skills';
import { questsById } from '@/data/quests';
import { CityId } from '@/lib/types';

export function createInitialState(): GameState {
  const initialCities = {} as Record<CityId, GameState['cities'][CityId]>;
  const tokyoId: CityId = 'tokyo';

  initialCities[tokyoId] = {
    cityId: tokyoId,
    unlocked: true,
    completionPercent: 0,
    questsCompleted: [],
    landmarksVisited: [],
  };

  for (const cid of ['osaka', 'kyoto', 'kamakura'] as CityId[]) {
    initialCities[cid] = {
      cityId: cid,
      unlocked: false,
      completionPercent: 0,
      questsCompleted: [],
      landmarksVisited: [],
    };
  }

  return {
    player: {
      level: 1,
      xp: 0,
      skillPoints: 999,
      title: '见习游侠',
      totalVideosWatched: 0,
      joinDate: new Date().toISOString(),
    },
    cities: initialCities,
    skills: {
      unlocked: [],
      points: 3,
    },
    quests: {
      completed: [],
      progress: {},
    },
    ui: {
      showLevelUp: false,
      levelsGained: 0,
      lastUnlock: null,
    },
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
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

    case 'QUEST_START': {
      return {
        ...state,
        quests: {
          ...state.quests,
          progress: {
            ...state.quests.progress,
            [action.questId]: {
              questId: action.questId,
              startedAt: new Date().toISOString(),
              videoWatched: false,
              quizPassed: false,
              completedAt: null,
            },
          },
        },
      };
    }

    case 'VIDEO_WATCHED': {
      return {
        ...state,
        player: {
          ...state.player,
          totalVideosWatched: state.player.totalVideosWatched + 1,
        },
        quests: {
          ...state.quests,
          progress: {
            ...state.quests.progress,
            [action.questId]: {
              ...(state.quests.progress[action.questId] ?? {
                questId: action.questId,
                startedAt: new Date().toISOString(),
                quizPassed: false,
              }),
              videoWatched: true,
            },
          },
        },
      };
    }

    case 'QUIZ_PASSED': {
      const quest = questsById[action.questId];
      const xpAmount = quest
        ? quest.xpReward +
          (action.correctCount === quest.quiz.length
            ? Math.floor(quest.xpReward * 0.5)
            : 0)
        : 100;

      const levelResult = calcLevelUp(state.player.xp, xpAmount);

      return {
        ...state,
        player: {
          ...state.player,
          xp: levelResult.newTotal,
          level: levelResult.newLevel,
          title: levelResult.newTitle,
        },
        quests: {
          ...state.quests,
          progress: {
            ...state.quests.progress,
            [action.questId]: {
              ...(state.quests.progress[action.questId] ?? { questId: action.questId, startedAt: new Date().toISOString(), videoWatched: true }),
              quizPassed: true,
              completedAt: new Date().toISOString(),
            },
          },
        },
        ui: {
          ...state.ui,
          showLevelUp: levelResult.levelsGained > 0,
          levelsGained: levelResult.levelsGained,
        },
      };
    }

    case 'QUEST_COMPLETE': {
      const cityProgress = state.cities[action.cityId];
      if (!cityProgress) return state;

      const questsCompleted = cityProgress.questsCompleted.includes(
        action.questId
      )
        ? cityProgress.questsCompleted
        : [...cityProgress.questsCompleted, action.questId];

      const city = cities[action.cityId];
      const totalQuests = city?.totalQuests ?? 1;
      const completionPercent = Math.round(
        (questsCompleted.length / totalQuests) * 100
      );

      // 检查是否解锁新城市
      const newCities = { ...state.cities };
      for (const cid of Object.keys(cities) as CityId[]) {
        if (!newCities[cid]?.unlocked) {
          const cityData = cities[cid];
          if (
            canUnlockCity(cityData, state.player, state.skills, newCities)
          ) {
            newCities[cid] = {
              ...newCities[cid],
              unlocked: true,
            };
          }
        }
      }

      return {
        ...state,
        cities: {
          ...newCities,
          [action.cityId]: {
            ...cityProgress,
            questsCompleted,
            completionPercent,
          },
        },
        quests: {
          ...state.quests,
          completed: state.quests.completed.includes(action.questId)
            ? state.quests.completed
            : [...state.quests.completed, action.questId],
        },
      };
    }

    case 'SKILL_UNLOCK': {
      const skill = skillsById[action.skillId];
      if (!skill || state.skills.unlocked.includes(action.skillId)) {
        return state;
      }

      const newSkills = {
        unlocked: [...state.skills.unlocked, action.skillId],
        points: state.skills.points - skill.cost,
      };

      // 检查技能解锁后是否可以解锁新城市
      const newCities = { ...state.cities };
      for (const cid of Object.keys(cities) as CityId[]) {
        if (!newCities[cid]?.unlocked) {
          const cityData = cities[cid];
          if (canUnlockCity(cityData, state.player, newSkills, newCities)) {
            newCities[cid] = {
              ...newCities[cid],
              unlocked: true,
            };
          }
        }
      }

      return {
        ...state,
        skills: newSkills,
        cities: newCities,
        ui: {
          ...state.ui,
          lastUnlock: `skill:${action.skillId}`,
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
        ui: {
          ...state.ui,
          lastUnlock: `city:${action.cityId}`,
        },
      };
    }

    case 'LANDMARK_VISIT': {
      const cp = state.cities[action.cityId];
      if (!cp) return state;
      return {
        ...state,
        cities: {
          ...state.cities,
          [action.cityId]: {
            ...cp,
            landmarksVisited: cp.landmarksVisited.includes(action.landmarkId)
              ? cp.landmarksVisited
              : [...cp.landmarksVisited, action.landmarkId],
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

    case 'SET_SKILL_POINTS': {
      return { ...state, skills: { ...state.skills, points: action.amount } };
    }

    case 'RESET_GAME': {
      return createInitialState();
    }

    case 'LOAD_SAVE': {
      // Re-evaluate city unlocks on load
      const loadedState = { ...action.state };
      for (const cid of Object.keys(cities) as CityId[]) {
        if (!loadedState.cities[cid]?.unlocked) {
          const cityData = cities[cid];
          if (canUnlockCity(cityData, loadedState.player, loadedState.skills, loadedState.cities)) {
            loadedState.cities[cid] = { ...loadedState.cities[cid], unlocked: true };
          }
        }
      }
      return loadedState;
    }

    default:
      return state;
  }
}
