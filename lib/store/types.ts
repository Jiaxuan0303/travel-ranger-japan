import {
  PlayerState,
  CityId,
  CityLevelState,
  CulturalInfo,
} from '@/lib/types';

export interface GameState {
  player: PlayerState;
  cities: Record<CityId, CityLevelState>;
  ui: {
    showLevelUp: boolean;
    levelsGained: number;
    showCulturalPopup: boolean;
    culturalPopupData: CulturalInfo | null;
    popupCityId: CityId | null;
    popupLevelNumber: number | null;
  };
}

export type GameAction =
  | { type: 'LEVEL_COMPLETE'; cityId: CityId; levelNumber: number; moves: number }
  | { type: 'CITY_UNLOCK'; cityId: CityId }
  | { type: 'DISMISS_LEVELUP' }
  | { type: 'DISMISS_CULTURAL_POPUP' }
  | { type: 'XP_GAIN'; amount: number }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_SAVE'; state: GameState };
