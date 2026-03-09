"use client";

import { motion } from "framer-motion";

// Gold gradient — applied via CSS background-clip trick
const GOLD: React.CSSProperties = {
  background: "linear-gradient(135deg, #F6C453 0%, #FFB347 55%, #F6C453 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontFamily: "var(--font-poppins), sans-serif",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: 1.0,
};

// Shimmer sweep style
const SHIMMER: React.CSSProperties = {
  background:
    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 40%, rgba(255,220,100,0.65) 50%, rgba(255,255,255,0.5) 60%, transparent 100%)",
};

export function AnimatedTitle() {
  return (
    /*
      Spring config for "bus braking" effect:
      - High stiffness (250): rushes in fast
      - Low damping (18): pronounced overshoot → bounce back → settle
      - mass 1.0, delay 2.2s to follow the ICAI zoom animation
      - Total visible motion ≈ 1.6 s
    */
    <motion.div
      initial={{ x: "-75vw", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 18,
        mass: 1.0,
        delay: 2.2,
      }}
      className="relative text-center"
      style={{ overflow: "visible" }}
    >
      {/* MASTERMIND */}
      <div
        className="select-none"
        style={{
          ...GOLD,
          fontSize: "clamp(3rem, 9.5vw, 7.5rem)",
        }}
      >
        MASTERMIND
      </div>

      {/* LEAGUE — slightly larger for visual dominance */}
      <div
        className="select-none"
        style={{
          ...GOLD,
          fontSize: "clamp(3.4rem, 11vw, 8.6rem)",
          marginTop: "-0.05em",
        }}
      >
        LEAGUE
      </div>

      {/* Shimmer sweep — fires once after spring settles, then loops every 9 s */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ overflow: "hidden" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.2, duration: 0.1 }}
      >
        <motion.div
          className="absolute top-0 bottom-0 w-1/3"
          style={SHIMMER}
          initial={{ x: "-100%" }}
          animate={{ x: "450%" }}
          transition={{
            duration: 1.0,
            delay: 4.3,
            ease: [0.4, 0, 0.2, 1],
            repeat: Infinity,
            repeatDelay: 8.5,
          }}
        />
      </motion.div>

      {/* Ambient glow beneath the title — fades in after spring settles */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.3 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 3.8, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-2 left-0 right-0 pointer-events-none"
        style={{
          height: 44,
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(246,196,83,0.2) 0%, transparent 70%)",
          filter: "blur(10px)",
          transformOrigin: "center",
        }}
      />
    </motion.div>
  );
}
