"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AnimatedTitle,
  EnhancedStartButton,
  WarpTransition,
} from "../components/landing";
import { VideoBackground } from "../components/VideoBackground";

// ── Shared easing & font ───────────────────────────────────────────────────
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const PP: React.CSSProperties = { fontFamily: "var(--font-poppins), sans-serif" };

// ── Motion presets ─────────────────────────────────────────────────────────
const slideUp = (delay: number, duration = 1.2) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration, ease: EASE_OUT },
});

const slideFromRight = (delay: number, duration = 1.2) => ({
  initial: { opacity: 0, x: 70 },
  animate: { opacity: 1, x: 0 },
  transition: { delay, duration, ease: EASE_OUT },
});

const fadeIn = (delay: number, duration = 1.0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration, ease: "easeOut" as const },
});

interface LandingPageProps {
  onStart: () => void;
  canPlay?: boolean;
  statusMessage?: string | null;
  quarterLabel?: string | null;
  challengeActive?: boolean;
  deviceLocked?: boolean;
  msUntilStart?: number;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${Math.max(1, m)}m`;
}

export function LandingPage({
  onStart,
  canPlay = true,
  statusMessage,
  quarterLabel,
  challengeActive = false,
  deviceLocked = false,
  msUntilStart = 0,
}: LandingPageProps) {
  const [isWarping, setIsWarping] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleStartClick = () => { if (!canPlay) return; setIsWarping(true); };
  const handleWarpComplete = () => { setIsWarping(false); onStart(); };

  // SSR skeleton — matches the mounted layout exactly
  if (!mounted) {
    return (
      <div className="w-full min-h-full md:h-full flex flex-col items-center justify-center text-center px-6 py-16 md:py-0">
        <p style={{ ...PP, color: "#E5E7EB", fontSize: "1rem", letterSpacing: "0.15em", fontWeight: 500 }}>
          ICAI ATLANTA CHAPTER
        </p>
        <p style={{ ...PP, color: "#F6C453", fontSize: "0.85rem", letterSpacing: "0.2em", fontStyle: "italic" }}>
          Presents
        </p>
        <h1 style={{ ...PP, color: "#F6C453", fontSize: "clamp(3rem,9vw,7rem)", fontWeight: 700, lineHeight: 1, marginTop: "1rem" }}>
          MASTERMIND<br />LEAGUE
        </h1>
      </div>
    );
  }

  return (
    <>
      {/* Video background — unique to landing; SpotlightBackground+CursorTrail come from GameLayout */}
      <VideoBackground />

      {/* Warp overlay */}
      <AnimatePresence>
        {isWarping && <WarpTransition key="warp" onComplete={handleWarpComplete} />}
      </AnimatePresence>

      {/* First Edition badge — slides from right */}
      <motion.div
        {...slideFromRight(3.6, 1.2)}
        className="fixed top-4 right-5 z-40"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{
            background: "rgba(246,196,83,0.1)",
            border: "1px solid rgba(246,196,83,0.35)",
            boxShadow: "0 0 14px rgba(246,196,83,0.12)",
          }}
        >
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0"
            style={{ background: "#F6C453" }}
          />
          <span style={{ ...PP, color: "#F6C453", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            First Challenge · April 2026
          </span>
        </div>
      </motion.div>

      {/* Hero — fills the available height, centered */}
      <div
        className="w-full min-h-full md:h-full flex flex-col items-center justify-center text-center px-6 gap-5 md:gap-6 py-16 md:py-0 overflow-y-auto md:overflow-hidden"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* 1. ICAI Atlanta Chapter Presents — cinematic zoom */}
        <motion.div
          initial={{ scale: 4.2, opacity: 0 }}
          animate={{ scale: [4.2, 2.4, 1.9, 1.0], opacity: [0, 1, 1, 1], y: [0, -6, -4, 0] }}
          transition={{ duration: 2.2, times: [0, 0.25, 0.60, 1.0], ease: "easeOut" }}
          style={{ transformOrigin: "50% 50%" }}
        >
          <p style={{ ...PP, color: "#E5E7EB", fontSize: "clamp(0.95rem,2.2vw,1.5rem)", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", lineHeight: 1.4 }}>
            ICAI Atlanta Chapter
          </p>
          <p style={{ ...PP, color: "#F6C453", fontSize: "clamp(0.75rem,1.6vw,1.15rem)", fontWeight: 400, letterSpacing: "0.3em", fontStyle: "italic", lineHeight: 1.4 }}>
            Presents
          </p>
        </motion.div>

        {/* 2. MASTERMIND LEAGUE */}
        <AnimatedTitle />

        {/* 3. Quarterly Knowledge Challenge pill + season status */}
        <motion.div {...slideUp(4.4, 1.2)} className="flex flex-col items-center gap-2">
          <div
            className="relative inline-flex items-center gap-3 px-6 py-2.5 rounded-full overflow-hidden"
            style={{ background: "rgba(246,196,83,0.07)", border: "1px solid rgba(246,196,83,0.28)" }}
          >
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 20%, rgba(246,196,83,0.14) 50%, transparent 80%)" }}
              animate={{ x: ["-130%", "230%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "linear", delay: 5.5 }}
            />
            <span style={{ ...PP, color: "#F6C453", fontSize: "clamp(0.65rem,1.3vw,0.82rem)", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              ✦&nbsp;&nbsp;The Quarterly Knowledge Challenge&nbsp;&nbsp;✦
            </span>
          </div>
          {quarterLabel && challengeActive && canPlay && (
            <p style={{ ...PP, color: "#B1C9EB", fontSize: "0.8rem", fontWeight: 500 }}>
              {quarterLabel}
            </p>
          )}
          {!challengeActive && msUntilStart > 0 && (
            <p style={{ ...PP, color: "#F6C453", fontSize: "0.8rem", fontWeight: 500 }}>
              Opens in {formatCountdown(msUntilStart)}
            </p>
          )}
        </motion.div>

        {/* 4. Quote */}
        <motion.p
          {...fadeIn(5.2, 1.0)}
          className="max-w-3xl"
          style={{ ...PP, color: "#D1D5DB", fontSize: "clamp(0.85rem,1.5vw,1.05rem)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.7 }}
        >
          <span style={{ color: "#F6C453", opacity: 0.55, fontSize: "1.5em", lineHeight: 0, verticalAlign: "middle" }}>❝&nbsp;</span>
          Knowledge is the new currency. Are you ready to become the Mastermind?
          <span style={{ color: "#F6C453", opacity: 0.55, fontSize: "1.5em", lineHeight: 0, verticalAlign: "middle" }}>&nbsp;❞</span>
        </motion.p>

        {/* 5. CTA button */}
        <div className="flex flex-col items-center gap-2 max-w-md">
          {!canPlay && statusMessage && (
            <motion.p
              {...fadeIn(5.6)}
              className="text-center px-2"
              style={{ ...PP, color: "#F6C453", fontSize: "0.875rem", fontWeight: 500 }}
            >
              {deviceLocked
                ? "You have already attempted the challenge."
                : statusMessage}
            </motion.p>
          )}
          <EnhancedStartButton onClick={handleStartClick} disabled={!canPlay} delay={5.8}>
            {canPlay ? "Enter the League ⚡" : "Unavailable"}
          </EnhancedStartButton>
        </div>
      </div>
    </>
  );
}
