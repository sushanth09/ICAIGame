// ICAI Atlanta Mastermind League - Game Engine

import type {
  Answer,
  Round1Question,
  Round2Question,
  Round3Question,
} from "../types/gameTypes";
import { getPointsForRound } from "../utils/scoring";

/**
 * Validate Round 1 MCQ answer
 */
export function validateRound1Answer(
  question: Round1Question,
  userAnswer: string
): boolean {
  return userAnswer.toUpperCase() === question.correctAnswer.toUpperCase();
}

/**
 * Validate Round 2 Myth/Fact answer
 */
export function validateRound2Answer(
  question: Round2Question,
  userAnswer: boolean
): boolean {
  return userAnswer === question.correctAnswer;
}

/**
 * Validate Round 3 Lightning answer (case-insensitive, trimmed)
 */
export function validateRound3Answer(
  question: Round3Question,
  userAnswer: string
): boolean {
  const normalizedUser = userAnswer.trim().toLowerCase();
  const normalizedCorrect = question.correctAnswer.trim().toLowerCase();
  // Exact match
  if (normalizedUser === normalizedCorrect) return true;
  // Also accept common abbreviations (e.g., ROE for Return on Equity)
  if (question.correctAnswer === "ROE" && normalizedUser === "return on equity")
    return true;
  if (
    question.correctAnswer === "EBITDA" &&
    normalizedUser ===
      "earnings before interest taxes depreciation and amortization"
  )
    return true;
  if (
    question.correctAnswer === "Goods and Services Tax" &&
    (normalizedUser === "gst" || normalizedUser === "goods and services tax")
  )
    return true;
  return false;
}

/**
 * Calculate score for a correct answer
 */
export function calculateScore(round: 1 | 2 | 3): number {
  return getPointsForRound(round);
}

/**
 * Create an Answer record
 */
export function createAnswer(
  questionId: string,
  userAnswer: string | boolean,
  isCorrect: boolean,
  round: 1 | 2 | 3
): Answer {
  return {
    questionId,
    userAnswer,
    isCorrect,
    points: isCorrect ? getPointsForRound(round) : 0,
  };
}
