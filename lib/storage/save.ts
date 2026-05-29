import { GameState } from '@/lib/store/types';
import { STORAGE_KEY } from './keys';

const SAVE_VERSION = 1;

interface SaveData {
  version: number;
  state: GameState;
  savedAt: number;
}

export function saveGame(state: GameState): void {
  try {
    const data: SaveData = {
      version: SAVE_VERSION,
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

    if (data.version !== SAVE_VERSION) {
      return migrateSave(data);
    }

    return data.state;
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

function migrateSave(data: SaveData): GameState | null {
  // 将来版本升级时在此处理迁移链
  // e.g. if (data.version === 1) { data = migrate_v1_to_v2(data); }
  return null;
}
