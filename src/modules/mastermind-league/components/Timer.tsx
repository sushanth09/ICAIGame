"use client";

import { motion } from "framer-motion";

interface TimerProps {
  timeRemaining: number;
  totalTime?: number;
  label?: string;
  variant?: "linear" | "circular";
}

export function Timer({
  timeRemaining,
  totalTime = 60,
  label = "Time",
  variant = "circular",
}: TimerProps) {
  const safeRemaining = Math.max(0, timeRemaining);
  const percentage = totalTime > 0 ? safeRemaining / totalTime : 0;
  const isLow = safeRemaining <= 10 && safeRemaining > 0;
  const isZero = safeRemaining <= 0;

  const color = isZero
    ? "#ef4444"
    : isLow
    ? "#FFBD59"
    : "#B1C9EB";

  if (variant === "circular") {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percentage);

    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-1"
      >
        <span className="text-icai-light-blue/70 text-[10px] tracking-widest uppercase font-medium">
          {label}
        </span>
        <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
          {/* Background ring */}
          <svg
            className="absolute"
            width={72}
            height={72}
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx={36}
              cy={36}
              r={radius}
              fill="none"
              stroke="rgba(20, 88, 134, 0.2)"
              strokeWidth={3}
            />
            <motion.circle
              cx={36}
              cy={36}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{
                strokeDashoffset: offset,
                stroke: color,
              }}
              transition={{ duration: 0.4, ease: "linear" }}
              style={{
                filter: isLow
                  ? `drop-shadow(0 0 6px ${color})`
                  : undefined,
              }}
            />
          </svg>

          {/* Countdown number */}
          <motion.span
            key={safeRemaining}
            initial={{ scale: 1.25, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative font-black text-xl tabular-nums z-10"
            style={{
              color,
              textShadow: isLow ? `0 0 12px ${color}` : undefined,
            }}
          >
            {safeRemaining}
          </motion.span>

          {/* Low-time pulse ring */}
          {isLow && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${color}` }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          )}
        </div>
      </motion.div>
    );
  }

  // Linear variant (fallback)
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center gap-1"
    >
      <span className="text-sm text-icai-light-blue">{label}</span>
      <motion.span
        key={safeRemaining}
        animate={{
          scale: isLow ? [1, 1.1, 1] : 1,
          color,
        }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold tabular-nums"
      >
        {safeRemaining}s
      </motion.span>
      {totalTime > 0 && (
        <div className="w-24 h-1.5 bg-icai-dark-grey/60 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-icai-blue rounded-full"
            animate={{ width: `${percentage * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </motion.div>
  );
}
