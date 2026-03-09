"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { AnimatedButton } from "../components/AnimatedButton";
import { Leaderboard } from "../components/Leaderboard";
import { useGameStore } from "../store/gameStore";
import { useCanPlayThisQuarter } from "../hooks/useQuarterRestrictionSync";
import { addToLeaderboard, getLeaderboard } from "../services/leaderboardService";
import { recordLastPlayedQuarter, clearGameState } from "../services/gameService";
import { getCurrentQuarter, getCurrentYear } from "../utils/helpers";
import type { LeaderboardEntry } from "../types/gameTypes";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const EASE = [0.33, 1, 0.68, 1] as const;

function getPlayerTitle(score: number): { title: string; icon: string; color: string } {
  if (score >= 81) return { title: "Mastermind", icon: "🧠", color: "#E8E9E4" };
  if (score >= 51) return { title: "Scholar", icon: "📚", color: "#FFBD59" };
  return { title: "Rising Star", icon: "⭐", color: "#B1C9EB" };
}

export function ResultPage() {
  const { score, resetGame, setPhase } = useGameStore();
  const { canPlay, currentQuarter, currentYear } = useCanPlayThisQuarter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiSize, setConfettiSize] = useState({ width: 800, height: 600 });
  const [showScore, setShowScore] = useState(false);

  const playerTitle = getPlayerTitle(score);

  useEffect(() => {
    addToLeaderboard("Player", score).then(setLeaderboard);
    recordLastPlayedQuarter(getCurrentQuarter());
  }, [score]);

  useEffect(() => {
    getLeaderboard().then(setLeaderboard);
  }, []);

  useEffect(() => {
    setShowConfetti(true);
    setConfettiSize({ width: window.innerWidth, height: window.innerHeight });
    const stop = setTimeout(() => setShowConfetti(false), 5000);
    const scoreDelay = setTimeout(() => setShowScore(true), 600);
    return () => {
      clearTimeout(stop);
      clearTimeout(scoreDelay);
    };
  }, []);

  const handlePlayAgain = () => {
    if (!canPlay) return;
    clearGameState();
    resetGame();
    setPhase("landing");
  };

  const currentRank =
    leaderboard.find((e) => e.score === score)?.rank ?? leaderboard.length + 1;

  return (
    <div className="max-w-2xl mx-auto">
      {showConfetti && (
        <Confetti
          width={confettiSize.width}
          height={confettiSize.height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.35}
          wind={0.015}
          initialVelocityX={12}
          initialVelocityY={18}
          colors={["#FFBD59", "#B1C9EB", "#145886", "#E8E9E4", "#0A0147"]}
        />
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 14 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-black text-icai-light-grey mb-2">
          Challenge Complete!
        </h1>
        <p className="text-icai-light-blue text-sm md:text-base">
          You&apos;ve completed the ICAI Atlanta Mastermind League.
        </p>
      </motion.div>

      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.88 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.85, type: "spring", stiffness: 160, damping: 18 }}
        className="rounded-2xl p-8 mb-6 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(10,1,71,0.9) 0%, rgba(20,88,134,0.4) 100%)",
          border: "1px solid rgba(255,189,89,0.4)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Top gold line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,189,89,0.8), transparent)",
          }}
        />

        {/* Player title badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 16 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
          style={{
            background: "rgba(255,189,89,0.12)",
            border: "1px solid rgba(255,189,89,0.4)",
          }}
        >
          <span className="text-xl">{playerTitle.icon}</span>
          <span className="font-bold text-sm" style={{ color: playerTitle.color }}>
            {playerTitle.title}
          </span>
        </motion.div>

        <p className="text-icai-light-blue/70 text-sm mb-2 font-medium">FINAL SCORE</p>

        <AnimatePresence>
          {showScore && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className="mb-2"
            >
              <span
                className="text-5xl md:text-7xl font-black"
                style={{
                  background: "linear-gradient(to bottom, #FFBD59, #D4940F)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 20px rgba(255,189,89,0.4))",
                }}
              >
                <CountUp end={score} duration={1.8} preserveValue />
              </span>
              <span className="text-icai-light-blue/60 text-xl font-medium ml-1">/ 100</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="flex justify-center gap-6 mt-6"
        >
          <div>
            <p className="text-icai-light-blue/50 text-xs mb-0.5">Leaderboard Rank</p>
            <p className="text-icai-yellow font-black text-2xl">#{currentRank}</p>
          </div>
          <div className="w-px bg-icai-blue/30" />
          <div>
            <p className="text-icai-light-blue/50 text-xs mb-0.5">Quarter</p>
            <p className="text-icai-light-grey font-bold text-2xl">Q{currentQuarter}</p>
          </div>
          <div className="w-px bg-icai-blue/30" />
          <div>
            <p className="text-icai-light-blue/50 text-xs mb-0.5">Year</p>
            <p className="text-icai-light-grey font-bold text-2xl">{getCurrentYear()}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Quote */}
      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        className="text-center text-icai-light-blue/70 italic text-sm md:text-base mb-4 px-4"
      >
        &ldquo;Great finance professionals don&apos;t just manage numbers — they master them.&rdquo;
      </motion.blockquote>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="text-center text-icai-yellow font-semibold mb-8 text-sm"
      >
        Will you be ICAI Atlanta&apos;s next Mastermind Champion? 🏆
      </motion.p>

      {/* Play again button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 150, damping: 18 }}
        className="flex justify-center mb-12"
      >
        <AnimatedButton onClick={handlePlayAgain} disabled={!canPlay}>
          {canPlay
            ? "PLAY AGAIN"
            : `Next: Q${currentQuarter} ${currentYear + 1}`}
        </AnimatedButton>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.7, ease: EASE }}
      >
        <Leaderboard entries={leaderboard} currentScore={score} />
      </motion.div>
    </div>
  );
}
