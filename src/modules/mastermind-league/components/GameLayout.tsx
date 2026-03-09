"use client";

import { motion } from "framer-motion";
import { ParticleBackground } from "./ParticleBackground";
import { SpotlightBackground } from "./SpotlightBackground";

const EASE_SMOOTH = [0.33, 1, 0.68, 1] as const;

interface GameLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function GameLayout({ children, className = "" }: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-icai-gradient relative overflow-hidden">
      {/* Particle network layer */}
      <ParticleBackground />

      {/* Spotlight ambient layers */}
      <SpotlightBackground />

      {/* Main content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: EASE_SMOOTH }}
        className={`relative container mx-auto px-4 py-8 md:py-12 ${className}`}
        style={{ zIndex: 2 }}
      >
        {children}
      </motion.main>
    </div>
  );
}
