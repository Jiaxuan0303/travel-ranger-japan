export type PlayerTitle =
  | '见习游侠'
  | '初级游侠'
  | '中级游侠'
  | '资深游侠'
  | '大游侠'
  | '传奇游侠';

export interface PlayerState {
  level: number;
  xp: number;
  title: PlayerTitle;
  totalVideosWatched: number;
  joinDate: string;
}

export const PLAYER_TITLES: Record<number, PlayerTitle> = {
  1: '见习游侠',
  5: '初级游侠',
  10: '中级游侠',
  15: '资深游侠',
  20: '大游侠',
  30: '传奇游侠',
};

export function getTitleForLevel(level: number): PlayerTitle {
  const thresholds = Object.keys(PLAYER_TITLES)
    .map(Number)
    .sort((a, b) => b - a);
  for (const threshold of thresholds) {
    if (level >= threshold) return PLAYER_TITLES[threshold];
  }
  return '见习游侠';
}
