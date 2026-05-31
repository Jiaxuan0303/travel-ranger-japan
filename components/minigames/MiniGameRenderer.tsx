'use client';

import { MiniGame } from '@/lib/types';
import { JigsawGame } from './JigsawGame';

export interface MiniGameResult {
  score: number;
  perfect: boolean;
  moves?: number;
}

interface MiniGameRendererProps {
  game: MiniGame;
  onComplete: (result: MiniGameResult) => void;
}

export function MiniGameRenderer({ game, onComplete }: MiniGameRendererProps) {
  if (game.type === 'jigsaw') {
    return <JigsawGame game={game} onComplete={onComplete} />;
  }

  // Fallback
  return <JigsawGame game={game as any} onComplete={onComplete} />;
}
