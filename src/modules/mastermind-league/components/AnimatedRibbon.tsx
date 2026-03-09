"use client";

import { motion } from "framer-motion";

interface AnimatedRibbonProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedRibbon({ children, delay = 0, className = "" }: AnimatedRibbonProps) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ delay, duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      style={{ transformOrigin: "left center" }}
      className={`relative ${className}`}
    >
      <div className="relative overflow-hidden">
        {/* Main ribbon */}
        <div
          className="relative px-10 py-3 text-center"
          style={{
            background: "linear-gradient(135deg, #0A0147 0%, #145886 40%, #0A0147 100%)",
            borderTop: "2px solid #FFBD59",
            borderBottom: "2px solid #FFBD59",
          }}
        >
          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 30%, rgba(255,189,89,0.25) 50%, transparent 70%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{
              duration: 2.5,
              delay: delay + 0.9,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "linear",
            }}
          />

          {/* Left star */}
          <motion.span
            className="absolute left-4 top-1/2 -translate-y-1/2 text-icai-yellow text-sm"
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            ✦
          </motion.span>

          <span className="relative z-10 font-bold text-icai-yellow tracking-[0.25em] text-xs md:text-sm uppercase">
            {children}
          </span>

          {/* Right star */}
          <motion.span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-icai-yellow text-sm"
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 2.5, delay: 1.25, repeat: Infinity, ease: "easeInOut" }}
          >
            ✦
          </motion.span>
        </div>

        {/* Bottom gold shadow line */}
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,189,89,0.6), transparent)",
          }}
        />
      </div>
    </motion.div>
  );
}
