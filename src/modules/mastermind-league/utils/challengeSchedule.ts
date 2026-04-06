// 2026 challenge windows (local calendar dates)

export const CHALLENGE_YEAR = 2026;

/** First moment the challenge is playable (inclusive). */
export const CHALLENGE_START = new Date(CHALLENGE_YEAR, 3, 16, 0, 0, 0, 0); // April 16

export type ChallengeQuarter = 2 | 3 | 4;

function parts(d: Date) {
  return { y: d.getFullYear(), m: d.getMonth() + 1, day: d.getDate() };
}

/**
 * Active quarter within the 2026 season, or null if outside playable windows.
 * Q2: Apr 16 – Jun 30 · Q3: Jul 1 – Sep 30 · Q4: Oct 1 – Dec 31
 */
export function getChallengeQuarter(d = new Date()): ChallengeQuarter | null {
  const { y, m, day } = parts(d);
  if (y !== CHALLENGE_YEAR) return null;
  if (m < 4 || (m === 4 && day < 16)) return null;
  if (m <= 6) return 2;
  if (m <= 9) return 3;
  return 4;
}

export function isChallengeActive(d = new Date()): boolean {
  return getChallengeQuarter(d) !== null;
}

export type ChallengeClosedReason = "before_start" | "after_season";

export function getChallengeClosedReason(d = new Date()): ChallengeClosedReason | null {
  if (isChallengeActive(d)) return null;
  const { y, m, day } = parts(d);
  if (y < CHALLENGE_YEAR || (y === CHALLENGE_YEAR && (m < 4 || (m === 4 && day < 16)))) {
    return "before_start";
  }
  return "after_season";
}

export function formatChallengeQuarterLabel(q: ChallengeQuarter): string {
  return `Q${q} · ${CHALLENGE_YEAR}`;
}

/** Milliseconds until CHALLENGE_START, or 0 if already started. */
export function getMsUntilChallengeStart(d = new Date()): number {
  return Math.max(0, CHALLENGE_START.getTime() - d.getTime());
}
