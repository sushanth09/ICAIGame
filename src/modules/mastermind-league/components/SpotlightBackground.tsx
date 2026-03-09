"use client";

import { motion } from "framer-motion";

const SPOTLIGHTS = [
  {
    width: 750,
    height: 750,
    color: "rgba(20, 88, 134, 0.32)",
    top: "-18%",
    left: "-8%",
    duration: 14,
    delay: 0,
    x: [0, 65, -22, 44, 0],
    y: [0, -42, 28, -18, 0],
  },
  {
    width: 580,
    height: 580,
    color: "rgba(255, 189, 89, 0.12)",
    top: "8%",
    right: "-10%",
    duration: 18,
    delay: 3,
    x: [0, -55, 32, -22, 0],
    y: [0, 32, -55, 22, 0],
  },
  {
    width: 650,
    height: 650,
    color: "rgba(177, 201, 235, 0.13)",
    bottom: "-22%",
    left: "22%",
    duration: 16,
    delay: 6,
    x: [0, 32, -44, 22, 0],
    y: [0, -28, 38, -12, 0],
  },
  {
    width: 420,
    height: 420,
    color: "rgba(255, 189, 89, 0.07)",
    top: "38%",
    left: "38%",
    duration: 22,
    delay: 9,
    x: [0, -18, 28, -10, 0],
    y: [0, 14, -18, 8, 0],
  },
  {
    width: 500,
    height: 500,
    color: "rgba(20, 88, 134, 0.15)",
    bottom: "5%",
    right: "5%",
    duration: 20,
    delay: 4,
    x: [0, -30, 20, -15, 0],
    y: [0, -20, 30, -10, 0],
  },
];

export function SpotlightBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {SPOTLIGHTS.map((spot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: spot.width,
            height: spot.height,
            top: (spot as { top?: string }).top,
            left: (spot as { left?: string }).left,
            right: (spot as { right?: string }).right,
            bottom: (spot as { bottom?: string }).bottom,
            background: `radial-gradient(circle at center, ${spot.color} 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
          animate={{ x: spot.x, y: spot.y }}
          transition={{
            duration: spot.duration,
            delay: spot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Horizontal scan line — top to bottom */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(20, 88, 134, 0.35), rgba(177, 201, 235, 0.55), rgba(20, 88, 134, 0.35), transparent)",
        }}
        animate={{ top: ["-5%", "105%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
      />

      {/* Diagonal accent line */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: "1px",
          height: "60vh",
          top: "-20%",
          left: "30%",
          background:
            "linear-gradient(to bottom, transparent, rgba(255,189,89,0.08), transparent)",
          transform: "rotate(15deg)",
          transformOrigin: "top center",
        }}
        animate={{ top: ["-20%", "120%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", repeatDelay: 8, delay: 3 }}
      />
    </div>
  );
}
