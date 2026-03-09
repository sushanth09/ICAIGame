"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label = "Progress" }: ProgressBarProps) {
  const percentage = total > 0 ? Math.min(100, ((current - 1) / total) * 100) : 0;

  const getDotColor = (index: number): string => {
    if (index < current - 1) return "#22C55E";       // completed → green
    if (index === current - 1) return "#FFBD59";     // current → gold
    return "rgba(30, 58, 95, 0.45)";                 // upcoming → dark gray
  };

  const getDotGlow = (index: number): string | undefined => {
    if (index === current - 1)
      return "0 0 8px rgba(255,189,89,0.6), 0 0 16px rgba(255,189,89,0.2)";
    if (index < current - 1)
      return "0 0 5px rgba(34,197,94,0.4)";
    return undefined;
  };

  return (
    <div className="w-full">
      {/* Label row */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-icai-light-blue/55 text-[10px] tracking-[0.18em] uppercase font-semibold">
          {label}
        </span>
        <span className="text-icai-yellow font-bold text-xs tabular-nums">
          {current}{" "}
          <span className="text-icai-light-blue/40 font-normal">/ {total}</span>
        </span>
      </div>

      {/* Dot row — all dots shown from the start */}
      <div className="flex items-center justify-between gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 relative flex items-center justify-center"
            initial={false}
          >
            {/* Connector line between dots */}
            {i < total - 1 && (
              <div
                className="absolute left-1/2 top-1/2 -translate-y-1/2 h-0.5 rounded-full"
                style={{
                  width: "calc(100% + 6px)",
                  left: "calc(50% + 5px)",
                  background:
                    i < current - 1
                      ? "linear-gradient(90deg, rgba(34,197,94,0.5), rgba(34,197,94,0.2))"
                      : "rgba(20,88,134,0.2)",
                  transition: "background 0.4s ease",
                }}
              />
            )}

            {/* Dot */}
            <motion.div
              className="relative rounded-full flex-shrink-0"
              style={{
                width: i === current - 1 ? 14 : 10,
                height: i === current - 1 ? 14 : 10,
                background: getDotColor(i),
                boxShadow: getDotGlow(i),
                zIndex: 1,
                transition: "background 0.4s ease, box-shadow 0.4s ease",
              }}
              animate={
                i === current - 1
                  ? { scale: [1, 1.3, 1], opacity: [1, 0.85, 1] }
                  : { scale: 1, opacity: 1 }
              }
              transition={
                i === current - 1
                  ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.3 }
              }
            />
          </motion.div>
        ))}
      </div>

      {/* Thin progress bar track below dots */}
      <div
        className="mt-3 h-1 rounded-full overflow-hidden"
        style={{
          background: "rgba(15,14,12,0.65)",
          border: "1px solid rgba(20,88,134,0.2)",
        }}
      >
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background: "linear-gradient(90deg, #22C55E 0%, #FFBD59 100%)",
            boxShadow: "0 0 6px rgba(255,189,89,0.35)",
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
