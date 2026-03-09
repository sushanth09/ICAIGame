"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface WarpTransitionProps {
  onComplete: () => void;
}

export function WarpTransition({ onComplete }: WarpTransitionProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 overflow-hidden pointer-events-none"
    >
      <motion.div
        initial={{ scale: 1, opacity: 0.4 }}
        animate={{
          scale: [1, 1.4, 2.8],
          opacity: [0.4, 0.7, 1],
        }}
        transition={{
          duration: 1.8,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, #0F0E0C 0%, #0A0147 40%, #145886 100%)",
        }}
      />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1.2, 2],
          opacity: [0, 0.8, 1],
        }}
        transition={{
          duration: 1.5,
          delay: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(177,201,235,0.2) 0%, transparent 60%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 2,
          times: [0, 0.2, 0.7, 1],
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [0.5, 1, 1.2],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: 0.3,
          }}
          className="text-4xl font-bold text-icai-yellow"
        >
          LET&apos;S GO
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
