"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

interface ScoreDisplayProps {
  score: number;
  label?: string;
}

export function ScoreDisplay({ score, label = "Score" }: ScoreDisplayProps) {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center"
    >
      <span className="text-icai-light-blue/60 text-[10px] tracking-widest uppercase font-medium mb-0.5">
        {label}
      </span>
      <motion.div
        key={score}
        initial={{ scale: 1.3, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="relative"
      >
        <span
          className="text-2xl md:text-3xl font-black tabular-nums"
          style={{
            background: "linear-gradient(to bottom, #FFBD59, #D4940F)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 8px rgba(255,189,89,0.35))",
          }}
        >
          <CountUp end={score} duration={0.5} preserveValue />
        </span>
        {/* Score pop glow */}
        <motion.div
          key={`glow-${score}`}
          initial={{ opacity: 0.8, scale: 0.5 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,189,89,0.4) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
