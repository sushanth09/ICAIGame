// Client-side registration & duplicate prevention (swap for API later)

import type { PlayerProfile } from "../types/gameTypes";
import { STORAGE_KEYS } from "../utils/helpers";

/**
 * When `true`: one attempt per browser + unique email (production).
 * When `false`: skip those checks so you can replay for testing.
 */
export const ENFORCE_SINGLE_PLAY = false;

/**
 * When `true`: landing / play button only during scheduled windows (see challengeSchedule).
 * When `false`: challenge is always enterable — use before April 16, 2026 or after season for testing.
 */
export const ENFORCE_CHALLENGE_DATES = false;

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmailFormat(email: string): boolean {
  const t = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

type StoredRegistration = PlayerProfile & { registeredAt: string };

function readRegistrations(): StoredRegistration[] {
  const s = storage();
  if (!s) return [];
  const raw = s.getItem(STORAGE_KEYS.REGISTRATIONS);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredRegistration[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRegistrations(list: StoredRegistration[]) {
  storage()?.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(list));
}

export function isEmailRegistered(email: string): boolean {
  const n = normalizeEmail(email);
  return readRegistrations().some((r) => r.email === n);
}

export function hasDeviceAttemptLock(): boolean {
  return storage()?.getItem(STORAGE_KEYS.DEVICE_CHALLENGE_LOCK) === "1";
}

export function setDeviceAttemptLock(): void {
  storage()?.setItem(STORAGE_KEYS.DEVICE_CHALLENGE_LOCK, "1");
}

export function getSessionProfile(): PlayerProfile | null {
  const s = storage();
  if (!s) return null;
  const raw = s.getItem(STORAGE_KEYS.SESSION_PROFILE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PlayerProfile;
  } catch {
    return null;
  }
}

export function setSessionProfile(profile: PlayerProfile) {
  storage()?.setItem(STORAGE_KEYS.SESSION_PROFILE, JSON.stringify(profile));
}

export function clearSessionProfile() {
  storage()?.removeItem(STORAGE_KEYS.SESSION_PROFILE);
}

export type RegisterResult =
  | { ok: true; profile: PlayerProfile }
  | { ok: false; message: string };

/**
 * Registers a player: unique email + device lock (localStorage).
 * Call only after client-side validation.
 */
export function registerPlayer(input: {
  firstName: string;
  lastName: string;
  email: string;
  chapter: string | null;
}): RegisterResult {
  const email = normalizeEmail(input.email);

  if (ENFORCE_SINGLE_PLAY) {
    if (hasDeviceAttemptLock()) {
      return { ok: false, message: "You have already attempted the challenge." };
    }
    if (isEmailRegistered(email)) {
      return { ok: false, message: "This email has already been used for the challenge." };
    }
  }

  const profile: PlayerProfile = {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email,
    chapter: input.chapter?.trim() || null,
  };

  if (ENFORCE_SINGLE_PLAY) {
    const list = readRegistrations();
    list.push({ ...profile, registeredAt: new Date().toISOString() });
    writeRegistrations(list);
    setDeviceAttemptLock();
  }
  setSessionProfile(profile);

  return { ok: true, profile };
}
