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

  const isLow = safeRemaining <= 10 && safeRemaining > 5;
  const isCritical = safeRemaining <= 5 && safeRemaining > 0;
  const isZero = safeRemaining <= 0;

  const color = isZero || isCritical
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
        <span className="text-icai-light-blue/65 text-[10px] tracking-widest uppercase font-medium">
          {label}
        </span>

        <div
          className="relative flex items-center justify-center"
          style={{ width: 72, height: 72 }}
        >
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
              stroke="rgba(20,88,134,0.18)"
              strokeWidth={3.5}
            />
            <motion.circle
              cx={36}
              cy={36}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{
                strokeDashoffset: offset,
                stroke: color,
              }}
              transition={{ duration: 0.4, ease: "linear" }}
              style={{
                filter:
                  isCritical
                    ? `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 3px ${color})`
                    : isLow
                    ? `drop-shadow(0 0 5px ${color})`
                    : undefined,
              }}
            />
          </svg>

          {/* Countdown number */}
          <motion.span
            key={safeRemaining}
            initial={{ scale: isCritical ? 1.4 : 1.2, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.28 }}
            className="relative font-black text-xl tabular-nums z-10"
            style={{
              color,
              textShadow:
                isCritical
                  ? `0 0 14px ${color}, 0 0 6px ${color}`
                  : isLow
                  ? `0 0 10px ${color}`
                  : undefined,
            }}
          >
            {safeRemaining}
          </motion.span>

          {/* Critical pulse ring */}
          {isCritical && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${color}` }}
              animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Low-time softer pulse */}
          {isLow && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${color}` }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.0, repeat: Infinity }}
            />
          )}
        </div>
      </motion.div>
    );
  }

  // Linear variant
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
          scale: isCritical ? [1, 1.15, 1] : isLow ? [1, 1.08, 1] : 1,
          color,
        }}
        transition={{ duration: isCritical ? 0.4 : 0.5 }}
        className="text-3xl md:text-4xl font-bold tabular-nums"
        style={{
          textShadow: isCritical ? `0 0 16px ${color}` : undefined,
        }}
      >
        {safeRemaining}s
      </motion.span>
      {totalTime > 0 && (
        <div className="w-24 h-1.5 bg-icai-dark-grey/60 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${percentage * 100}%`, backgroundColor: color }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </motion.div>
  );
}
