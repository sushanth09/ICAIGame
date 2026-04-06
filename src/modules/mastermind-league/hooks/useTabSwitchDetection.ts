// Tab switch detection — non-blocking toast + violation cap → disqualify / end run

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const DEFAULT_MAX = 3;

export function useTabSwitchDetection(
  isActive: boolean,
  options?: {
    maxViolations?: number;
    onViolationLimit?: () => void;
  }
): {
  tabHidden: boolean;
  acknowledgeLeave: () => void;
  violationCount: number;
} {
  const [tabHidden, setTabHidden] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const violationsRef = useRef(0);
  const maxViolations = options?.maxViolations ?? DEFAULT_MAX;
  const onLimitRef = useRef(options?.onViolationLimit);
  onLimitRef.current = options?.onViolationLimit;

  const acknowledgeLeave = () => setTabHidden(false);

  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) return;
      violationsRef.current += 1;
      const n = violationsRef.current;
      setViolationCount(n);
      toast.error("Tab change is not allowed.", { duration: 3500, id: "tab-switch" });
      if (n >= maxViolations) {
        setTabHidden(false);
        onLimitRef.current?.();
        return;
      }
      setTabHidden(true);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isActive, maxViolations]);

  return { tabHidden, acknowledgeLeave, violationCount };
}
