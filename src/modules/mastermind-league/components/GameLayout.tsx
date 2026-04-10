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
    <div className="relative w-full min-w-0 max-w-full min-h-0 bg-icai-gradient md:h-[100dvh] md:max-h-[100dvh] md:overflow-hidden">
      {/* Background layers — pointer-events-none so touches scroll the page on mobile */}
      <CursorTrail />
      <ParticleBackground />
      <SpotlightBackground />

      {/* Single global sound toggle — top-left, always visible */}
      <div className="fixed top-4 left-4 z-[100] pointer-events-auto">
        <GlobalSoundToggle />
      </div>

      {/* Main: mobile = natural height (document scroll); desktop = fill + clip */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: EASE_SMOOTH }}
        className={`relative z-[2] w-full min-w-0 max-w-full block md:h-full md:min-h-0 md:overflow-hidden ${className}`}
      >
        {children}
      </motion.main>
    </div>
  );
}
