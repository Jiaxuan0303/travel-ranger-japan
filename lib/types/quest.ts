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

export interface Quest {
  id: string;
  title: string;
  description: string;
  cityId: CityId;
  videoUrl: string;
  durationSec: number;
  xpReward: number;
  skillRewardIds: string[];
  quiz: QuizQuestion[];
  difficulty: QuestDifficulty;
}

export interface QuestProgress {
  questId: string;
  startedAt: string | null;
  videoWatched: boolean;
  quizPassed: boolean;
  completedAt: string | null;
}

export interface QuestsState {
  completed: string[];
  progress: Record<string, QuestProgress>;
}
