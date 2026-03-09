"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { DotLottie } from "@lottiefiles/dotlottie-react";

const EASE = [0.33, 1, 0.68, 1] as const;

interface StartGamePageProps {
  onBegin: () => void;
}

// ── Animated Chart Icon (Rounds) ─────────────────────────────────────────────
function ChartIcon() {
  const bars = [
    { x: 3,  h: 13, delay: 0.9 },
    { x: 10, h: 20, delay: 1.05 },
    { x: 17, h: 16, delay: 1.2 },
    { x: 24, h: 27, delay: 1.35 },
  ];
  return (
    <svg viewBox="0 0 34 34" fill="none" width="42" height="42">
      <line x1="2" y1="31" x2="31" y2="31" stroke="#FFBD59" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
      {bars.map((bar, i) => (
        <motion.rect
          key={i}
          x={bar.x}
          width="5.5"
          rx="1.5"
          fill="#FFBD59"
          opacity={0.6 + i * 0.1}
          initial={{ height: 0, y: 31 }}
          animate={{ height: bar.h, y: 31 - bar.h }}
          transition={{ delay: bar.delay, duration: 0.65, ease: EASE }}
        />
      ))}
      <motion.polyline
        points="5.5,18 13,10 20,14 27.5,3"
        stroke="rgba(255,189,89,0.45)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.7, ease: "easeOut" }}
      />
      <motion.circle
        cx="27.5" cy="3" r="2"
        fill="#FFBD59"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.4, 1] }}
        transition={{ delay: 2.35, duration: 0.4 }}
      />
    </svg>
  );
}

// ── Animated Timer Icon (Minutes) ────────────────────────────────────────────
function TimerIcon() {
  const R = 12;
  const circ = 2 * Math.PI * R;
  return (
    <svg viewBox="0 0 34 34" fill="none" width="42" height="42">
      {/* Tick marks */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={17 + 15 * Math.cos(rad)}
            y1={17 + 15 * Math.sin(rad)}
            x2={17 + (deg % 90 === 0 ? 11.5 : 13) * Math.cos(rad)}
            y2={17 + (deg % 90 === 0 ? 11.5 : 13) * Math.sin(rad)}
            stroke="rgba(255,189,89,0.3)"
            strokeWidth={deg % 90 === 0 ? 1.5 : 0.8}
          />
        );
      })}
      {/* Background ring */}
      <circle cx="17" cy="17" r={R} stroke="rgba(255,189,89,0.15)" strokeWidth="2.5" fill="none" />
      {/* Animated fill ring */}
      <motion.circle
        cx="17" cy="17" r={R}
        stroke="#FFBD59"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * 0.28 }}
        transition={{ delay: 0.95, duration: 1.4, ease: "easeOut" }}
        style={{ transformOrigin: "17px 17px", rotate: -90 }}
      />
      {/* Center dot */}
      <circle cx="17" cy="17" r="1.8" fill="#FFBD59" opacity="0.9" />
      {/* Rotating clock hand */}
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "17px 17px" }}
      >
        <line x1="17" y1="17" x2="17" y2="7.5" stroke="#FFBD59" strokeWidth="1.6" strokeLinecap="round" />
      </motion.g>
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "17px 17px" }}
      >
        <line x1="17" y1="17" x2="22" y2="17" stroke="rgba(255,189,89,0.55)" strokeWidth="1.2" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

// ── Animated Points / Leaderboard Icon (Score) ──────────────────────────────
function PointsIcon() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const target = 100;
    const duration = 1400;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.round(p * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    const t = setTimeout(() => { frame = requestAnimationFrame(tick); }, 1000);
    return () => { clearTimeout(t); cancelAnimationFrame(frame); };
  }, []);

  const rows = [
    { w: 28, gold: true },
    { w: 22, gold: false },
    { w: 17, gold: false },
    { w: 12, gold: false },
  ];
  return (
    <svg viewBox="0 0 34 34" fill="none" width="42" height="42">
      {/* Trophy cup outline */}
      <motion.path
        d="M12,5 h10 v8 a5,5 0 0,1 -10,0 Z"
        stroke="#FFBD59" strokeWidth="1.2" fill="rgba(255,189,89,0.06)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      />
      <motion.line x1="17" y1="13" x2="17" y2="18" stroke="#FFBD59" strokeWidth="1.2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.1, duration: 0.4 }}
      />
      <motion.path d="M13,18 h8" stroke="#FFBD59" strokeWidth="1.4" strokeLinecap="round"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        style={{ transformOrigin: "17px 18px" }}
        transition={{ delay: 1.3, duration: 0.4 }}
      />
      {/* Leaderboard bars */}
      {rows.map((r, i) => (
        <motion.rect
          key={i}
          x="3"
          y={21 + i * 3.2}
          height="2.2"
          rx="1.1"
          fill={r.gold ? "#FFBD59" : "rgba(255,189,89,0.45)"}
          initial={{ width: 0 }}
          animate={{ width: r.w }}
          transition={{ delay: 1.0 + i * 0.13, duration: 0.55, ease: EASE }}
        />
      ))}
      {/* Ticking count */}
      <motion.text
        x="31" y="34"
        textAnchor="end"
        fontSize="5.5"
        fill="#FFBD59"
        fontWeight="bold"
        opacity="0.85"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        {count}
      </motion.text>
    </svg>
  );
}

// ── Stat card data ────────────────────────────────────────────────────────────
const STAT_ITEMS = [
  { Icon: ChartIcon,  label: "3 Rounds",    sub: "of escalating intensity" },
  { Icon: TimerIcon,  label: "3 Minutes",   sub: "of total play time"      },
  { Icon: PointsIcon, label: "100 Points",  sub: "maximum score possible"  },
];

// ── Floating finance symbols ──────────────────────────────────────────────────
const SYMBOLS = [
  { sym: "$",  x: "7%",  y: "14%", size: 18, delay: 0.3, dur: 7.0 },
  { sym: "%",  x: "87%", y: "18%", size: 14, delay: 0.9, dur: 8.5 },
  { sym: "₹",  x: "4%",  y: "68%", size: 16, delay: 0.6, dur: 7.5 },
  { sym: "∑",  x: "91%", y: "62%", size: 20, delay: 1.2, dur: 9.0 },
  { sym: "€",  x: "14%", y: "83%", size: 13, delay: 0.4, dur: 6.5 },
  { sym: "÷",  x: "77%", y: "86%", size: 12, delay: 1.0, dur: 8.0 },
  { sym: "∞",  x: "49%", y: "4%",  size: 15, delay: 0.7, dur: 8.8 },
  { sym: "≈",  x: "29%", y: "91%", size: 11, delay: 1.5, dur: 7.2 },
  { sym: "∂",  x: "62%", y: "8%",  size: 13, delay: 0.2, dur: 9.5 },
  { sym: "Δ",  x: "82%", y: "44%", size: 11, delay: 1.8, dur: 6.8 },
];

// ── Lightning sparks near button ─────────────────────────────────────────────
function LightningSparks() {
  const sparks = [
    { tx: -14, ty: -10, delay: 0.0, angle: -140 },
    { tx:  14, ty: -10, delay: 0.35, angle: -40 },
    { tx: -12, ty:   4, delay: 0.7,  angle: -170 },
    { tx:  12, ty:   4, delay: 1.05, angle: -10  },
    { tx:   0, ty: -14, delay: 0.5,  angle: -90  },
  ];
  return (
    <>
      {sparks.map((s, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 3.5, height: 3.5,
            background: "#FFBD59",
            top: "50%",
            left: "13%",
            marginTop: -1.75,
            marginLeft: -1.75,
          }}
          animate={{
            x: [0, s.tx],
            y: [0, s.ty],
            opacity: [0, 0.9, 0],
            scale: [0.5, 1.4, 0],
          }}
          transition={{
            duration: 0.55,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: 2.2,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

// ── Background: grid, glow, symbols, rings ────────────────────────────────────
function GameBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Financial grid lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.035 }}>
        <defs>
          <pattern id="fin-grid" width="52" height="52" patternUnits="userSpaceOnUse">
            <path d="M 52 0 L 0 0 0 52" fill="none" stroke="#B1C9EB" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fin-grid)" />
      </svg>

      {/* Radial glow behind center */}
      <div
        className="absolute rounded-full"
        style={{
          width: 760, height: 760,
          background: "radial-gradient(circle, rgba(255,189,89,0.07) 0%, rgba(20,88,134,0.13) 45%, transparent 72%)",
          filter: "blur(50px)",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Floating financial symbols */}
      {SYMBOLS.map((s, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.07, 0.055, 0.07], y: [0, -10, 0] }}
          transition={{ delay: s.delay, duration: s.dur, repeat: Infinity, ease: "easeInOut" }}
          className="absolute font-mono text-white"
          style={{ left: s.x, top: s.y, fontSize: s.size }}
        >
          {s.sym}
        </motion.span>
      ))}

      {/* Concentric energy rings */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 220 + i * 130,
            height: 220 + i * 130,
            border: `1px solid rgba(255,189,89,${0.14 - i * 0.025})`,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [1, 1.035 + i * 0.008, 1],
            opacity: [0.25 + i * 0.04, 0.5 + i * 0.04, 0.25 + i * 0.04],
          }}
          transition={{
            duration: 2.8 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.35,
          }}
        />
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function StartGamePage({ onBegin }: StartGamePageProps) {
  const [showLottie, setShowLottie] = useState(false);
  const calledRef = useRef(false);

  const triggerBegin = useCallback(() => {
    if (!calledRef.current) {
      calledRef.current = true;
      onBegin();
    }
  }, [onBegin]);

  const handleDotLottieRef = useCallback((dl: DotLottie | null) => {
    if (dl) {
      dl.addEventListener("complete", triggerBegin);
    }
  }, [triggerBegin]);

  // Safety fallback: proceed after 4 s even if onComplete never fires
  useEffect(() => {
    if (!showLottie) return;
    const t = setTimeout(triggerBegin, 4000);
    return () => clearTimeout(t);
  }, [showLottie, triggerBegin]);

  const handleLaunch = () => setShowLottie(true);

  return (
    <>
      {/* ── Main hero content ── */}
      <motion.div
        animate={showLottie ? { opacity: 0, scale: 0.97 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeIn" }}
        className="w-full h-full flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
      >
        <GameBackground />

        {/* ICAI label */}
        <motion.p
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE }}
          className="relative z-10 text-icai-light-blue text-xs md:text-sm tracking-[0.35em] uppercase mb-7 font-medium"
        >
          ICAI Atlanta Chapter ✦ First Edition ✦ April 2026
        </motion.p>

        {/* ── Cinematic headline reveal ── */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1,   filter: "blur(0px)"  }}
          transition={{ delay: 0.18, duration: 1.05, ease: EASE }}
          className="relative z-10 mb-2"
        >
          {/* Subtle gold glow layer behind text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1.2 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,189,89,0.22), transparent 70%)",
              filter: "blur(18px)",
            }}
          />
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight"
            style={{
              background: "linear-gradient(170deg, #FFD580 0%, #FFBD59 45%, #D4940F 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.01em",
            }}
          >
            ARE YOU READY,
            <br />
            CHALLENGER?
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.72, duration: 0.8 }}
          className="relative z-10 text-icai-light-blue text-sm md:text-lg mb-10 max-w-sm md:max-w-md font-medium"
        >
          Three rounds. One champion. Your knowledge begins now.
        </motion.p>

        {/* ── Stat cards ── */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 mb-10">
          {STAT_ITEMS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 + i * 0.14, duration: 0.6, ease: EASE }}
              whileHover={{
                y: -7,
                scale: 1.05,
                boxShadow: "0 16px 48px rgba(255,189,89,0.22), 0 0 0 1.5px rgba(255,189,89,0.45)",
              }}
              className="flex flex-col items-center px-7 py-5 rounded-xl cursor-default"
              style={{
                background: "rgba(20, 88, 134, 0.13)",
                border: "1px solid rgba(177,201,235,0.22)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 24px rgba(20,88,134,0.14)",
                transition: "box-shadow 0.25s ease, transform 0.25s ease",
              }}
            >
              <div className="mb-1">
                <stat.Icon />
              </div>
              <span className="text-icai-yellow font-bold text-sm mt-0.5">{stat.label}</span>
              <span className="text-icai-light-blue/70 text-xs mt-0.5">{stat.sub}</span>
            </motion.div>
          ))}
        </div>

        {/* ── Launch button ── */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.28, duration: 0.75, ease: EASE }}
          className="relative z-10"
        >
          {/* Pulse glow ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              boxShadow: [
                "0 0 22px rgba(255,189,89,0.22), 0 0 48px rgba(255,189,89,0.08)",
                "0 0 52px rgba(255,189,89,0.62), 0 0 96px rgba(255,189,89,0.28)",
                "0 0 22px rgba(255,189,89,0.22), 0 0 48px rgba(255,189,89,0.08)",
              ],
            }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Lightning sparks */}
          <LightningSparks />

          <motion.button
            onClick={handleLaunch}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className="relative z-10 px-12 md:px-16 py-5 rounded-2xl text-lg md:text-2xl font-black tracking-wide overflow-hidden"
            style={{
              background: "linear-gradient(155deg, #FFCF70 0%, #FFBD59 45%, #D4940F 100%)",
              color: "#0A0147",
              cursor: "pointer",
            }}
          >
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 28%, rgba(255,255,255,0.32) 50%, transparent 72%)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.8, ease: "linear" }}
            />
            <span className="relative z-10">⚡ LAUNCH THE CHALLENGE</span>
          </motion.button>
        </motion.div>

        {/* Bottom pulse dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="rounded-full bg-icai-yellow"
              style={{ width: 6, height: 6 }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* ── Lottie launch transition overlay ── */}
      <AnimatePresence>
        {showLottie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.38 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(5, 2, 40, 0.97)" }}
          >
            {/* Subtle radial glow behind the animation */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 600, height: 600,
                background: "radial-gradient(circle, rgba(255,189,89,0.12) 0%, transparent 65%)",
                filter: "blur(40px)",
              }}
            />
            <div style={{ width: "min(500px, 88vw)", height: "min(500px, 88vw)", position: "relative", zIndex: 1 }}>
              <DotLottieReact
                src="https://lottie.host/d7e6ebd2-4be6-4611-8b9e-ceb61f2bac35/ODqXSnkXwo.lottie"
                autoplay
                loop={false}
                dotLottieRefCallback={handleDotLottieRef}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
