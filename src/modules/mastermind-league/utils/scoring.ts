// ICAI Atlanta Mastermind League - Scoring Utilities

import type { Answer } from "../types/gameTypes";
import { round1Questions, round2Questions } from "../data/questions";

export const POINTS_ROUND_1 = 5;
export const POINTS_ROUND_2 = 5;
export const POINTS_ROUND_3 = 2;

/** Upper bound for lightning round question count (may be fewer if the bank is smaller). */
export const ROUND3_MAX_QUESTIONS = 25;

export const MAX_SCORE_ROUND_1 = round1Questions.length * POINTS_ROUND_1;
export const MAX_SCORE_ROUND_2 = round2Questions.length * POINTS_ROUND_2;
/** Design cap for results / progress (25 correct × 2 pts). */
export const MAX_SCORE_ROUND_3_CAP = ROUND3_MAX_QUESTIONS * POINTS_ROUND_3;

/** Full challenge maximum (100 with 5+5 R1/R2 questions). */
export const TOTAL_GAME_MAX_POINTS =
  MAX_SCORE_ROUND_1 + MAX_SCORE_ROUND_2 + MAX_SCORE_ROUND_3_CAP;

export function calculateTotalScore(answers: Answer[]): number {
  return answers.reduce((sum, a) => sum + a.points, 0);
}

export function getPointsForRound(round: 1 | 2 | 3): number {
  switch (round) {
    case 1:
      return POINTS_ROUND_1;
    case 2:
      return POINTS_ROUND_2;
    case 3:
      return POINTS_ROUND_3;
    default:
      return 0;
  }
}
