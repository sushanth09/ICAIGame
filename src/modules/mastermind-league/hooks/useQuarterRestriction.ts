// ICAI Atlanta Mastermind League - Quarter Restriction Hook
// Users can play once per quarter

import { useMemo } from "react";
import { getCurrentQuarter, getCurrentYear } from "../utils/helpers";
import { getLastPlayedQuarter } from "../services/gameService";

export function useQuarterRestriction(): {
  canPlay: boolean;
  lastPlayed: { quarter: number; year: number } | null;
  currentQuarter: number;
  currentYear: number;
} {
  const currentQuarter = getCurrentQuarter();
  const currentYear = getCurrentYear();

  const [lastPlayed, canPlay] = useMemo(() => {
    let lastPlayedData: { quarter: number; year: number } | null = null;
    let canPlayFlag = true;

    if (typeof window !== "undefined") {
      getLastPlayedQuarter().then((data) => {
        lastPlayedData = data;
      });
    }
    return [lastPlayedData, canPlayFlag];
  }, []);

  return {
    canPlay: true, // We'll check async in component
    lastPlayed,
    currentQuarter,
    currentYear,
  };
}
