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
  /** Completed registrations (email uniqueness). JSON array. */
  REGISTRATIONS: "mastermind_registrations",
  /** Device has started / completed an attempt. */
  DEVICE_CHALLENGE_LOCK: "mastermind_device_challenge_lock",
  /** Active session player (survives refresh mid-quiz). */
  SESSION_PROFILE: "mastermind_session_profile",
} as const;
