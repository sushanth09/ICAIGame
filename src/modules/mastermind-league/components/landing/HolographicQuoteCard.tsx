"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.33, 1, 0.68, 1];

interface HolographicQuoteCardProps {
  children: React.ReactNode;
  className?: string;
}

export function HolographicQuoteCard({ children, className = "" }: HolographicQuoteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    setTilt({ x: -y * 10, y: x * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.35, duration: 0.75, ease: EASE }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden rounded-xl max-w-lg mx-auto mb-12 group ${className}`}
    >
      <motion.div
        animate={{
          boxShadow: [
            "0 0 24px rgba(20, 88, 134, 0.25)",
            "0 0 40px rgba(20, 88, 134, 0.35)",
            "0 0 24px rgba(20, 88, 134, 0.25)",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative px-6 py-5 rounded-xl border border-icai-light-blue/20 overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
        }}
      >
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(${110 + tilt.y * 2}deg, transparent 40%, rgba(177, 201, 235, 0.2) 50%, transparent 60%)`,
              transform: `translateX(${tilt.y * 20}px)`,
            }}
          />
        )}
        <p className="text-icai-light-blue text-base md:text-lg italic relative z-10">
          {children}
        </p>
      </motion.div>
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(20,88,134,0.06) 0%, transparent 50%)",
        }}
      />
    </motion.div>
  );
}
