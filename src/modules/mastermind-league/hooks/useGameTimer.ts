// Single interval, stable across re-renders; onExpire via ref (avoid stale deps / reset bugs).

import { useEffect, useRef } from "react";
import { useGameStore } from "../store/gameStore";

export function useGameTimer(isActive: boolean, onExpire?: () => void): void {
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!isActive) return;

    const id = window.setInterval(() => {
      const { timeRemaining, setTimeRemaining } = useGameStore.getState();
      if (timeRemaining <= 0) return;
      const next = timeRemaining - 1;
      setTimeRemaining(next);
      if (next <= 0) {
        onExpireRef.current?.();
      }
    }, 1000);

    return () => window.clearInterval(id);
  }, [isActive]);
}
