"use client";

import { motion } from "framer-motion";
import { AnimatedButton } from "../components/AnimatedButton";
import { AnimatedRibbon } from "../components/AnimatedRibbon";

const EASE = [0.33, 1, 0.68, 1] as const;

const FLOATING_ICONS = [
  { icon: "📊", left: "3%",  top: "8%",  delay: 0.2, duration: 4.2 },
  { icon: "💹", left: "92%", top: "12%", delay: 0.8, duration: 5.1 },
  { icon: "🏦", left: "5%",  top: "55%", delay: 1.3, duration: 4.8 },
  { icon: "💰", left: "90%", top: "60%", delay: 0.5, duration: 5.5 },
  { icon: "📈", left: "12%", top: "85%", delay: 1.0, duration: 4.3 },
  { icon: "⚖️", left: "82%", top: "82%", delay: 1.6, duration: 5.2 },
  { icon: "🔢", left: "50%", top: "3%",  delay: 0.7, duration: 4.7 },
  { icon: "📉", left: "72%", top: "38%", delay: 1.1, duration: 5.0 },
  { icon: "🎯", left: "28%", top: "92%", delay: 0.4, duration: 4.9 },
];

const STATS = [
  { value: "3",  label: "Rounds" },
  { value: "Q",  label: "Quarterly" },
  { value: "∞",  label: "Glory" },
];

interface WelcomePageProps {
  onContinue: () => void;
}

export function WelcomePage({ onContinue }: WelcomePageProps) {
  return (
    <div className="max-w-2xl mx-auto relative">
      {/* Floating finance icons in background */}
      {FLOATING_ICONS.map((item, i) => (
        <motion.div
          key={i}
          className="fixed text-xl md:text-2xl pointer-events-none select-none"
          style={{ left: item.left, top: item.top, zIndex: 0 }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.08, 0.22, 0.08],
            y: [0, -14, 0],
            rotate: [-4, 4, -4],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* Ribbon header */}
      <div className="mb-8" style={{ position: "relative", zIndex: 1 }}>
        <AnimatedRibbon delay={0.15}>GAME INTRODUCTION</AnimatedRibbon>
      </div>

      {/* Main content card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ delay: 0.35, duration: 0.85, ease: EASE }}
        className="rounded-2xl overflow-hidden"
        style={{
          border: "1px solid rgba(20, 88, 134, 0.4)",
          background:
            "linear-gradient(160deg, rgba(15,14,12,0.85) 0%, rgba(10,1,71,0.8) 100%)",
          backdropFilter: "blur(16px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Card top glow strip */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,189,89,0.5), transparent)",
          }}
        />

        <div className="p-8 md:p-10">
          {/* Trophy */}
          <motion.div
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.55, type: "spring", stiffness: 220, damping: 16 }}
            className="text-6xl mb-6 text-center"
          >
            🏆
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
            className="text-2xl md:text-3xl font-black mb-2 text-center"
            style={{ color: "#E8E9E4" }}
          >
            Welcome to
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7, ease: EASE }}
            className="text-2xl md:text-3xl font-black mb-6 text-center"
            style={{
              background: "linear-gradient(to right, #FFBD59, #E8E9E4, #FFBD59)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ICAI Atlanta&apos;s Mastermind League
          </motion.h2>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6, ease: EASE }}
            className="mx-auto mb-6 h-px max-w-xs"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,189,89,0.4), transparent)",
              transformOrigin: "center",
            }}
          />

          <motion.p
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: EASE }}
            className="text-icai-light-blue leading-relaxed mb-4 text-center text-sm md:text-base"
          >
            …where finance professionals compete not with Balance Sheets, but with brilliance!
          </motion.p>

          <motion.p
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.85, duration: 0.7, ease: EASE }}
            className="text-icai-light-blue/80 leading-relaxed mb-8 text-center text-sm md:text-base"
          >
            Every quarter, Members battle through 3 intellectually thrilling rounds designed to test
            their expertise in Accounting, Finance, Taxation, and Professional Standards.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7, ease: EASE }}
            className="grid grid-cols-3 gap-3 mb-8"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4, scale: 1.04 }}
                transition={{ duration: 0.25 }}
                className="text-center p-3 rounded-xl"
                style={{
                  background: "rgba(20, 88, 134, 0.18)",
                  border: "1px solid rgba(20, 88, 134, 0.35)",
                }}
              >
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1 + i * 0.12, type: "spring", stiffness: 280, damping: 18 }}
                  className="text-2xl font-black text-icai-yellow"
                >
                  {stat.value}
                </motion.p>
                <p className="text-xs text-icai-light-blue/70 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Battle cry */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-icai-yellow text-xl font-black mb-8 text-center tracking-wide"
          >
            Play. Compete. Conquer. 🏆
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.6 }}
            className="flex justify-center"
          >
            <AnimatedButton onClick={onContinue}>HOW IT WORKS →</AnimatedButton>
          </motion.div>
        </div>

        {/* Card bottom glow strip */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(20,88,134,0.5), transparent)",
          }}
        />
      </motion.div>
    </div>
  );
}
