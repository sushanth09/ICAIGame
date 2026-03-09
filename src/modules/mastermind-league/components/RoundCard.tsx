"use client";

import { motion } from "framer-motion";

const EASE = [0.33, 1, 0.68, 1] as const;

interface RoundCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  index?: number;
}

export function RoundCard({
  title,
  subtitle,
  description,
  icon,
  index = 0,
}: RoundCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: -18, scale: 0.92 }}
      animate={{ opacity: 1, rotateX: 0, scale: 1 }}
      transition={{
        delay: index * 0.18,
        duration: 0.8,
        ease: EASE,
      }}
      style={{ transformStyle: "preserve-3d", perspective: 800 }}
      className="rounded-xl border border-icai-blue/30 bg-icai-dark-grey/50 backdrop-blur-sm overflow-hidden"
    >
      <motion.div
        whileHover={{
          scale: 1.02,
          y: -4,
          boxShadow: "0 0 32px rgba(20, 88, 134, 0.25)",
        }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="p-6 h-full"
      >
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-xl font-bold text-icai-yellow mb-1">{title}</h3>
        <p className="text-sm text-icai-blue mb-3">{subtitle}</p>
        <p className="text-icai-light-blue/90 text-sm leading-relaxed">{description}</p>
      </motion.div>
    </motion.div>
  );
}
