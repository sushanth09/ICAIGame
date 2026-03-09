// ICAI Atlanta Mastermind League - Scoring Utilities

import type { Answer } from "../types/gameTypes";

export function calculateTotalScore(answers: Answer[]): number {
  return answers.reduce((sum, a) => sum + a.points, 0);
}

export function getPointsForRound(round: 1 | 2 | 3): number {
  switch (round) {
    case 1:
      return 10;
    case 2:
      return 10;
    case 3:
      return 5;
    default:
      return 0;
  }
}
