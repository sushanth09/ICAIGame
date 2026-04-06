"use client";

import { motion } from "framer-motion";
import { ParticleBackground } from "./ParticleBackground";
import { SpotlightBackground } from "./SpotlightBackground";
import { CursorTrail } from "./landing/CursorTrail";
import { GlobalSoundToggle } from "./GlobalSoundToggle";

const EASE_SMOOTH = [0.33, 1, 0.68, 1] as const;

interface GameLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function GameLayout({ children, className = "" }: GameLayoutProps) {
  return (
    <div className="h-screen w-screen bg-icai-gradient relative md:overflow-hidden overflow-y-auto">
      {/* Background layers */}
      <CursorTrail />
      <ParticleBackground />
      <SpotlightBackground />

      {/* Single global sound toggle — top-left, always visible */}
      <div className="fixed top-4 left-4 z-[100]">
        <GlobalSoundToggle />
      </div>

      {/* Main content — no padding here; each page handles its own layout */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: EASE_SMOOTH }}
        className={`relative w-full h-full md:overflow-hidden ${className}`}
        style={{ zIndex: 2 }}
      >
        {children}
      </motion.main>
    </div>
  );
}
