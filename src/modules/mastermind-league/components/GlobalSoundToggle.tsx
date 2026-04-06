"use client";

/**
 * Global speaker toggle — mutes/unmutes background music + SFX (via getSoundEnabled).
 * Music engine lives in `audio/backgroundMusic.ts` so it can start on game begin without remounting.
 */

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { getSoundEnabled, setSoundEnabled } from "../hooks/useSoundSystem";
import {
  initBackgroundMusicEngine,
  resumeGameBackgroundMusicIfPreferred,
  stopGameBackgroundMusic,
} from "../audio/backgroundMusic";

export function GlobalSoundToggle() {
  const [isOn, setIsOn] = useState<boolean>(() => getSoundEnabled());

  const toggle = useCallback(() => {
    initBackgroundMusicEngine();
    setSoundEnabled(!isOn);
  }, [isOn]);

  useEffect(() => {
    const handler = (e: Event) => {
      const enabled = (e as CustomEvent<{ enabled: boolean }>).detail.enabled;
      setIsOn(enabled);
      if (!enabled) {
        stopGameBackgroundMusic();
      } else {
        resumeGameBackgroundMusicIfPreferred();
      }
    };
    window.addEventListener("soundToggle", handler);
    return () => window.removeEventListener("soundToggle", handler);
  }, []);

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      title={isOn ? "Mute sounds" : "Enable sounds"}
      aria-label={isOn ? "Mute sounds" : "Enable sounds"}
      className="flex items-center justify-center w-9 h-9 rounded-full"
      style={{
        background: isOn ? "rgba(246,196,83,0.15)" : "rgba(255,255,255,0.07)",
        border: `1px solid ${isOn ? "rgba(246,196,83,0.45)" : "rgba(255,255,255,0.18)"}`,
        backdropFilter: "blur(8px)",
        color: isOn ? "#F6C453" : "#9CA3AF",
        transition: "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
        transform: "translateZ(0)",
      }}
    >
      {isOn ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
        </svg>
      )}
    </motion.button>
  );
}
