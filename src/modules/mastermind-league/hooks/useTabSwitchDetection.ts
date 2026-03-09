// ICAI Atlanta Mastermind League - Tab Switch Detection (Anti-cheating)
// Shows full-screen overlay when user leaves tab so they cannot continue until they acknowledge.

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const WARNING_TOAST = "⚠️ Please stay on the game tab.";

export function useTabSwitchDetection(isActive: boolean): {
  tabHidden: boolean;
  acknowledgeLeave: () => void;
} {
  const [tabHidden, setTabHidden] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabHidden(true);
        toast(WARNING_TOAST, {
          icon: "⚠️",
          duration: 5000,
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid #f59e0b",
          },
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isActive]);

  const acknowledgeLeave = () => setTabHidden(false);

  return { tabHidden, acknowledgeLeave };
}
