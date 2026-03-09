"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.25, 0.46, 0.45, 0.94];

interface EnhancedStartButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}

export function EnhancedStartButton({ onClick, disabled, children }: EnhancedStartButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsClicked(true);
    onClick();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.65, duration: 0.7, ease: EASE }}
      className="relative inline-block"
    >
      <motion.div
        animate={{
          boxShadow: disabled
            ? "none"
            : [
                "0 0 20px rgba(245, 197, 66, 0.2)",
                "0 0 36px rgba(245, 197, 66, 0.35)",
                "0 0 20px rgba(245, 197, 66, 0.2)",
              ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-xl p-1"
      >
        <motion.div
          className="absolute inset-0 rounded-xl opacity-30"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(245,197,66,0.3) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          whileHover={disabled ? {} : { scale: 1.05 }}
          whileTap={disabled ? {} : { scale: 0.98 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={`relative z-10 px-12 py-5 rounded-xl text-xl font-bold transition-all duration-300 ${
            disabled
              ? "bg-icai-dark-grey text-icai-light-grey/60 cursor-not-allowed"
              : "bg-gradient-to-b from-[#F5C542] to-[#D4A93A] text-[#050A1F] cursor-pointer shadow-lg hover:shadow-[0_0_40px_rgba(245,197,66,0.5)]"
          }`}
        >
          {isClicked && (
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-xl bg-[#F5C542] pointer-events-none"
            />
          )}
          {children}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
