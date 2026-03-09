// ICAI Atlanta Mastermind League - Game Timer Hook

import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";

export function useGameTimer(
  isActive: boolean,
  onExpire?: () => void
): number {
  const { timeRemaining, setTimeRemaining } = useGameStore();

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
      if (timeRemaining <= 1 && onExpire) onExpire();
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, setTimeRemaining, onExpire]);

  return timeRemaining;
}
