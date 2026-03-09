// ICAI Atlanta Mastermind League - Quarter Restriction (sync check via localStorage)
// Uses mounted state to avoid hydration mismatch: server and first client render return same values.

import { useState, useEffect } from "react";
import { getCurrentQuarter, getCurrentYear, STORAGE_KEYS } from "../utils/helpers";

const getDefault = () => ({
  canPlay: true,
  currentQuarter: getCurrentQuarter(),
  currentYear: getCurrentYear(),
  lastPlayedInfo: null as string | null,
});

export function useCanPlayThisQuarter(): {
  canPlay: boolean;
  currentQuarter: number;
  currentYear: number;
  lastPlayedInfo: string | null;
} {
  const [state, setState] = useState(getDefault);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = getCurrentQuarter();
    const y = getCurrentYear();
    const raw = window.localStorage.getItem(STORAGE_KEYS.LAST_PLAYED_QUARTER);
    let canPlay = true;
    let lastPlayedInfo: string | null = null;
    if (raw) {
      try {
        const data = JSON.parse(raw) as { quarter: number; year: number };
        if (data.quarter === q && data.year === y) {
          canPlay = false;
          lastPlayedInfo = `Q${data.quarter} ${data.year}`;
        }
      } catch { /* ignore */ }
    }
    setState({ canPlay, currentQuarter: q, currentYear: y, lastPlayedInfo });
  }, []);

  return state;
}
