"use client";

import { motion } from "framer-motion";

const EASE = [0.33, 1, 0.68, 1] as const;

/** Visual order: Scholar (left) · Mastermind (center) · Rising Star (right) */
const SLOTS = [
  {
    place: 2 as const,
    title: "Scholar",
    range: "51–80 pts",
    icon: "📚",
    accent: "#FFBD59",
    cardH: "min(34vw, 140px)",
    barH: "min(28vw, 112px)",
    muted: false,
  },
  {
    place: 1 as const,
    title: "Mastermind",
    range: "81+ pts",
    icon: "🧠",
    accent: "#FFBD59",
    cardH: "min(42vw, 188px)",
    barH: "min(40vw, 168px)",
    muted: false,
  },
  {
    place: 3 as const,
    title: "Rising Star",
    range: "0–50 pts",
    icon: "⭐",
    accent: "#B1C9EB",
    cardH: "min(30vw, 120px)",
    barH: "min(24vw, 96px)",
    muted: true,
  },
] as const;

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M5 16L3 7l5.5 3L12 4l3.5 6L21 7l-2 9H5zm2.3-2h9.4l.7-3.1-2.5 1.4L12 10.1 8.1 12.3 5.6 10.9 7.3 14z" />
    </svg>
  );
}

export function TitlesPodium() {
  return (
    <div className="w-full max-w-xl mx-auto px-1">
      <div
        className="flex items-end justify-center gap-2 sm:gap-4"
        style={{ minHeight: "min(52vw, 240px)" }}
      >
        {SLOTS.map((slot, i) => (
          <motion.div
            key={slot.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 * i, duration: 0.45, ease: EASE }}
            className="flex-1 flex flex-col items-center max-w-[34%]"
            style={{
              transform: "translateZ(0)",
              willChange: "transform, opacity",
            }}
          >
            <div className="relative mb-2 w-full flex flex-col items-center">
              {slot.place === 1 && (
                <motion.div
                  className="absolute -top-6 text-[#FFBD59] drop-shadow-[0_0_10px_rgba(255,189,89,0.6)]"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transform: "translateZ(0)" }}
                >
                  <CrownIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                </motion.div>
              )}
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                className="w-full rounded-t-xl px-2 sm:px-3 pt-3 pb-2 text-center"
                style={{
                  minHeight: slot.cardH,
                  background: slot.muted
                    ? "rgba(20,88,134,0.14)"
                    : "linear-gradient(165deg, rgba(255,189,89,0.2) 0%, rgba(20,88,134,0.18) 100%)",
                  border: `1px solid ${
                    slot.place === 1 ? "rgba(255,189,89,0.5)" : "rgba(177,201,235,0.22)"
                  }`,
                  boxShadow:
                    slot.place === 1
                      ? "0 14px 36px rgba(255,189,89,0.2), 0 0 0 1px rgba(255,189,89,0.08)"
                      : "0 8px 24px rgba(0,0,0,0.2)",
                  transform: "translateZ(0)",
                }}
              >
                <span className="text-xl sm:text-2xl block mb-1" aria-hidden>
                  {slot.icon}
                </span>
                <p
                  className="font-black text-xs sm:text-sm leading-tight"
                  style={{ color: slot.accent }}
                >
                  {slot.title}
                </p>
                <p className="text-[10px] sm:text-xs text-icai-light-blue/50 mt-1">{slot.range}</p>
                <p className="text-[9px] font-bold text-icai-light-blue/40 mt-1.5">
                  {slot.place === 1 ? "1st" : slot.place === 2 ? "2nd" : "3rd"}
                </p>
              </motion.div>
            </div>
            <div
              className="w-full rounded-b-lg"
              style={{
                height: slot.barH,
                background:
                  slot.place === 1
                    ? "linear-gradient(180deg, rgba(255,214,102,0.95) 0%, rgba(212,148,15,0.9) 100%)"
                    : slot.place === 2
                      ? "linear-gradient(180deg, rgba(255,189,89,0.55) 0%, rgba(180,120,20,0.75) 100%)"
                      : "linear-gradient(180deg, rgba(177,201,235,0.35) 0%, rgba(20,88,134,0.55) 100%)",
                boxShadow:
                  slot.place === 1
                    ? "0 0 20px rgba(255,189,89,0.45)"
                    : "0 0 12px rgba(20,88,134,0.25)",
                transform: "translateZ(0)",
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
