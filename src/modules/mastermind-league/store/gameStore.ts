// ICAI Atlanta Mastermind League - Zustand Game Store

import { create } from "zustand";
import type { GamePhase, PlayerProfile } from "../types/gameTypes";

interface GameStore {
  score: number;
  roundScores: [number, number, number];
  currentRound: 1 | 2 | 3;
  currentQuestionIndex: number;
  timeRemaining: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  phase: GamePhase;
  playerProfile: PlayerProfile | null;
  disqualified: boolean;

  setPhase: (phase: GamePhase) => void;
  setScore: (score: number) => void;
  setRoundScore: (round: 1 | 2 | 3, score: number) => void;
  setCurrentRound: (round: 1 | 2 | 3) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setTimeRemaining: (time: number) => void;
  setGameStarted: (started: boolean) => void;
  setGameCompleted: (completed: boolean) => void;
  setPlayerProfile: (profile: PlayerProfile | null) => void;
  setDisqualified: (v: boolean) => void;

  nextQuestion: () => void;
  addScore: (points: number) => void;
  resetGame: () => void;
}

const initialState = {
  score: 0,
  roundScores: [0, 0, 0] as [number, number, number],
  currentRound: 1 as 1 | 2 | 3,
  currentQuestionIndex: 0,
  timeRemaining: 0,
  gameStarted: false,
  gameCompleted: false,
  phase: "landing" as GamePhase,
  playerProfile: null as PlayerProfile | null,
  disqualified: false,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),
  setScore: (score) => set({ score }),
  setRoundScore: (round, roundScore) =>
    set((state) => {
      const newRoundScores = [...state.roundScores] as [number, number, number];
      newRoundScores[round - 1] = roundScore;
      return { roundScores: newRoundScores };
    }),
  setCurrentRound: (currentRound) => set({ currentRound }),
  setCurrentQuestionIndex: (currentQuestionIndex) => set({ currentQuestionIndex }),
  setTimeRemaining: (timeRemaining) => set({ timeRemaining }),
  setGameStarted: (gameStarted) => set({ gameStarted }),
  setGameCompleted: (gameCompleted) => set({ gameCompleted }),
  setPlayerProfile: (playerProfile) => set({ playerProfile }),
  setDisqualified: (disqualified) => set({ disqualified }),

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
