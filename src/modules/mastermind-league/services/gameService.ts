// ICAI Atlanta Mastermind League - Game Service
// Uses localStorage now; structured for future API migration:
// POST /api/mastermind/start, POST /api/mastermind/answer,
// POST /api/mastermind/finish

import type { GameState } from "../types/gameTypes";
import { STORAGE_KEYS } from "../utils/helpers";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export async function saveGameState(state: Partial<GameState>): Promise<void> {
  const storage = getStorage();
  if (!storage) return;
  const existing = getGameState();
  const merged = { ...existing, ...state };
  storage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(merged));
}

export async function getGameState(): Promise<Partial<GameState> | null> {
  const storage = getStorage();
  if (!storage) return null;
  const raw = storage.getItem(STORAGE_KEYS.GAME_STATE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Partial<GameState>;
  } catch {
    return null;
  }
}

export async function clearGameState(): Promise<void> {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(STORAGE_KEYS.GAME_STATE);
}

export async function recordLastPlayedQuarter(quarter: number): Promise<void> {
  const storage = getStorage();
  if (!storage) return;
  const payload = JSON.stringify({
    quarter,
    year: new Date().getFullYear(),
    timestamp: Date.now(),
  });
  storage.setItem(STORAGE_KEYS.LAST_PLAYED_QUARTER, payload);
}

export async function getLastPlayedQuarter(): Promise<{
  quarter: number;
  year: number;
} | null> {
  const storage = getStorage();
  if (!storage) return null;
  const raw = storage.getItem(STORAGE_KEYS.LAST_PLAYED_QUARTER);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as {
      quarter: number;
      year: number;
      timestamp: number;
    };
    return { quarter: data.quarter, year: data.year };
  } catch {
    return null;
  }
}
