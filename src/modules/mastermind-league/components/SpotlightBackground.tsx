"use client";

import { motion } from "framer-motion";

const SPOTLIGHTS = [
  {
    width: 700,
    height: 700,
    color: "rgba(20, 88, 134, 0.28)",
    top: "-15%",
    left: "-5%",
    duration: 14,
    delay: 0,
    x: [0, 60, -20, 40, 0],
    y: [0, -40, 25, -15, 0],
  },
  {
    width: 550,
    height: 550,
    color: "rgba(255, 189, 89, 0.1)",
    top: "10%",
    right: "-8%",
    duration: 18,
    delay: 3,
    x: [0, -50, 30, -20, 0],
    y: [0, 30, -50, 20, 0],
  },
  {
    width: 600,
    height: 600,
    color: "rgba(177, 201, 235, 0.12)",
    bottom: "-20%",
    left: "25%",
    duration: 16,
    delay: 6,
    x: [0, 30, -40, 20, 0],
    y: [0, -25, 35, -10, 0],
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
            top: spot.top,
            left: spot.left,
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

      {/* Subtle horizontal scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(20, 88, 134, 0.3), rgba(177, 201,235, 0.5), rgba(20, 88, 134, 0.3), transparent)",
        }}
        animate={{ top: ["-5%", "105%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
      />
    </div>
  );
}
