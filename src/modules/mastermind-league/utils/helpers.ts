// ICAI Atlanta Mastermind League - Helper Utilities

/**
 * Calculate current quarter (1-4)
 * Math.ceil((month + 1) / 3) where month is 0-11
 */
export function getCurrentQuarter(): number {
  const month = new Date().getMonth();
  return Math.ceil((month + 1) / 3);
}

/**
 * Get current year
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Storage key for quarter restriction
 */
export const STORAGE_KEYS = {
  LAST_PLAYED_QUARTER: "mastermind_last_played_quarter",
  GAME_STATE: "mastermind_game_state",
  LEADERBOARD: "mastermind_leaderboard",
} as const;
