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
    setTilt({ x: -y * 9, y: x * 9 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => setIsHovered(true);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.3, duration: 0.85, ease: EASE }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden rounded-2xl max-w-lg mx-auto mb-12 group ${className}`}
    >
      {/* Outer pulsing glow ring */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 28px rgba(255, 189, 89, 0.08), 0 0 60px rgba(20, 88, 134, 0.18)",
            "0 0 48px rgba(255, 189, 89, 0.18), 0 0 90px rgba(20, 88, 134, 0.28)",
            "0 0 28px rgba(255, 189, 89, 0.08), 0 0 60px rgba(20, 88, 134, 0.18)",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.045)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 189, 89, 0.22)",
        }}
      >
        {/* Top gold shimmer line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,189,89,0.55) 40%, rgba(255,255,255,0.3) 50%, rgba(255,189,89,0.55) 60%, transparent 100%)",
          }}
        />

        {/* Decorative large quote mark */}
        <div
          className="absolute -top-1 left-5 leading-none select-none pointer-events-none"
          style={{
            fontSize: "7rem",
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: "rgba(255, 189, 89, 0.1)",
            lineHeight: 1,
          }}
        >
          ❝
        </div>

        {/* Holographic sweep on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(${108 + tilt.y * 2}deg, transparent 35%, rgba(177, 201, 235, 0.18) 50%, transparent 65%)`,
              transform: `translateX(${tilt.y * 18}px)`,
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 px-8 py-7 pt-9">
          <p
            className="text-icai-light-blue text-base md:text-lg italic leading-relaxed text-center"
            style={{ textShadow: "0 0 20px rgba(177,201,235,0.2)" }}
          >
            {children}
          </p>

          {/* Attribution divider */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <div
              className="h-px flex-1 max-w-[60px]"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(255, 189, 89, 0.3))",
              }}
            />
            <span
              className="text-xs tracking-[0.25em] uppercase font-semibold"
              style={{ color: "rgba(255, 189, 89, 0.5)" }}
            >
              Mastermind League
            </span>
            <div
              className="h-px flex-1 max-w-[60px]"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(255, 189, 89, 0.3))",
              }}
            />
          </div>
        </div>

        {/* Bottom gold shimmer line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,189,89,0.2) 50%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* Floating ambient glow beneath */}
      <motion.div
        animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,88,134,0.07) 0%, transparent 55%)",
        }}
      />
    </motion.div>
  );
}
