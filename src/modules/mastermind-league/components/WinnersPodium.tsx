"use client";

import { motion } from "framer-motion";
import type { LeaderboardEntry } from "../types/gameTypes";

const EASE = [0.33, 1, 0.68, 1] as const;

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M5 16L3 7l5.5 3L12 4l3.5 6L21 7l-2 9H5zm2.3-2h9.4l.7-3.1-2.5 1.4L12 10.1 8.1 12.3 5.6 10.9 7.3 14z" />
    </svg>
  );
}

type PodiumSlot = {
  rank: 1 | 2 | 3;
  entry: LeaderboardEntry | null;
  height: string;
  medal: string;
  bar: string;
  barGlow: string;
  nameColor: string;
};

export function WinnersPodium({ entries }: { entries: LeaderboardEntry[] }) {
  const sorted = [...entries].sort((a, b) => a.rank - b.rank);
  const first = sorted.find((e) => e.rank === 1) ?? null;
  const second = sorted.find((e) => e.rank === 2) ?? null;
  const third = sorted.find((e) => e.rank === 3) ?? null;

  const slots: PodiumSlot[] = [
    {
      rank: 2,
      entry: second,
      height: "min(38vw, 148px)",
      medal: "linear-gradient(180deg, #E8ECEF 0%, #B0B8C1 45%, #7A8490 100%)",
      bar: "linear-gradient(180deg, rgba(192,198,206,0.95) 0%, rgba(120,128,138,0.88) 100%)",
      barGlow: "rgba(192,198,206,0.35)",
      nameColor: "#C0C6CE",
    },
    {
      rank: 1,
      entry: first,
      height: "min(48vw, 198px)",
      medal: "linear-gradient(180deg, #FFE566 0%, #FFBD59 40%, #C78A12 100%)",
      bar: "linear-gradient(180deg, rgba(255,214,102,0.98) 0%, rgba(212,148,15,0.92) 100%)",
      barGlow: "rgba(255,189,89,0.55)",
      nameColor: "#FFBD59",
    },
    {
      rank: 3,
      entry: third,
      height: "min(32vw, 124px)",
      medal: "linear-gradient(180deg, #E8A878 0%, #CD7F32 50%, #8B5A2B 100%)",
      bar: "linear-gradient(180deg, rgba(205,127,50,0.95) 0%, rgba(120,70,28,0.9) 100%)",
      barGlow: "rgba(205,127,50,0.35)",
      nameColor: "#D4A574",
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6"
        style={{ minHeight: "min(52vw, 220px)" }}
      >
        {slots.map((slot) => (
          <motion.div
            key={slot.rank}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * slot.rank, duration: 0.55, ease: EASE }}
            className="flex-1 flex flex-col items-center max-w-[30%] sm:max-w-none"
            style={{ maxWidth: slot.rank === 1 ? "34%" : "30%" }}
          >
            <div className="relative mb-2 flex flex-col items-center w-full">
              {slot.rank === 1 && slot.entry && (
                <motion.div
                  className="absolute -top-7 text-[#FFBD59] drop-shadow-[0_0_12px_rgba(255,189,89,0.7)]"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CrownIcon className="w-8 h-8 sm:w-9 sm:h-9" />
                </motion.div>
              )}
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className="w-full rounded-t-xl px-2 sm:px-3 pt-3 pb-2 text-center"
                style={{
                  background:
                    slot.rank === 1
                      ? "linear-gradient(165deg, rgba(255,189,89,0.22) 0%, rgba(20,88,134,0.2) 100%)"
                      : "rgba(20,88,134,0.14)",
                  border: `1px solid ${
                    slot.rank === 1
                      ? "rgba(255,189,89,0.45)"
                      : "rgba(177,201,235,0.22)"
                  }`,
                  boxShadow:
                    slot.rank === 1
                      ? "0 12px 40px rgba(255,189,89,0.18), 0 0 0 1px rgba(255,189,89,0.08)"
                      : "0 8px 24px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  className="mx-auto mb-1.5 rounded-full font-black text-xs sm:text-sm tabular-nums flex items-center justify-center"
                  style={{
                    width: 28,
                    height: 28,
                    background: slot.medal,
                    color: slot.rank === 1 ? "#3D2800" : "#1a1a1a",
                    boxShadow: `0 0 12px ${slot.barGlow}`,
                  }}
                >
                  {slot.rank}
                </div>
                <p
                  className="font-bold text-[10px] sm:text-xs truncate w-full leading-tight"
                  style={{ color: slot.nameColor }}
                  title={slot.entry?.playerName}
                >
                  {slot.entry?.playerName ?? "—"}
                </p>
                <p className="text-[9px] sm:text-[10px] text-[#B1C9EB]/55 truncate w-full mt-0.5">
                  {slot.entry?.chapter || " "}
                </p>
                <p
                  className="font-black text-sm sm:text-lg tabular-nums mt-1"
                  style={{ color: slot.nameColor }}
                >
                  {slot.entry
                    ? slot.entry.disqualified
                      ? slot.entry.displayScore ?? 0
                      : slot.entry.score
                    : "—"}
                </p>
              </motion.div>
            </div>
            <motion.div
              className="w-full rounded-b-lg"
              style={{
                height: slot.height,
                background: slot.bar,
                boxShadow: `0 0 24px ${slot.barGlow}, inset 0 1px 0 rgba(255,255,255,0.12)`,
              }}
              whileHover={{ filter: "brightness(1.06)" }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        ))}
      </div>
      {!first && !second && !third && (
        <p className="text-center text-[#B1C9EB]/50 text-sm mt-4">
          Finish a run to claim a spot on the podium.
        </p>
      )}
    </div>
  );
}
