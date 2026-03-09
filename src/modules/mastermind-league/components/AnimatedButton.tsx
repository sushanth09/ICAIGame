"use client";

import { motion } from "framer-motion";

const EASE_OUT = [0.25, 0.46, 0.45, 0.94];

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}

export function AnimatedButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  type = "button",
}: AnimatedButtonProps) {
  const styles = {
    primary: {
      background: disabled
        ? "rgba(15,14,12,0.6)"
        : "linear-gradient(160deg, #FFBD59 0%, #D4940F 100%)",
      color: disabled ? "rgba(232,233,228,0.3)" : "#0A0147",
      border: disabled ? "1px solid rgba(255,189,89,0.1)" : "none",
      boxShadow: disabled
        ? "none"
        : "0 4px 20px rgba(255,189,89,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
    },
    secondary: {
      background: "rgba(20, 88, 134, 0.25)",
      color: "#B1C9EB",
      border: "1px solid rgba(20, 88, 134, 0.5)",
      boxShadow: "0 4px 16px rgba(20,88,134,0.2)",
    },
    outline: {
      background: "transparent",
      color: "#FFBD59",
      border: "1px solid rgba(255,189,89,0.5)",
      boxShadow: "none",
    },
  };

  const s = styles[variant];

  return (
    <motion.div
      whileHover={disabled ? {} : { scale: 1.04 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      className="relative inline-block"
    >
      {/* Outer glow (only for primary, non-disabled) */}
      {variant === "primary" && !disabled && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: [
              "0 0 16px rgba(255,189,89,0.2)",
              "0 0 36px rgba(255,189,89,0.45)",
              "0 0 16px rgba(255,189,89,0.2)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`relative px-8 py-4 rounded-xl text-base font-bold tracking-wide overflow-hidden transition-colors ${className}`}
        style={{
          ...s,
          cursor: disabled ? "not-allowed" : "pointer",
          fontFamily: "var(--font-poppins)",
        }}
      >
        {/* Shimmer on hover */}
        {!disabled && variant === "primary" && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.25) 50%, transparent 75%)",
            }}
            animate={{ x: ["-120%", "220%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </motion.button>
    </motion.div>
  );
}
