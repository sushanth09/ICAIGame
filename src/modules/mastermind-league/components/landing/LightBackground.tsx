"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
}

const DOT_COUNT = 32;
const LINK_DIST = 115;

export function LightBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;
    const dots: Dot[] = [];

    const init = (W: number, H: number) => {
      dots.length = 0;
      for (let i = 0; i < DOT_COUNT; i++) {
        dots.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.22,
          r: 1.2 + Math.random() * 1.8,
          opacity: 0.05 + Math.random() * 0.1,
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.006;

      const W = canvas.width;
      const H = canvas.height;

      // Move dots
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;
      }

      // Connection lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(80, 110, 200, ${(1 - dist / LINK_DIST) * 0.07})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      // Dots
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(70, 100, 190, ${d.opacity})`;
        ctx.fill();
      }

      // Faint ambient chart line (primary)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(80, 110, 200, 0.07)";
      ctx.lineWidth = 1.5;
      for (let x = 0; x <= W; x += 4) {
        const y =
          H * 0.72 +
          Math.sin(x * 0.008 + time) * H * 0.04 +
          Math.sin(x * 0.022 + time * 1.4) * H * 0.02;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Faint gold accent line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(190, 130, 10, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 5) {
        const y =
          H * 0.55 +
          Math.sin(x * 0.01 + time * 0.85) * H * 0.03 +
          Math.cos(x * 0.016 + time * 1.2) * H * 0.015;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -1 }}>

      {/* ── Layer 1: finance video ───────────────────────────────────── */}
      <motion.video
        src="/bg-finance.mp4"
        autoPlay
        muted
        loop
        playsInline
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.65 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ── Layer 2: light frosted overlay ──────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(155deg, rgba(255,255,255,0.48) 0%, rgba(244,247,255,0.44) 35%, rgba(237,241,255,0.42) 65%, rgba(232,238,255,0.44) 100%)",
        }}
      />

      {/* ── Layer 3: canvas particles + chart lines ──────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 1 }}
      />
    </div>
  );
}
