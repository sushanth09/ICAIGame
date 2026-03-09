"use client";

import { motion } from "framer-motion";

const EASE = [0.33, 1, 0.68, 1] as const;

const DIRS: Array<{ x: number; y: number; rotate: number }> = [
  { x: -22, y: -18, rotate: -9 },
  { x: 20, y: -12, rotate: 6 },
  { x: -16, y: 12, rotate: -6 },
  { x: 18, y: -14, rotate: 5 },
  { x: -28, y: 2, rotate: -7 },
  { x: 22, y: 16, rotate: 7 },
  { x: -12, y: -22, rotate: -4 },
  { x: 16, y: 10, rotate: 5 },
  { x: -22, y: 14, rotate: -6 },
  { x: 26, y: -10, rotate: 7 },
  { x: -14, y: -20, rotate: -5 },
  { x: 20, y: 6, rotate: 4 },
  { x: -20, y: 20, rotate: -6 },
  { x: 24, y: -17, rotate: 6 },
  { x: -16, y: -12, rotate: -4 },
  { x: 18, y: 16, rotate: 5 },
  { x: -10, y: 22, rotate: -5 },
  { x: 14, y: -18, rotate: 4 },
];

function dir(i: number) {
  return DIRS[i % DIRS.length];
}

const LINE1 = "MASTERMIND".split("");
const LINE2 = "LEAGUE".split("");

const SHIMMER_STYLE = {
  background:
    "linear-gradient(90deg, transparent, rgba(255,189,89,0.8), rgba(255,255,255,0.4), rgba(255,189,89,0.8), transparent)",
  boxShadow: "0 0 12px rgba(255,189,89,0.5)",
};

export function AnimatedTitle() {
  return (
    <div className="relative inline-block mb-10">
      <div className="overflow-visible">
        {/* MASTERMIND */}
        <div className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-1">
          {LINE1.map((letter, i) => (
            <motion.span
              key={`1-${i}`}
              initial={{
                opacity: 0,
                x: dir(i).x,
                y: dir(i).y,
                rotate: dir(i).rotate,
                scale: 0.55,
              }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
              transition={{ duration: 0.88, delay: 0.4 + i * 0.055, ease: EASE }}
              style={{ willChange: "transform, opacity", display: "inline-block", color: "#E8E9E4" }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* LEAGUE with gold glow */}
        <div className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
          {LINE2.map((letter, i) => (
            <motion.span
              key={`2-${i}`}
              initial={{
                opacity: 0,
                x: dir(i + 10).x,
                y: dir(i + 10).y,
                rotate: dir(i + 10).rotate,
                scale: 0.55,
              }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
              transition={{ duration: 0.88, delay: 0.95 + i * 0.07, ease: EASE }}
              style={{
                willChange: "transform, opacity",
                display: "inline-block",
                color: "#FFBD59",
                filter: "drop-shadow(0 0 8px rgba(255,189,89,0.4))",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Horizontal shimmer sweep after assembly */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.2 }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "210%" }}
          transition={{ duration: 1.1, delay: 2.0, ease: [0.4, 0, 0.2, 1] }}
          className="absolute top-1/2 -translate-y-1/2 w-2/5 h-px"
          style={{ ...SHIMMER_STYLE, willChange: "transform" }}
        />
      </motion.div>

      {/* Subtle glow aura under the title */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.2 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 2.15, duration: 1, ease: EASE }}
        className="absolute -bottom-2 left-0 right-0 pointer-events-none"
        style={{
          height: 40,
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(255,189,89,0.2) 0%, transparent 70%)",
          filter: "blur(8px)",
          transformOrigin: "center",
        }}
      />
    </div>
  );
}
