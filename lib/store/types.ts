import {
  PlayerState,
  SkillsState,
  QuestsState,
  CityId,
  PlayerCityProgress,
} from '@/lib/types';
import { CITY_IDS, City } from '@/lib/types/city';

export interface GameState {
  player: PlayerState;
  cities: Record<CityId, PlayerCityProgress>;
  skills: SkillsState;
  quests: QuestsState;
  ui: {
    showLevelUp: boolean;
    levelsGained: number;
    lastUnlock: string | null; // "city:tokyo" | "skill:xyz"
  };
}

export type GameAction =
  | { type: 'XP_GAIN'; amount: number; quizPerfect?: number }
  | { type: 'QUEST_COMPLETE'; questId: string; cityId: CityId }
  | { type: 'QUEST_START'; questId: string }
  | { type: 'VIDEO_WATCHED'; questId: string }
  | { type: 'QUIZ_PASSED'; questId: string; correctCount: number }
  | { type: 'SKILL_UNLOCK'; skillId: string }
  | { type: 'CITY_UNLOCK'; cityId: CityId }
  | { type: 'LANDMARK_VISIT'; cityId: CityId; landmarkId: string }
  | { type: 'DISMISS_LEVELUP' }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_SAVE'; state: GameState }
  | { type: 'SET_SKILL_POINTS'; amount: number };
