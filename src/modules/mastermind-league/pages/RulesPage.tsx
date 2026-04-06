"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import type { DotLottie } from "@lottiefiles/dotlottie-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AnimatedButton } from "../components/AnimatedButton";
import { ChallengeRegistrationModal } from "../components/ChallengeRegistrationModal";
import type { PlayerProfile } from "../types/gameTypes";

/** DotLottie file URL (from embed: lottie.host/embed/.../I4bF7I9cDV.lottie) */
const RULES_HERO_LOTTIE_SRC =
  "https://lottie.host/69281a4b-07e3-4204-8925-b33a8e483b9d/I4bF7I9cDV.lottie";

const EASE = [0.33, 1, 0.68, 1] as const;

const ROUNDS = [
  {
    number: 1,
    tag: "MCQ",
    title: "The Analyst Arena",
    lottieUrl:
      "https://lottie.host/808ea013-e2db-43c6-bc53-0673fb8af710/l6rmMtFfrx.lottie",
    questions: 5,
    points: "5 pts each",
    time: "30s / Q",
    accentColor: "rgba(74,158,204,0.8)",
    borderColor: "rgba(255,189,89,0.35)",
    glowColor: "rgba(74,158,204,0.4)",
    glowColorRaw: "74,158,204",
    cardBg: "linear-gradient(155deg, rgba(20,88,134,0.28) 0%, rgba(15,14,12,0.92) 100%)",
    spotlightBg: "linear-gradient(155deg, rgba(20,88,134,0.5) 0%, rgba(15,14,12,0.96) 100%)",
    spotlightGlow: "0 0 60px rgba(74,158,204,0.5), 0 0 24px rgba(74,158,204,0.3)",
  },
  {
    number: 2,
    tag: "TRUE / FALSE",
    title: "Myth or Fact",
    lottieUrl:
      "https://lottie.host/f2404a81-8441-44bd-b8de-e2957cf7009e/cm2IHgqlGz.lottie",
    questions: 5,
    points: "5 pts each",
    time: "30s / Q",
    accentColor: "rgba(255,189,89,0.8)",
    borderColor: "rgba(255,189,89,0.45)",
    glowColor: "rgba(255,189,89,0.35)",
    glowColorRaw: "255,189,89",
    cardBg: "linear-gradient(155deg, rgba(255,189,89,0.14) 0%, rgba(15,14,12,0.92) 100%)",
    spotlightBg: "linear-gradient(155deg, rgba(255,189,89,0.26) 0%, rgba(15,14,12,0.96) 100%)",
    spotlightGlow: "0 0 60px rgba(255,189,89,0.45), 0 0 24px rgba(255,189,89,0.25)",
  },
  {
    number: 3,
    tag: "MCQ",
    title: "Lightning Round",
    lottieUrl:
      "https://lottie.host/0fb673c5-6b2a-4cdb-984a-8269f2238c2f/ySHbHNZHti.lottie",
    questions: "Max 25",
    points: "2 pts each",
    time: "30s / Q",
    accentColor: "rgba(177,201,235,0.8)",
    borderColor: "rgba(177,201,235,0.4)",
    glowColor: "rgba(177,201,235,0.3)",
    glowColorRaw: "177,201,235",
    cardBg: "linear-gradient(155deg, rgba(177,201,235,0.16) 0%, rgba(15,14,12,0.92) 100%)",
    spotlightBg: "linear-gradient(155deg, rgba(177,201,235,0.3) 0%, rgba(15,14,12,0.96) 100%)",
    spotlightGlow: "0 0 60px rgba(177,201,235,0.4), 0 0 24px rgba(177,201,235,0.25)",
  },
] as const;

const FLOW_STEPS = ["Round 1", "Round 2", "Round 3", "🏆 Champion"] as const;

// ─── Round Card ───────────────────────────────────────────────────────────────

interface RoundCardProps {
  round: (typeof ROUNDS)[number];
  cardAnimate: { opacity: number; scale: number; y: number };
  isSpotlight: boolean;
  bulletVisible: boolean;
  isFlash: boolean;
  isMobile: boolean;
  mobileDelay: number;
}

function RoundCard({
  round,
  cardAnimate,
  isSpotlight,
  bulletVisible,
  isFlash,
  isMobile,
  mobileDelay,
}: RoundCardProps) {
  const dotLottieRef = useRef<DotLottie | null>(null);
  const [hovered, setHovered] = useState(false);

  const handleEnter = useCallback(() => {
    setHovered(true);
    dotLottieRef.current?.setSpeed(2.2);
  }, []);

  const handleLeave = useCallback(() => {
    setHovered(false);
    dotLottieRef.current?.setSpeed(1);
  }, []);

  const lottieSize = isMobile ? 90 : 140;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isMobile ? { opacity: 1, y: 0, scale: 1 } : cardAnimate}
      transition={
        isMobile
          ? { delay: mobileDelay, duration: 0.5, ease: EASE }
          : { duration: 0.65, ease: EASE }
      }
      /* h-full fills the CSS-grid cell so all 3 cards match the tallest */
      className="h-full"
    >
      <div
        className="h-full rounded-2xl overflow-hidden relative cursor-default select-none"
        style={{
          background: isSpotlight ? round.spotlightBg : round.cardBg,
          border: `1px solid ${round.borderColor}`,
          backdropFilter: "blur(18px)",
          boxShadow: isSpotlight
            ? round.spotlightGlow
            : hovered
              ? `0 0 28px ${round.glowColor}`
              : "none",
          transition: "background 0.5s ease, box-shadow 0.4s ease",
        }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {/* Top accent line */}
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${round.accentColor} 50%, transparent 100%)`,
          }}
        />

        {/* Gold shine sweep on hover */}
        <div
          className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
          style={{ borderRadius: "inherit" }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(105deg, transparent 35%, rgba(255,189,89,0.13) 50%, transparent 65%)",
              transform: hovered
                ? "translateX(220%) skewX(-15deg)"
                : "translateX(-130%) skewX(-15deg)",
              transition: hovered ? "transform 0.7s ease-in-out" : "none",
            }}
          />
        </div>

        {/* Border pulse glow on hover */}
        {hovered && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none z-0"
            style={{
              boxShadow: `inset 0 0 0 1px ${round.accentColor}`,
              animation: "borderGlowPulse 1.4s ease-in-out infinite",
            }}
          />
        )}

        {/* Lightning flash for R3 */}
        {isFlash && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none z-30"
            style={{
              background: "rgba(177,201,235,0.25)",
              animation: "lightningFlash 0.4s ease-out forwards",
            }}
          />
        )}

        {/* ── MOBILE: Lottie left, content right ── */}
        {isMobile ? (
          <div className="p-4 flex flex-col gap-3 relative z-10">
            <div className="flex justify-between items-center">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase"
                style={{
                  background: "rgba(15,14,12,0.85)",
                  border: `1px solid ${round.borderColor}`,
                  color: "#FFBD59",
                }}
              >
                {round.tag}
              </span>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${round.accentColor}, rgba(15,14,12,0.95))`,
                  border: `1.5px solid ${round.borderColor}`,
                  color: "#FFBD59",
                }}
              >
                {round.number}
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div
                className="flex-shrink-0 relative"
                style={{ width: lottieSize, height: lottieSize }}
              >
                <div
                  className="absolute rounded-xl pointer-events-none"
                  style={{
                    inset: -3,
                    background: `radial-gradient(ellipse at center, rgba(${round.glowColorRaw},0.14) 0%, transparent 70%)`,
                    animation: "lottieGlowPulse 3s ease-in-out infinite",
                  }}
                />
                <DotLottieReact
                  src={round.lottieUrl}
                  loop
                  autoplay
                  dotLottieRefCallback={(ref) => { dotLottieRef.current = ref; }}
                  style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className="font-black leading-tight mb-1.5"
                  style={{ color: "#FFBD59", fontSize: "18px" }}
                >
                  {round.title}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: "Questions", value: String(round.questions) },
                { label: "Points", value: round.points },
                { label: "Time", value: round.time },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center py-2 px-1 rounded-lg"
                  style={{ background: "rgba(15,14,12,0.75)" }}
                >
                  <p className="text-[#B1C9EB]/60 mb-0.5 leading-none" style={{ fontSize: "10px" }}>
                    {stat.label}
                  </p>
                  <p className="font-bold leading-none" style={{ color: "#FFBD59", fontSize: "14px" }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── DESKTOP: vertical stack ── */
          <div className="p-5 h-full flex flex-col relative z-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-3 flex-shrink-0">
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded tracking-widest uppercase"
                style={{
                  background: "rgba(15,14,12,0.85)",
                  border: `1px solid ${round.borderColor}`,
                  color: "#FFBD59",
                }}
              >
                {round.tag}
              </span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${round.accentColor}, rgba(15,14,12,0.95))`,
                  border: `1.5px solid ${round.borderColor}`,
                  color: "#FFBD59",
                  boxShadow: isSpotlight ? `0 0 14px ${round.glowColor}` : "none",
                }}
              >
                {round.number}
              </div>
            </div>

            {/* Lottie with ambient glow */}
            <div
              className="flex-shrink-0 mb-4 relative flex items-center justify-center"
              style={{ height: lottieSize }}
            >
              <div
                className="absolute rounded-2xl pointer-events-none"
                style={{
                  inset: -4,
                  background: `radial-gradient(ellipse at center, rgba(${round.glowColorRaw},0.12) 0%, transparent 70%)`,
                  animation: "lottieGlowPulse 3s ease-in-out infinite",
                }}
              />
              <DotLottieReact
                src={round.lottieUrl}
                loop
                autoplay
                dotLottieRefCallback={(ref) => { dotLottieRef.current = ref; }}
                style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}
              />
            </div>

            {/* Title */}
            <h3
              className="font-black text-center mb-3 flex-shrink-0 leading-tight"
              style={{ color: "#FFBD59", fontSize: "22px" }}
            >
              {round.title}
            </h3>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 flex-shrink-0">
              {[
                { label: "Questions", value: String(round.questions) },
                { label: "Points", value: round.points },
                { label: "Time", value: round.time },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center py-2.5 px-1 rounded-xl"
                  style={{ background: "rgba(15,14,12,0.75)" }}
                >
                  <p className="text-[#B1C9EB]/60 mb-1 leading-none font-medium" style={{ fontSize: "11px" }}>
                    {stat.label}
                  </p>
                  <p className="font-bold leading-none" style={{ color: "#FFBD59", fontSize: "15px" }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface RulesPageProps {
  onRegistered: (profile: PlayerProfile) => void;
}

export function RulesPage({ onRegistered }: RulesPageProps) {
  const [phase, setPhase] = useState(0);
  const [r3Flash, setR3Flash] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [regOpen, setRegOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setPhase(4);
      return;
    }
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => {
        setPhase(3);
        setR3Flash(true);
        setTimeout(() => setR3Flash(false), 350);
      }, 1600),
      setTimeout(() => setPhase(4), 2300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isMobile]);

  const getCardAnimate = (idx: number) => {
    if (isMobile) return { opacity: 1, scale: 1, y: 0 };
    if (phase <= idx) return { opacity: 0, scale: 0.9, y: 16 };
    if (phase === idx + 1) return { opacity: 1, scale: 1.03, y: 0 };
    return { opacity: 1, scale: 1.0, y: 0 };
  };

  return (
    /*
     * PAGE ROOT — naturally flowing, no fixed height, no overflow:hidden.
     * Sections stack vertically; the page can scroll if viewport is short.
     */
    <div
      className="relative w-full h-full"
      style={{
        background: "#0F0E0C",
        overflowX: "hidden",
        overflowY: "auto",
        zIndex: 20,
      }}
    >
      {/* ── Keyframes ────────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes borderGlowPulse {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 1; }
        }
        @keyframes lottieGlowPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.98); }
          50%       { opacity: 1;   transform: scale(1.04); }
        }
        @keyframes floatDot {
          0%, 100% { transform: translateY(0px)  translateX(0px);  opacity: 0.3; }
          33%       { transform: translateY(-18px) translateX(8px);  opacity: 0.65; }
          66%       { transform: translateY(-9px)  translateX(-6px); opacity: 0.4; }
        }
        @keyframes arrowPulse {
          0%, 100% { opacity: 0.35; transform: translateX(0); }
          50%       { opacity: 1;    transform: translateX(4px); }
        }
        @keyframes trophyGlow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(255,189,89,0.4)); }
          50%       { filter: drop-shadow(0 0 16px rgba(255,189,89,1)); }
        }
        @keyframes lightningFlash {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        .arrow-anim  { animation: arrowPulse 1.2s ease-in-out infinite; }
        .trophy-glow { animation: trophyGlow 2s ease-in-out infinite; }
      `}</style>

      {/* ── Decorative: radial glow (absolute, not layout) ─────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 80% 40% at 50% 0%,   rgba(20,88,134,0.22)  0%, transparent 60%)",
            "radial-gradient(ellipse 40% 30% at 10% 55%,  rgba(20,88,134,0.09)  0%, transparent 60%)",
            "radial-gradient(ellipse 40% 30% at 90% 55%,  rgba(255,189,89,0.07) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      {/* ── Decorative: floating particles (desktop only) ──────────────────── */}
      {!isMobile &&
        Array.from({ length: 14 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              background: i % 2 === 0 ? "rgba(255,189,89,0.45)" : "rgba(177,201,235,0.3)",
              left: `${5 + ((i * 6) % 90)}%`,
              top: `${7 + ((i * 11) % 82)}%`,
              animation: `floatDot ${3 + (i % 4)}s ${i * 0.55}s ease-in-out infinite`,
            }}
          />
        ))}

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════════════════════ */}
      <motion.section
        className="relative z-10 text-center"
        style={{ padding: isMobile ? "32px 20px 0" : "48px 24px 0" }}
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: EASE }}
      >
        <h1
          className="font-black tracking-tight leading-tight mb-2"
          style={{
            fontSize: isMobile ? "clamp(28px, 7vw, 32px)" : "clamp(36px, 3.5vw, 48px)",
            background: "linear-gradient(135deg, #FFFFFF 0%, #FFBD59 50%, #FFD700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Mastermind Challenge
        </h1>

        <p
          className="font-bold tracking-wide mb-2"
          style={{ color: "#FFBD59", fontSize: isMobile ? "16px" : "20px" }}
        >
          3 Rounds. One Champion.
        </p>

        <p
          className="text-[#B1C9EB]/75 mx-auto leading-relaxed"
          style={{ fontSize: isMobile ? "13px" : "15px", maxWidth: 520 }}
        >
          Test your accounting and finance knowledge, compete on the leaderboard,
          and become the{" "}
          <span className="text-[#FFBD59] font-semibold">Annual Mastermind Champion</span>.
        </p>
      </motion.section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 2 — FLOW INDICATOR
      ════════════════════════════════════════════════════════════════════ */}
      <motion.section
        className="relative z-10"
        style={{
          padding: isMobile ? "16px 20px 0" : "20px 24px 0",
          overflowX: isMobile ? "auto" : "visible",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div
          className="flex items-center justify-center gap-2"
          style={{ minWidth: isMobile ? "max-content" : "auto" }}
        >
          {FLOW_STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.38 + i * 0.09, duration: 0.42, ease: EASE }}
                className="font-bold tracking-wide whitespace-nowrap"
                style={{
                  fontSize: isMobile ? "12px" : "13px",
                  padding: isMobile ? "4px 10px" : "5px 12px",
                  borderRadius: 9999,
                  background: i === 3 ? "rgba(255,189,89,0.14)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${i === 3 ? "rgba(255,189,89,0.5)" : "rgba(255,255,255,0.1)"}`,
                  color: i === 3 ? "#FFBD59" : "#B1C9EB",
                }}
              >
                {step}
              </motion.div>
              {i < FLOW_STEPS.length - 1 && (
                <span
                  className="arrow-anim font-bold"
                  style={{ color: "rgba(255,189,89,0.6)", fontSize: isMobile ? "12px" : "15px" }}
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {/* Tab-switch warning (Rules = page 2 in the flow) */}
      <motion.section
        className="relative z-10"
        style={{ padding: isMobile ? "12px 16px 0" : "16px 24px 0" }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        <div
          className="rounded-xl mx-auto text-center"
          style={{
            maxWidth: 640,
            padding: isMobile ? "12px 14px" : "14px 20px",
            background: "rgba(180, 50, 50, 0.12)",
            border: "1px solid rgba(248, 113, 113, 0.35)",
          }}
        >
          <p
            className="font-semibold leading-snug"
            style={{ color: "#FCA5A5", fontSize: isMobile ? "12px" : "13px" }}
          >
            Do not switch tabs during the challenge. Doing so may lead to disqualification.
          </p>
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 3 — ROUND CARDS
          overflow:visible so the spotlight scale-up is never clipped.
      ════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative z-10"
        style={{ padding: isMobile ? "24px 16px 0" : "48px 24px 0" }}
      >
        <div
          style={
            isMobile
              ? { display: "flex", flexDirection: "column", gap: 16 }
              : {
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 24,
                  alignItems: "stretch",
                  overflow: "visible", // allow scale animation to breathe
                }
          }
        >
          {ROUNDS.map((round, idx) => (
            <RoundCard
              key={round.number}
              round={round}
              cardAnimate={getCardAnimate(idx)}
              isSpotlight={!isMobile && phase === idx + 1}
              bulletVisible={isMobile || phase > idx}
              isFlash={!isMobile && idx === 2 && r3Flash}
              isMobile={isMobile}
              mobileDelay={idx * 0.12}
            />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 4 — HERO ANIMATION (same for every player; no leaderboard)
      ════════════════════════════════════════════════════════════════════ */}
      <motion.section
        className="relative z-10"
        style={{ padding: isMobile ? "24px 16px 0" : "40px 24px 0" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: isMobile ? 0.45 : 1.2, duration: 0.55, ease: EASE }}
      >
        <div
          className="rounded-2xl mx-auto flex flex-col items-center"
          style={{
            background: "rgba(10,9,8,0.88)",
            border: "1px solid rgba(255,189,89,0.28)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 40px rgba(255,189,89,0.07), inset 0 1px 0 rgba(255,189,89,0.06)",
            padding: isMobile ? "16px 12px" : "24px 20px",
            maxWidth: 560,
          }}
        >
          <h3
            className="font-black tracking-widest uppercase mb-4 text-center"
            style={{ color: "#FFBD59", letterSpacing: "0.14em", fontSize: isMobile ? "11px" : "12px" }}
          >
            Your path to the top
          </h3>
          <div
            className="w-full flex justify-center"
            style={{
              minHeight: isMobile ? 200 : 280,
              maxWidth: 480,
            }}
          >
            <DotLottieReact
              src={RULES_HERO_LOTTIE_SRC}
              loop
              autoplay
              style={{ width: "100%", height: "min(42vw, 320px)", maxHeight: 360 }}
            />
          </div>
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 5 — ANNUAL CHAMPIONSHIP BANNER
      ════════════════════════════════════════════════════════════════════ */}
      <motion.section
        className="relative z-10"
        style={{ padding: isMobile ? "20px 16px 0" : "24px 24px 0" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: isMobile ? 0.55 : 1.65, duration: 0.5, ease: EASE }}
      >
        <div
          className="rounded-2xl"
          style={{
            background: "linear-gradient(155deg, rgba(20,88,134,0.22) 0%, rgba(10,9,8,0.92) 100%)",
            border: "1px solid rgba(255,189,89,0.28)",
            backdropFilter: "blur(14px)",
            padding: isMobile ? "18px 16px" : "24px 28px",
            maxWidth: 900,
            margin: "0 auto",
            boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
          }}
        >
          <p
            className="font-black uppercase tracking-widest mb-4"
            style={{ color: "#FFBD59", fontSize: "15px", letterSpacing: "0.2em" }}
          >
            How the season works
          </p>
          <ul className="space-y-2" style={{ color: "rgba(232,233,228,0.92)" }}>
            <li className="leading-relaxed" style={{ fontSize: isMobile ? "14px" : "15px" }}>
              <span className="font-bold text-[#FFBD59]">3 challenges in 2026. That’s it.</span>
              {" "}We’ll see you next year 😌
            </li>
            <li className="leading-relaxed" style={{ fontSize: isMobile ? "14px" : "15px" }}>
              Leaderboard updates every quarter, so yes, we are watching.{" "}
            </li>
            <li className="leading-relaxed text-[#B1C9EB]/85" style={{ fontSize: isMobile ? "13px" : "14px" }}>
              Winners announced in the first newsletter of 2027 🏆”
            </li>
          </ul>
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 6 — CTA BUTTON
      ════════════════════════════════════════════════════════════════════ */}
      <motion.section
        className="relative z-10 flex justify-center"
        style={{ padding: isMobile ? "28px 16px 48px" : "40px 24px 60px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: isMobile ? 0.75 : 1.85, duration: 0.5, ease: EASE }}
      >
        {isMobile ? (
          /* Full-width tap target on mobile */
          <motion.button
            onClick={() => setRegOpen(true)}
            className="w-full rounded-xl font-black tracking-wide relative overflow-hidden"
            style={{
              minHeight: 56,
              fontSize: "16px",
              background: "linear-gradient(160deg, #FFBD59 0%, #D4940F 100%)",
              color: "#0A0147",
              boxShadow: "0 4px 24px rgba(255,189,89,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              border: "none",
              cursor: "pointer",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.25) 50%, transparent 75%)",
              }}
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
            />
            <span className="relative z-10">Start the Challenge ⚡</span>
          </motion.button>
        ) : (
          <AnimatedButton onClick={() => setRegOpen(true)}>Start the Challenge ⚡</AnimatedButton>
        )}
      </motion.section>

      <ChallengeRegistrationModal
        open={regOpen}
        onClose={() => setRegOpen(false)}
        onSuccess={(profile) => {
          setRegOpen(false);
          onRegistered(profile);
        }}
      />
    </div>
  );
}
