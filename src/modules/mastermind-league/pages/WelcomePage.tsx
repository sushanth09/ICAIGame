"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const EO = [0.22, 1, 0.36, 1] as const;
const PP = { fontFamily: "var(--font-poppins), sans-serif" } as const;

const C = {
  gold:  "#FFBD59",
  grey:  "#E8E9E4",
  blue:  "#145886",
  lblue: "#B1C9EB",
  bg:    "#0A0147",
} as const;

// ── Minimal floating background elements ──────────────────────────────────
function BackgroundElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none" style={{ zIndex: 0 }}>
      {/* Sparse math formulas at very low opacity */}
      {["∂y/∂x", "Σ xₙ", "β(r) = ∫ f dt", "Fy = ½(A+R)(c)"].map((t, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.04 }}
          transition={{ delay: 0.5 + i * 0.15, duration: 2 }}
          className="absolute font-mono text-white whitespace-nowrap"
          style={{
            left: ["4%", "88%", "6%", "85%"][i],
            top:  ["10%", "15%", "75%", "70%"][i],
            fontSize: 12,
            transform: `rotate(${[-8, 6, -5, 9][i]}deg)`,
          }}
        >
          {t}
        </motion.span>
      ))}
      {/* Subtle radial glow at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(20,88,134,0.12) 0%, transparent 70%)" }}
      />
    </div>
  );
}

// ── Feature card data ──────────────────────────────────────────────────────
const CARDS = [
  {
    title: "Analyst Arena",
    subtitle: "Sharpen your acumen",
    desc: "5 finance MCQs that test your Accounting & Taxation depth",
    color: "#FFBD59",
    glowColor: "rgba(255,189,89,0.25)",
    borderColor: "rgba(255,189,89,0.35)",
    bgColor: "rgba(255,189,89,0.06)",
    icon: (animated: boolean) => (
      <div className="relative flex items-end justify-center gap-1" style={{ height: 48 }}>
        {[40, 55, 70, 60, 75].map((h, i) => (
          <motion.div
            key={i}
            className="w-4 rounded-sm"
            style={{ background: animated ? "#FFBD59" : "rgba(255,189,89,0.4)", originY: 1 }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
          >
            <div style={{ height: (h / 100) * 48, background: animated ? "#FFBD59" : "rgba(255,189,89,0.4)", borderRadius: "2px 2px 0 0" }} />
          </motion.div>
        ))}
        <motion.div
          className="absolute top-0 left-0 right-0"
          animate={animated ? { y: [0, -2, 0] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 80 50" fill="none" width="80" height="50" className="w-full">
            <polyline points="4,38 18,24 32,30 48,14 64,8" stroke="#FFBD59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
            <circle cx="64" cy="8" r="3" fill="#FFBD59" opacity="0.9" />
          </svg>
        </motion.div>
      </div>
    ),
    points: "5 pts",
    time: "30s / Q",
    questions: "5 Qs",
  },
  {
    title: "Quarterly Challenge",
    subtitle: "Compete every season",
    desc: "True / False statements that separate myth from financial fact",
    color: "#B1C9EB",
    glowColor: "rgba(177,201,235,0.2)",
    borderColor: "rgba(177,201,235,0.35)",
    bgColor: "rgba(177,201,235,0.05)",
    icon: (animated: boolean) => (
      <div className="flex items-center justify-center" style={{ height: 48 }}>
        <motion.div
          animate={animated ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 64 54" fill="none" width="64" height="54">
            {/* Scale beam */}
            <motion.line
              x1="8" y1="22" x2="56" y2="22"
              stroke="#B1C9EB" strokeWidth="2" strokeLinecap="round"
              animate={animated ? { rotate: [-8, 8, -8] } : {}}
              style={{ transformOrigin: "32px 22px" }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <line x1="32" y1="8" x2="32" y2="22" stroke="#B1C9EB" strokeWidth="2"/>
            <circle cx="32" cy="8" r="3" fill="#B1C9EB"/>
            {/* Left pan */}
            <path d="M8,22 L4,34 A10,6 0,0,0 16,34 Z" fill="rgba(177,201,235,0.25)" stroke="#B1C9EB" strokeWidth="1.5"/>
            {/* Right pan */}
            <path d="M56,22 L52,34 A10,6 0,0,0 64,34 Z" fill="rgba(177,201,235,0.15)" stroke="#B1C9EB" strokeWidth="1.5" opacity="0.7"/>
            {/* MYTH / FACT labels */}
            <text x="10" y="42" fontSize="7" fill="#B1C9EB" textAnchor="middle" fontWeight="700">MYTH</text>
            <text x="54" y="42" fontSize="7" fill="#FFBD59" textAnchor="middle" fontWeight="700">FACT</text>
          </svg>
        </motion.div>
      </div>
    ),
    points: "5 pts",
    time: "30s / Q",
    questions: "5 Qs",
  },
  {
    title: "Market Glory",
    subtitle: "Rise to the top",
    desc: "Lightning-fast MCQs — race the clock, climb the leaderboard",
    color: "#FF9F43",
    glowColor: "rgba(255,159,67,0.22)",
    borderColor: "rgba(255,159,67,0.38)",
    bgColor: "rgba(255,159,67,0.05)",
    icon: (animated: boolean) => (
      <div className="flex items-center justify-center" style={{ height: 48 }}>
        <motion.span
          className="text-4xl"
          animate={animated ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          ⚡
        </motion.span>
      </div>
    ),
    points: "2 pts",
    time: "60s total",
    questions: "Max 25 Qs",
  },
] as const;

// ── How It Works button ────────────────────────────────────────────────────
function HowItWorksButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      className="relative px-8 py-3 rounded-full font-semibold text-sm overflow-hidden"
      style={{
        ...PP,
        border: `1.5px solid ${C.gold}`,
        color: C.gold,
        letterSpacing: "0.06em",
        background: hovered
          ? "linear-gradient(135deg, rgba(255,189,89,0.18) 0%, rgba(20,88,134,0.25) 100%)"
          : "transparent",
        boxShadow: hovered ? `0 0 28px rgba(255,189,89,0.3)` : "none",
        transition: "background 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      How It Works
      <motion.span
        animate={{ x: hovered ? 3 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="inline-block ml-2"
      >
        →
      </motion.span>
    </motion.button>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
interface WelcomePageProps {
  onContinue: () => void;
}

export function WelcomePage({ onContinue }: WelcomePageProps) {
  return (
    <div
      className="relative w-full min-h-full md:h-full md:overflow-hidden overflow-y-auto flex flex-col items-center justify-center px-4 py-6 md:py-0"
      style={{ zIndex: 1 }}
    >
      <BackgroundElements />

      {/* ICAI logos — fixed bottom-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="fixed bottom-5 right-5 flex items-center gap-2.5 z-10"
      >
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(20,88,134,0.3)", border: "1.5px solid rgba(20,88,134,0.6)" }}>
            <span style={{ color: C.lblue, fontSize: "0.5rem", fontWeight: 700 }}>ICAI</span>
          </div>
          <span style={{ color: C.lblue, fontSize: "0.45rem", opacity: 0.6, ...PP }}>Atlanta</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: "rgba(20,88,134,0.2)", border: "1.5px solid rgba(177,201,235,0.4)" }}>
            <svg viewBox="0 0 40 40" width="36" height="36">
              <circle cx="20" cy="20" r="17" stroke={C.lblue} strokeWidth="1" fill="none" opacity="0.5"/>
              <text x="20" y="16" textAnchor="middle" fontSize="7" fill={C.gold} fontWeight="700">CA</text>
              <text x="20" y="25" textAnchor="middle" fontSize="5" fill={C.lblue} opacity="0.8">INDIA</text>
            </svg>
          </div>
          <span style={{ color: C.lblue, fontSize: "0.45rem", opacity: 0.6, ...PP }}>CA India</span>
        </div>
      </motion.div>

      {/* ── Central content ─────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-5xl z-10 flex flex-col items-center gap-4 md:gap-5">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: EO }}
          className="text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full mb-3"
            style={{ background: "rgba(255,189,89,0.08)", border: "1px solid rgba(255,189,89,0.2)" }}
          >
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: C.gold }}
            />
            <span style={{ ...PP, color: C.gold, fontSize: "0.68rem", letterSpacing: "0.18em", fontWeight: 600 }}>
              ICAI ATLANTA CHAPTER · FIRST Challenge
            </span>
          </div>

          <h1 className="font-black leading-tight mb-1" style={{ ...PP, color: C.gold, fontSize: "clamp(1.5rem, 4vw, 2.4rem)" }}>
            Welcome to Mastermind League
          </h1>
          <p style={{ ...PP, color: C.grey, fontSize: "clamp(0.8rem, 1.6vw, 1rem)", opacity: 0.75 }}>
            Where finance professionals compete not with balance sheets — but with brilliance.
          </p>
        </motion.div>

        {/* ── Gold divider ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.7, ease: EO }}
          className="w-32 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, transformOrigin: "center" }}
        />

        {/* ── Feature Cards (3-column) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 w-full">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.65, ease: EO }}
              whileHover={{ y: -4, boxShadow: `0 12px 36px ${card.glowColor}` }}
              className="rounded-2xl overflow-hidden cursor-default group"
              style={{
                background: `linear-gradient(145deg, rgba(8,4,60,0.9) 0%, rgba(5,2,40,0.95) 100%)`,
                border: `1px solid ${card.borderColor}`,
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
              }}
            >
              {/* Top color accent */}
              <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${card.color}, transparent)` }} />

              <div className="p-4 md:p-5">
                {/* Icon area */}
                <div className="mb-4 flex justify-center">
                  {card.icon(true)}
                </div>

                {/* Title — LARGE and prominent */}
                <h2
                  className="font-black text-center mb-1 leading-tight"
                  style={{
                    ...PP,
                    color: card.color,
                    fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)",
                    textShadow: `0 0 20px ${card.glowColor}`,
                  }}
                >
                  {card.title}
                </h2>
                <p
                  className="text-center text-xs mb-3 font-medium tracking-wide"
                  style={{ ...PP, color: card.color, opacity: 0.7, letterSpacing: "0.08em" }}
                >
                  {card.subtitle}
                </p>

                {/* Description */}
                <p
                  className="text-center text-xs leading-relaxed mb-4"
                  style={{ ...PP, color: C.grey, opacity: 0.65 }}
                >
                  {card.desc}
                </p>

                {/* Stats row */}
                <div className="flex items-center justify-center gap-3">
                  {[
                    { label: card.questions, icon: "❓" },
                    { label: card.points, icon: "🏅" },
                    { label: card.time, icon: "⏱" },
                  ].map(({ label, icon }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg flex-1"
                      style={{ background: card.bgColor, border: `1px solid ${card.borderColor}` }}
                    >
                      <span className="text-xs">{icon}</span>
                      <span style={{ ...PP, color: card.color, fontSize: "0.6rem", fontWeight: 700 }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Play. Compete. Conquer. + CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6, ease: EO }}
          className="flex flex-col items-center gap-3"
        >
          <motion.p
            className="font-black tracking-widest"
            style={{
              ...PP,
              background: "linear-gradient(90deg, #FFBD59 0%, #FFE0A0 50%, #FFBD59 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "clamp(1rem, 2vw, 1.3rem)",
            }}
            animate={{ backgroundPosition: ["0% center", "200% center", "0% center"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            Play. Compete. Conquer.
          </motion.p>

          <HowItWorksButton onClick={onContinue} />
        </motion.div>
      </div>
    </div>
  );
}
