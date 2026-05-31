import { CityId } from './city';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export type QuestDifficulty = 1 | 2 | 3;

export const DIFFICULTY_LABELS: Record<QuestDifficulty, string> = {
  1: '入门',
  2: '进阶',
  3: '达人',
};

export interface LessonCard {
  title: string;
  content: string;
  tip?: string;
}

export interface SortMiniGameItem {
  id: string;
  label: string;
  correctOrder: number;
  explanation?: string;
}

export interface SortMiniGame {
  type: 'sort';
  instruction: string;
  items: SortMiniGameItem[];
}

export interface HotspotMiniGameSpot {
  id: string;
  label: string;
  x: number;
  y: number;
  explanation?: string;
}

export interface HotspotMiniGame {
  type: 'hotspot';
  instruction: string;
  background: string;
  imageUrl?: string;
  hotspots: HotspotMiniGameSpot[];
}

export interface JigsawPuzzleGame {
  type: 'jigsaw';
  instruction: string;
  imageUrl: string;
  gridSize: number;
}

export type MiniGame = SortMiniGame | HotspotMiniGame | JigsawPuzzleGame;

export interface Quest {
  id: string;
  title: string;
  description: string;
  cityId: CityId;
  videoUrl?: string;
  durationSec?: number;
  xpReward: number;
  skillRewardIds: string[];
  quiz?: QuizQuestion[];
  difficulty: QuestDifficulty;
  lessonCards: LessonCard[];
  miniGame: MiniGame;
}

export interface QuestProgress {
  questId: string;
  startedAt: string | null;
  videoWatched: boolean;
  quizPassed: boolean;
  gameCompleted?: boolean;
  completedAt: string | null;
}

export interface QuestsState {
  completed: string[];
  progress: Record<string, QuestProgress>;
}
