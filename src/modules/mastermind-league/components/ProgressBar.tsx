"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label = "Progress" }: ProgressBarProps) {
  const percentage = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-icai-light-blue/60 text-xs tracking-widest uppercase font-medium">
          {label}
        </span>
        <span className="text-icai-yellow font-bold text-xs">
          {current} <span className="text-icai-light-blue/40 font-normal">/ {total}</span>
        </span>
      </div>

      {/* Track */}
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{
          background: "rgba(15,14,12,0.7)",
          border: "1px solid rgba(20, 88, 134, 0.25)",
        }}
      >
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            background:
              "linear-gradient(90deg, #145886 0%, #B1C9EB 50%, #FFBD59 100%)",
            boxShadow: "0 0 8px rgba(255,189,89,0.4)",
          }}
        >
          {/* Inner shimmer */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>

      {/* Step dots */}
      <div className="flex justify-between mt-1.5 px-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: 5,
              height: 5,
              background:
                i < current
                  ? "#FFBD59"
                  : i === current - 1
                  ? "#B1C9EB"
                  : "rgba(20, 88, 134, 0.25)",
            }}
            animate={
              i === current - 1
                ? { scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }
                : {}
            }
            transition={{ duration: 1, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}
