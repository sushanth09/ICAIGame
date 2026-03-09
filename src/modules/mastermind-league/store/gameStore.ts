// ICAI Atlanta Mastermind League - Zustand Game Store

import { create } from "zustand";
import type { GamePhase } from "../types/gameTypes";

interface GameStore {
  score: number;
  currentRound: 1 | 2 | 3;
  currentQuestionIndex: number;
  timeRemaining: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  phase: GamePhase;

  setPhase: (phase: GamePhase) => void;
  setScore: (score: number) => void;
  setCurrentRound: (round: 1 | 2 | 3) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setTimeRemaining: (time: number) => void;
  setGameStarted: (started: boolean) => void;
  setGameCompleted: (completed: boolean) => void;

  nextQuestion: () => void;
  addScore: (points: number) => void;
  resetGame: () => void;
}

const initialState = {
  score: 0,
  currentRound: 1 as 1 | 2 | 3,
  currentQuestionIndex: 0,
  timeRemaining: 0,
  gameStarted: false,
  gameCompleted: false,
  phase: "landing" as GamePhase,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),
  setScore: (score) => set({ score }),
  setCurrentRound: (currentRound) => set({ currentRound }),
  setCurrentQuestionIndex: (currentQuestionIndex) => set({ currentQuestionIndex }),
  setTimeRemaining: (timeRemaining) => set({ timeRemaining }),
  setGameStarted: (gameStarted) => set({ gameStarted }),
  setGameCompleted: (gameCompleted) => set({ gameCompleted }),

  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    })),

  addScore: (points) =>
    set((state) => ({
      score: state.score + points,
    })),

  resetGame: () => set(initialState),
}));
