'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from 'react';
import { GameState, GameAction } from './types';
import { gameReducer, createInitialState } from './gameReducer';
import { loadGame, saveGame } from '@/lib/storage/save';

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    gameReducer,
    null,
    () => loadGame() ?? createInitialState()
  );

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce save on state change
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveGame(state);
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
