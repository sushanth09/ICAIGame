"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

const EASE = [0.33, 1, 0.68, 1] as const;

type LaunchPhase = "idle" | "charging" | "launching";

interface StartGamePageProps {
  onBegin: () => void;
}

const STAT_ITEMS = [
  { icon: "📊", label: "3 Rounds", sub: "of escalating intensity" },
  { icon: "⏱", label: "3 Minutes", sub: "of total play time" },
  { icon: "🏆", label: "100 Points", sub: "maximum score possible" },
];

export function StartGamePage({ onBegin }: StartGamePageProps) {
  const [phase, setPhase] = useState<LaunchPhase>("idle");
  const [chargePercent, setChargePercent] = useState(0);
  const chargeBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLaunch = () => {
    if (phase !== "idle") return;
    setPhase("charging");

    const proxy = { value: 0 };
    gsap.to(proxy, {
      value: 100,
      duration: 2.8,
      ease: "power2.inOut",
      onUpdate() {
        setChargePercent(Math.round(proxy.value));
        if (chargeBarRef.current) {
          chargeBarRef.current.style.width = `${proxy.value}%`;
        }
      },
      onComplete() {
        setPhase("launching");
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 1.04,
          duration: 0.7,
          delay: 0.4,
          ease: "power2.in",
          onComplete: onBegin,
        });
      },
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => { gsap.killTweensOf("*"); };
  }, []);

  const isIdle = phase === "idle";
  const isCharging = phase === "charging";
  const isLaunching = phase === "launching";

  return (
    <div
      ref={containerRef}
      className="min-h-[88vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden"
    >
      {/* Ambient glow behind the center */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(20,88,134,0.25) 0%, transparent 70%)",
          filter: "blur(80px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Energy rings */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 180 + i * 110,
            height: 180 + i * 110,
            border: `1px solid rgba(255,189,89,${isCharging ? 0.5 - i * 0.08 : 0.18 - i * 0.03})`,
          }}
          animate={
            isCharging
              ? {
                  scale: [1, 1.15, 1],
                  opacity: [0.6, 1, 0.6],
                  borderColor: [
                    `rgba(255,189,89,${0.4 - i * 0.05})`,
                    `rgba(255,189,89,${0.8 - i * 0.1})`,
                    `rgba(255,189,89,${0.4 - i * 0.05})`,
                  ],
                }
              : isLaunching
              ? { scale: [1, 3], opacity: [0.8, 0] }
              : {
                  scale: [1, 1.04 + i * 0.01, 1],
                  opacity: [0.15 + i * 0.02, 0.3 + i * 0.02, 0.15 + i * 0.02],
                }
          }
          transition={{
            duration: isCharging ? 0.6 - i * 0.08 : isLaunching ? 0.5 : 2.5 + i * 0.6,
            delay: isLaunching ? i * 0.05 : i * 0.3,
            repeat: isLaunching ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ICAI label */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="text-icai-light-blue text-xs md:text-sm tracking-[0.35em] uppercase mb-8 font-medium"
      >
        ICAI Atlanta Chapter ✦ First Edition ✦ April 2026
      </motion.p>

      {/* Main headline */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 1, ease: EASE }}
        className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-4"
        style={{
          background: "linear-gradient(to bottom, #FFBD59 0%, #D4940F 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 20px rgba(255,189,89,0.4))",
        }}
      >
        ARE YOU READY,
        <br />
        CHALLENGER?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-icai-light-blue text-sm md:text-lg mb-10 max-w-sm md:max-w-md font-medium"
      >
        Three rounds. One champion. Your knowledge begins now.
      </motion.p>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7, ease: EASE }}
        className="flex flex-col sm:flex-row gap-4 mb-10"
      >
        {STAT_ITEMS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + i * 0.15, duration: 0.6, ease: EASE }}
            whileHover={{ y: -4, scale: 1.03 }}
            className="flex flex-col items-center px-5 py-4 rounded-xl border border-icai-blue/30"
            style={{ background: "rgba(20, 88, 134, 0.12)", backdropFilter: "blur(8px)" }}
          >
            <span className="text-2xl mb-1">{stat.icon}</span>
            <span className="text-icai-yellow font-bold text-sm">{stat.label}</span>
            <span className="text-icai-light-blue/70 text-xs">{stat.sub}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Charge bar — shown when charging */}
      <AnimatePresence>
        {!isIdle && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-xs mb-6 overflow-hidden"
          >
            <p className="text-icai-yellow text-xs font-bold tracking-widest mb-2 uppercase">
              {isLaunching ? "🚀 LAUNCHING!" : `CHARGING… ${chargePercent}%`}
            </p>
            <div
              className="h-2.5 rounded-full overflow-hidden"
              style={{
                background: "rgba(15,14,12,0.6)",
                border: "1px solid rgba(255,189,89,0.3)",
              }}
            >
              <div
                ref={chargeBarRef}
                className="h-full rounded-full"
                style={{
                  width: "0%",
                  background:
                    "linear-gradient(90deg, #145886 0%, #B1C9EB 40%, #FFBD59 100%)",
                  boxShadow: "0 0 12px rgba(255,189,89,0.6)",
                  transition: "none",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launch button */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
        className="relative"
      >
        {/* Animated glow ring behind button */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isIdle
              ? [
                  "0 0 25px rgba(255,189,89,0.25), 0 0 50px rgba(255,189,89,0.1)",
                  "0 0 55px rgba(255,189,89,0.6), 0 0 100px rgba(255,189,89,0.25)",
                  "0 0 25px rgba(255,189,89,0.25), 0 0 50px rgba(255,189,89,0.1)",
                ]
              : "0 0 80px rgba(255,189,89,0.8), 0 0 150px rgba(255,189,89,0.4)",
          }}
          transition={{
            duration: 2.2,
            repeat: isIdle ? Infinity : 0,
            ease: "easeInOut",
          }}
        />

        <motion.button
          onClick={handleLaunch}
          disabled={!isIdle}
          whileHover={isIdle ? { scale: 1.05 } : {}}
          whileTap={isIdle ? { scale: 0.96 } : {}}
          transition={{ duration: 0.25 }}
          className="relative z-10 px-12 md:px-16 py-5 rounded-2xl text-lg md:text-2xl font-black tracking-wide transition-all overflow-hidden"
          style={{
            background: isIdle
              ? "linear-gradient(160deg, #FFBD59 0%, #D4940F 100%)"
              : "linear-gradient(160deg, #D4940F 0%, #FFBD59 100%)",
            color: "#0A0147",
            cursor: isIdle ? "pointer" : "not-allowed",
          }}
        >
          {/* Inner shimmer on idle */}
          {isIdle && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
            />
          )}
          <span className="relative z-10">
            {isIdle ? "⚡ LAUNCH THE CHALLENGE" : isCharging ? "CHARGING…" : "🚀 LAUNCHING!"}
          </span>
        </motion.button>
      </motion.div>

      {/* Animated dot row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
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
    </div>
  );
}
