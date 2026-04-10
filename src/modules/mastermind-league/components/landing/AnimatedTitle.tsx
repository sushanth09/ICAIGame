"use client";

import { motion } from "framer-motion";

const PP: React.CSSProperties = {
  fontFamily: "var(--font-poppins), sans-serif",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: 1.0,
};

export function AnimatedTitle() {
  return (
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
      className="relative z-10 text-center inline-block"
      style={{ overflow: "visible" }}
    >
      <div
        className="select-none mastermind-title-gold"
        style={{
          ...PP,
          fontSize: "clamp(3rem, 9.5vw, 7.5rem)",
        }}
      >
        MASTERMIND
      </div>

      <div
        className="select-none mastermind-title-gold"
        style={{
          ...PP,
          fontSize: "clamp(3.4rem, 11vw, 8.6rem)",
          marginTop: "-0.05em",
        }}
      >
        LEAGUE
      </div>

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
