// ICAI Atlanta Mastermind League - Leaderboard Service
// Uses localStorage now; structured for future API:
// GET /api/mastermind/leaderboard

import type { LeaderboardEntry } from "../types/gameTypes";
import { STORAGE_KEYS } from "../utils/helpers";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const storage = getStorage();
  if (!storage) return [];
  const raw = storage.getItem(STORAGE_KEYS.LEADERBOARD);
  if (!raw) return [];
  try {
    const entries = JSON.parse(raw) as LeaderboardEntry[];
    return entries.sort((a, b) => b.score - a.score).slice(0, 10);
  } catch {
    return [];
  }
}

export async function addToLeaderboard(
  playerName: string,
  score: number
): Promise<LeaderboardEntry[]> {
  const storage = getStorage();
  if (!storage) return [];
  const existing = await getLeaderboard();
  const entry: LeaderboardEntry = {
    id: `entry_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    playerName: playerName || "Anonymous",
    score,
    rank: 0,
    date: new Date().toISOString(),
  };
  const merged = [...existing, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((e, i) => ({ ...e, rank: i + 1 }));
  storage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(merged));
  return merged;
}
