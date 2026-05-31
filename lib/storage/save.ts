import { GameState } from '@/lib/store/types';
import { STORAGE_KEY } from './keys';
import { GAME_CONSTANTS } from '@/data/constants';
import { createInitialState } from '@/lib/store/gameReducer';
import { migrateSave } from './migrate';

interface SaveData {
  version: number;
  state: GameState;
  savedAt: number;
}

export function saveGame(state: GameState): void {
  try {
    const data: SaveData = {
      version: GAME_CONSTANTS.SAVE_VERSION,
      state,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data: SaveData = JSON.parse(raw);

    // Always run migrate to ensure data matches current schema
    const migrated = migrateSave(data);

    // Dispatch LOAD_SAVE to re-evaluate unlocks
    return migrated;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently fail
  }
}
