"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.25, 0.46, 0.45, 0.94];

interface EnhancedStartButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  delay?: number;
}

export function EnhancedStartButton({
  onClick,
  disabled,
  children,
  delay = 1.65,
}: EnhancedStartButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsClicked(true);
    onClick();
  };

  return (
    /* Entrance fade-up */
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: EASE }}
      className="relative inline-block"
    >
      {/*
        Heartbeat: scale 1 → 1.08 → 1, every 1.4 s
        Short duration (0.45 s) with a longer pause before repeat (0.95 s)
        = energetic but not distracting
      */}
      <motion.div
        animate={disabled ? {} : { scale: [1, 1.08, 1] }}
        transition={{
          duration: 0.45,
          repeat: Infinity,
          repeatDelay: 0.95,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* Pulsing gold glow ring */}
        <motion.div
          animate={
            disabled
              ? {}
              : {
                  boxShadow: [
                    "0 0 14px rgba(246, 196, 83, 0.2)",
                    "0 0 40px rgba(246, 196, 83, 0.55)",
                    "0 0 14px rgba(246, 196, 83, 0.2)",
                  ],
                }
          }
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative rounded-xl p-1"
        >
          {/* Radial shimmer behind button */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(246,196,83,0.25) 0%, transparent 70%)",
            }}
            animate={disabled ? {} : { scale: [1, 1.4, 1], opacity: [0.18, 0.42, 0.18] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            whileHover={disabled ? {} : { scale: 1.04 }}
            whileTap={disabled ? {} : { scale: 0.97 }}
            transition={{ duration: 0.18, ease: EASE }}
            style={{
              fontFamily: "var(--font-poppins), sans-serif",
              letterSpacing: "0.06em",
              fontWeight: 600,
            }}
            className={`relative z-10 px-14 py-5 rounded-xl text-xl transition-colors duration-300 ${
              disabled
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-b from-[#F6C453] to-[#D4920A] text-[#0D0D0D] cursor-pointer shadow-xl hover:from-[#FFD470] hover:to-[#E6A010]"
            }`}
          >
            {isClicked && (
              <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 3.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-xl bg-[#F6C453] pointer-events-none"
              />
            )}
            {children}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
