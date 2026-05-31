import { CityId } from './city';

export interface CulturalInfo {
  culture: string;
  food: string;
  history: string;
}

export interface LevelDefinition {
  id: string;
  cityId: CityId;
  levelNumber: number;
  title: string;
  description: string;
  gridSize: number;
  imageUrl: string;
  instruction: string;
  culturalInfo: CulturalInfo;
}

export interface LevelProgress {
  completed: boolean;
  moves: number;
  completedAt: string | null;
}

export interface CityLevelState {
  cityId: CityId;
  unlocked: boolean;
  currentLevel: number;
  levels: Record<number, LevelProgress>;
}

export function cityCompletionPercent(state: CityLevelState, totalLevels: number): number {
  const completed = Object.values(state.levels).filter(l => l.completed).length;
  return totalLevels > 0 ? Math.round((completed / totalLevels) * 100) : 0;
}
