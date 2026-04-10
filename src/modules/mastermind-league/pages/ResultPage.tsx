"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";
import { TitlesPodium } from "../components/TitlesPodium";
import { useGameStore } from "../store/gameStore";
import { useChallengeAccess } from "../hooks/useChallengeAccess";
import { addToLeaderboard, getLeaderboard } from "../services/leaderboardService";
import { ENFORCE_SINGLE_PLAY } from "../services/registrationService";
import { CHALLENGE_YEAR } from "../utils/challengeSchedule";
import {
  TOTAL_GAME_MAX_POINTS,
  MAX_SCORE_ROUND_1,
  MAX_SCORE_ROUND_2,
  MAX_SCORE_ROUND_3_CAP,
} from "../utils/scoring";
import type { LeaderboardEntry } from "../types/gameTypes";
import { useSoundEffects } from "../hooks/useSoundSystem";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const LOTTIE_SRC =
  "https://lottie.host/660f6f99-d850-4cb3-922c-323e53f0ef41/lLVJ2UU7VD.lottie";
const TROPHY_LOTTIE_SRC =
  "https://lottie.host/188853c8-9ebc-4022-a4fb-22818baaba2e/Ns41jas4eR.lottie";
const EASE = [0.33, 1, 0.68, 1] as const;

const MAX_ROUND_SCORES = [
  MAX_SCORE_ROUND_1,
  MAX_SCORE_ROUND_2,
  MAX_SCORE_ROUND_3_CAP,
] as const;

const TOTAL_MAX = TOTAL_GAME_MAX_POINTS;

const ROUND_LABELS = [
  { name: "Analyst Arena", icon: "📊", color: "#FFBD59" },
  { name: "Myth or Fact", icon: "⚖️", color: "#B1C9EB" },
  { name: "Lightning Round", icon: "⚡", color: "#FF9F43" },
] as const;

function getPlayerTitle(score: number) {
  if (score >= 66) return { title: "Mastermind", icon: "🧠", color: "#E8E9E4" };
  if (score >= 33) return { title: "Scholar", icon: "📚", color: "#FFBD59" };
  return { title: "Rising Star", icon: "⭐", color: "#B1C9EB" };
}

// ── Circular progress ──────────────────────────────────────────────────────────
function CircularProgress({ score, maxScore }: { score: number; maxScore: number }) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(score / maxScore, 1);
  const offset = circumference * (1 - pct);

  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0">
      <svg width="176" height="176" viewBox="0 0 176 176">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFBD59" />
            <stop offset="100%" stopColor="#FF6B35" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx="88" cy="88" r={radius}
          fill="none" stroke="rgba(20,88,134,0.25)" strokeWidth="10"
        />
        {/* Soft outer glow ring */}
        <circle
          cx="88" cy="88" r={radius}
          fill="none" stroke="rgba(255,189,89,0.06)" strokeWidth="20"
        />
        {/* Progress arc */}
        <motion.circle
          cx="88" cy="88" r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
          transform="rotate(-90 88 88)"
          style={{ filter: "drop-shadow(0 0 8px rgba(255,189,89,0.55))" }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-icai-light-blue/50">
          Score
        </p>
        <span
          className="text-4xl font-black tabular-nums leading-none"
          style={{
            background: "linear-gradient(to bottom, #FFBD59, #D4940F)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 14px rgba(255,189,89,0.5))",
          }}
        >
          <CountUp end={score} duration={2} preserveValue />
        </span>
        <span className="text-icai-light-blue/40 text-xs font-medium">/ {maxScore}</span>
      </div>
    </div>
  );
}

// ── Coin reward burst ──────────────────────────────────────────────────────────
function CoinReward({ score }: { score: number }) {
  const coins = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: ((i % 4) - 1.5) * 60 + (Math.random() - 0.5) * 25,
    delay: i * 0.12,
    rotate: (Math.random() - 0.5) * 480,
  }));

  return (
    <div className="relative flex items-center justify-center h-28 overflow-visible pointer-events-none mt-2">
      {coins.map((coin) => (
        <motion.span
          key={coin.id}
          className="absolute text-2xl select-none"
          initial={{ y: -10, x: coin.x, opacity: 1, scale: 0, rotate: 0 }}
          animate={{
            y: [0, 40, 80, 115],
            opacity: [1, 1, 0.8, 0],
            scale: [0, 1.4, 1.1, 0.8],
            rotate: coin.rotate,
          }}
          transition={{ duration: 2.8, delay: coin.delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          🪙
        </motion.span>
      ))}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 10 }}
        animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1], y: 0 }}
        transition={{ duration: 0.65, delay: 0.4, type: "spring", stiffness: 260, damping: 16 }}
        className="relative z-10 px-6 py-2.5 rounded-full font-black text-lg"
        style={{
          background: "linear-gradient(135deg, rgba(255,189,89,0.22), rgba(255,189,89,0.08))",
          border: "1.5px solid rgba(255,189,89,0.65)",
          color: "#FFBD59",
          textShadow: "0 0 18px rgba(255,189,89,0.95)",
          boxShadow: "0 0 28px rgba(255,189,89,0.25)",
        }}
      >
        +{score} pts
      </motion.div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export function ResultPage() {
  const { score, roundScores, playerProfile, disqualified } = useGameStore();
  const { quarterLabel } = useChallengeAccess();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLottie, setShowLottie] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiSize, setConfettiSize] = useState({ width: 800, height: 600 });
  const [showScore, setShowScore] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const lottieTransitioned = useRef(false);
  const dotLottieRef = useRef<DotLottie | null>(null);

  const playerTitle = getPlayerTitle(score);
  const { playCoinReward } = useSoundEffects();

  // Derive effective round scores — fall back to proportional split if not tracked yet
  const effectiveRoundScores: [number, number, number] =
    roundScores.every((s) => s === 0) && score > 0
      ? (MAX_ROUND_SCORES.map((max) =>
          Math.round((max / TOTAL_MAX) * score)
        ) as [number, number, number])
      : roundScores;

  const accuracy = TOTAL_MAX > 0 ? Math.round((score / TOTAL_MAX) * 100) : 0;
  const maxRoundScore = Math.max(...effectiveRoundScores);
  const bestRoundIndices = effectiveRoundScores
    .map((s, i) => (s === maxRoundScore ? i : -1))
    .filter((i) => i >= 0);
  const bestRoundIdx = bestRoundIndices[0] ?? 0;
  const bestRoundLabel =
    maxRoundScore <= 0
      ? "—"
      : bestRoundIndices.length > 1
        ? `Tie: ${bestRoundIndices.map((i) => `Round ${i + 1}`).join(" & ")}`
        : `Round ${bestRoundIdx + 1}`;

  useEffect(() => {
    const submitKey = `mastermind_result_submitted_${playerProfile?.email ?? "anon"}`;
    if (
      ENFORCE_SINGLE_PLAY &&
      typeof window !== "undefined" &&
      sessionStorage.getItem(submitKey)
    ) {
      getLeaderboard().then(setLeaderboard);
      return;
    }
    if (ENFORCE_SINGLE_PLAY && typeof window !== "undefined") {
      sessionStorage.setItem(submitKey, "1");
    }
    const displayName = playerProfile
      ? `${playerProfile.firstName} ${playerProfile.lastName}`.trim()
      : "Player";
    addToLeaderboard(displayName, score, {
      chapter: playerProfile?.chapter ?? undefined,
      disqualified,
    }).then(setLeaderboard);
  }, [score, playerProfile?.email, disqualified]);

  const handleLottieComplete = useCallback(() => {
    if (lottieTransitioned.current) return;
    lottieTransitioned.current = true;
    setShowLottie(false);
    setConfettiSize({ width: window.innerWidth, height: window.innerHeight });
    setShowConfetti(true);
    setTimeout(() => setShowScore(true), 500);
    setTimeout(() => {
      setShowReward(true);
      playCoinReward();
    }, 2600);
    setTimeout(() => setShowConfetti(false), 5500);
  }, [playCoinReward]);

  // Attach Lottie complete event via ref callback
  const handleDotLottieRef = useCallback(
    (instance: DotLottie | null) => {
      if (dotLottieRef.current) {
        dotLottieRef.current.removeEventListener("complete", handleLottieComplete);
      }
      dotLottieRef.current = instance;
      if (instance) {
        instance.addEventListener("complete", handleLottieComplete);
      }
    },
    [handleLottieComplete]
  );

  // Safety fallback — transition even if Lottie onComplete doesn't fire
  useEffect(() => {
    const t = setTimeout(() => handleLottieComplete(), 4200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShareScore = async () => {
    const text = `I scored ${score}/${TOTAL_MAX} on the ICAI Atlanta Mastermind League! 🧠🏆 Can you beat me?`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "ICAI Mastermind League", text });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // Silently ignore share/clipboard errors
    }
  };

  const displayName = playerProfile
    ? `${playerProfile.firstName} ${playerProfile.lastName}`.trim()
    : "Player";
  const currentEntry = leaderboard.find(
    (e) =>
      e.playerName === displayName &&
      Boolean(e.disqualified) === disqualified &&
      (disqualified ? e.displayScore === score : e.score === score)
  );
  const currentRank = currentEntry?.rank ?? leaderboard.length + 1;

  return (
    <>
      {/* ── Lottie celebration overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {showLottie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(4,6,20,0.93)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{ width: "min(90vw, 580px)", height: "min(90vw, 580px)" }}
            >
              <DotLottieReact
                src={LOTTIE_SRC}
                autoplay
                loop={false}
                dotLottieRefCallback={handleDotLottieRef}
                style={{ width: "100%", height: "100%" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confetti ─────────────────────────────────────────────────────────── */}
      {showConfetti && (
        <Confetti
          width={confettiSize.width}
          height={confettiSize.height}
          recycle={false}
          numberOfPieces={280}
          gravity={0.28}
          wind={0.012}
          initialVelocityX={13}
          initialVelocityY={20}
          colors={["#FFBD59", "#B1C9EB", "#145886", "#E8E9E4", "#FF6B35", "#FFD966"]}
        />
      )}

      <div className="w-full h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-10">
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.7, ease: EASE }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 220, damping: 14 }}
            className="mx-auto mb-2"
            style={{ width: 100, height: 100 }}
          >
            <DotLottieReact
              src={TROPHY_LOTTIE_SRC}
              autoplay
              loop
              style={{ width: "100%", height: "100%" }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.6, ease: EASE }}
            className="text-4xl md:text-5xl font-black mb-3 leading-tight"
            style={{
              background: "linear-gradient(135deg, #FFD966 0%, #FFBD59 50%, #FF9F43 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 22px rgba(255,189,89,0.55))",
            }}
          >
            Challenge Conquered!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="text-icai-light-blue text-sm md:text-base mb-4"
          >
            You&apos;ve completed the ICAI Atlanta Mastermind League.
          </motion.p>

          {/* Player title badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.72, type: "spring", stiffness: 200, damping: 16 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(255,189,89,0.1)",
              border: "1px solid rgba(255,189,89,0.35)",
            }}
          >
            <span className="text-lg">{playerTitle.icon}</span>
            <span className="font-bold text-sm" style={{ color: playerTitle.color }}>
              {playerTitle.title}
            </span>
          </motion.div>
        </motion.div>

        {disqualified && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4 mb-5 text-center"
            style={{
              background: "rgba(180, 50, 50, 0.15)",
              border: "1px solid rgba(248, 113, 113, 0.45)",
            }}
          >
            <p className="text-red-200 font-bold text-sm">
              Disqualified — too many tab switches. Your leaderboard entry reflects a forfeited score.
            </p>
          </motion.div>
        )}

        {/* ── Score dashboard ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.8, type: "spring", stiffness: 140, damping: 18 }}
          className="rounded-2xl p-7 mb-5 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, rgba(10,1,71,0.92) 0%, rgba(20,88,134,0.4) 100%)",
            border: "1px solid rgba(255,189,89,0.35)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Top shimmer line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,189,89,0.75), transparent)",
            }}
          />

          <div className="flex flex-col sm:flex-row items-center gap-7">
            {/* Circular progress */}
            <AnimatePresence>
              {showScore && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  <CircularProgress score={score} maxScore={TOTAL_MAX} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats column */}
            <div className="flex-1 w-full space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Rank", value: `#${currentRank}`, gold: true },
                  {
                    label: "Season",
                    value: quarterLabel ?? `—`,
                    gold: false,
                  },
                  { label: "Year", value: String(CHALLENGE_YEAR), gold: false },
                ].map(({ label, value, gold }) => (
                  <div
                    key={label}
                    className="text-center py-2 rounded-xl"
                    style={{ background: "rgba(20,88,134,0.12)" }}
                  >
                    <p className="text-icai-light-blue/45 text-[10px] tracking-wider uppercase mb-1">
                      {label}
                    </p>
                    <p
                      className="font-black text-xl"
                      style={{ color: gold ? "#FFBD59" : "#E8E9E4" }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Round breakdown ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: EASE }}
          className="rounded-2xl p-6 mb-5"
          style={{
            background:
              "linear-gradient(160deg, rgba(10,1,71,0.88) 0%, rgba(20,88,134,0.3) 100%)",
            border: "1px solid rgba(20,88,134,0.4)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h3 className="text-icai-yellow font-bold text-xs tracking-widest uppercase mb-5">
            📊 Round Breakdown
          </h3>
          <div
            className="mb-5 px-4 py-3 rounded-xl font-bold text-sm"
            style={{
              background: "rgba(255,189,89,0.1)",
              border: "1px solid rgba(255,189,89,0.35)",
              color: "#FFBD59",
            }}
          >
            Best round:{" "}
            <span className="text-icai-light-grey">{bestRoundLabel}</span>
            <span className="text-icai-light-blue/60 font-medium text-xs ml-2">
              ({maxRoundScore} pts)
            </span>
          </div>
          <div className="space-y-5">
            {ROUND_LABELS.map(({ name, icon, color }, idx) => {
              const roundScore = effectiveRoundScores[idx] ?? 0;
              const maxScore = MAX_ROUND_SCORES[idx] ?? 1;
              const pct = (roundScore / maxScore) * 100;
              const isBest = effectiveRoundScores[idx] === maxRoundScore && maxRoundScore > 0;
              return (
                <div key={name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-icai-light-blue/85 text-sm font-semibold">
                      {icon} {name}
                      {isBest && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-icai-yellow/90">
                          Best
                        </span>
                      )}
                    </span>
                    <span className="font-black text-sm tabular-nums" style={{ color }}>
                      {roundScore}
                      <span className="text-icai-light-blue/35 font-normal text-xs ml-1">
                        / {maxScore}
                      </span>
                    </span>
                  </div>
                  <div
                    className="h-3 rounded-full overflow-hidden"
                    style={{ background: "rgba(20,88,134,0.22)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(2, pct)}%` }}
                      transition={{
                        duration: 1.1,
                        ease: "easeOut",
                        delay: 1.0 + idx * 0.18,
                      }}
                      style={{
                        background: `linear-gradient(90deg, ${color}, ${color}99)`,
                        boxShadow: `0 0 8px ${color}55`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Champion message ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.95, duration: 0.65, ease: EASE }}
          className="text-center rounded-2xl p-7 mb-5"
          style={{
            background:
              "linear-gradient(160deg, rgba(10,1,71,0.82) 0%, rgba(20,88,134,0.22) 100%)",
            border: "1px solid rgba(255,189,89,0.22)",
          }}
        >
          <motion.p
            animate={{
              textShadow: [
                "0 0 18px rgba(255,189,89,0.45)",
                "0 0 44px rgba(255,189,89,0.95)",
                "0 0 18px rgba(255,189,89,0.45)",
              ],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="text-xl md:text-2xl font-black leading-snug"
            style={{ color: "#FFBD59", letterSpacing: "0.02em" }}
          >
            Can{" "}
            <span
              style={{
                fontSize: "1.25em",
                background: "linear-gradient(135deg, #FFD966, #FFBD59)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              YOU
            </span>{" "}
            become ICAI Atlanta&apos;s next{" "}
            <span style={{ fontSize: "1.1em" }}>Mastermind Champion</span>?
          </motion.p>
          <p className="text-icai-light-blue/45 text-xs mt-3 italic">
            &ldquo;Great finance professionals don&apos;t just manage numbers — they master them.&rdquo;
          </p>
        </motion.div>

        {/* ── Leaderboard titles — podium layout ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.45, ease: EASE }}
          className="rounded-2xl p-6 mb-6 relative"
          style={{
            background:
              "linear-gradient(160deg, rgba(10,1,71,0.88) 0%, rgba(20,88,134,0.3) 100%)",
            border: "1px solid rgba(20,88,134,0.4)",
            backdropFilter: "blur(12px)",
            transform: "translateZ(0)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(177,201,235,0.3), transparent)",
            }}
          />
          <h3 className="text-icai-yellow font-bold text-xs tracking-widest uppercase mb-2 text-center">
            🏆 Leaderboard titles
          </h3>
          <p className="text-icai-light-blue/55 text-center text-xs mb-6">
            Where your score places you this season
          </p>
          <TitlesPodium />
        </motion.div>

        {/* ── Action buttons ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 150, damping: 18 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShareScore}
            className="px-7 py-4 rounded-xl font-bold text-sm tracking-wide"
            style={{
              background: "rgba(20,88,134,0.15)",
              border: "1px solid rgba(20,88,134,0.4)",
              color: "#B1C9EB",
              cursor: "pointer",
            }}
          >
            📤 Share Score
          </motion.button>
        </motion.div>
      </div>
      </div>
    </>
  );
}
