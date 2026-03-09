"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AnimatedTitle,
  HolographicQuoteCard,
  EnhancedStartButton,
  WarpTransition,
  CursorTrail,
} from "../components/landing";
import { SpotlightBackground } from "../components/SpotlightBackground";
import { VideoBackground } from "../components/VideoBackground";

const EASE = [0.33, 1, 0.68, 1] as const;

interface LandingPageProps {
  onStart: () => void;
  canPlay?: boolean;
  nextQuarterInfo?: string;
}

export function LandingPage({ onStart, canPlay = true, nextQuarterInfo }: LandingPageProps) {
  const [isWarping, setIsWarping] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartClick = () => {
    if (!canPlay) return;
    setIsWarping(true);
  };

  const handleWarpComplete = () => {
    setIsWarping(false);
    onStart();
  };

  if (!mounted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-icai-light-blue text-lg md:text-xl mb-2 tracking-widest uppercase text-sm">
          ICAI Atlanta Chapter
        </p>
        <p className="text-icai-light-blue/50 text-xs mb-8 tracking-[0.3em]">PRESENTS</p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-icai-light-grey mb-3 tracking-tight leading-tight">
          MASTERMIND
          <br />
          <span className="text-icai-yellow">LEAGUE</span>
        </h1>
        <p className="text-icai-light-blue text-lg md:text-xl font-medium mb-8">
          The Quarterly Knowledge Challenge
        </p>
      </div>
    );
  }

  return (
    <>
      <VideoBackground />
      <SpotlightBackground />
      <CursorTrail />

      <AnimatePresence>
        {isWarping && (
          <WarpTransition key="warp" onComplete={handleWarpComplete} />
        )}
      </AnimatePresence>

      <div className="min-h-[92vh] flex flex-col items-center justify-center text-center px-4 relative" style={{ zIndex: 1 }}>
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
          className="mb-2"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(20, 88, 134, 0.25)",
              border: "1px solid rgba(177, 201, 235, 0.25)",
              color: "#B1C9EB",
            }}
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-icai-yellow inline-block"
            />
            First Edition · April 2026
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
          className="mb-1"
        >
          <p className="text-icai-light-blue/90 text-xs md:text-sm tracking-[0.35em] uppercase font-semibold">
            ICAI Atlanta Chapter
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-icai-light-blue/40 text-xs tracking-[0.5em] uppercase">Presents</p>
        </motion.section>

        {/* Animated main title */}
        <AnimatedTitle />

        {/* Subtitle pill */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 2.05, duration: 0.9, ease: EASE }}
          style={{ transformOrigin: "center" }}
          className="mb-12"
        >
          <div className="relative inline-flex items-center gap-3 px-6 py-2.5 overflow-hidden rounded-full">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "rgba(255, 189, 89, 0.08)",
                border: "1px solid rgba(255, 189, 89, 0.35)",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 20%, rgba(255,189,89,0.15) 50%, transparent 80%)",
              }}
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "linear", delay: 2.5 }}
            />
            <span className="relative text-icai-yellow text-xs md:text-sm font-semibold tracking-[0.2em] uppercase">
              ✦ The Quarterly Knowledge Challenge ✦
            </span>
          </div>
        </motion.div>

        <HolographicQuoteCard>
          &ldquo;Knowledge is the new currency. Are you ready to prove your worth?&rdquo;
        </HolographicQuoteCard>

        <section className="flex flex-col items-center">
          {!canPlay && nextQuarterInfo && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-icai-yellow/90 text-sm mb-4 font-medium"
            >
              You&apos;ve already played this quarter. Come back next quarter!
            </motion.p>
          )}
          <EnhancedStartButton onClick={handleStartClick} disabled={!canPlay}>
            {canPlay ? "START GAME" : "ALREADY PLAYED"}
          </EnhancedStartButton>
        </section>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ delay: 3.2, duration: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-px h-8"
              style={{
                background: "linear-gradient(to bottom, transparent, rgba(177,201,235,0.6))",
              }}
            />
            <div className="w-1.5 h-1.5 rounded-full bg-icai-light-blue/60" />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
