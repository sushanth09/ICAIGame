"use client";

import { useEffect, useRef } from "react";

interface ChartPoint {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
  kind: "blue" | "gold" | "silver";
}

function generatePath(
  ctx: CanvasRenderingContext2D,
  points: ChartPoint[],
  color: string,
  lineWidth: number
) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "round";
  points.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.stroke();
}

const KINDS: Array<Particle["kind"]> = [
  "blue", "blue", "blue", "blue",
  "gold", "gold",
  "silver",
];

const KIND_RGB: Record<Particle["kind"], [number, number, number]> = {
  blue:   [20,  88,  134],
  gold:   [255, 189, 89],
  silver: [177, 201, 235],
};

const PARTICLE_COUNT = 55;
const NODE_COUNT = 9;
const LINK_DIST = 140;

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── Canvas animation (particles + charts + nodes) ─────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const particles: Particle[] = [];

    const initParticles = (W: number, H: number) => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.28 - 0.07,
          size: 0.7 + Math.random() * 1.9,
          baseOpacity: 0.12 + Math.random() * 0.38,
          kind: KINDS[Math.floor(Math.random() * KINDS.length)],
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    function drawFrame() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.007;

      const W = canvas.width;
      const H = canvas.height;

      // ── Subtle grid ──────────────────────────────────────────────
      ctx.strokeStyle = "rgba(20, 88, 134, 0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 80) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 80) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // ── Move particles ───────────────────────────────────────────
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      }

      // ── Particle–particle connection lines ───────────────────────
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(20, 88, 134, ${(1 - d / LINK_DIST) * 0.055})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // ── Draw particles ───────────────────────────────────────────
      for (const p of particles) {
        const [r, g, b] = KIND_RGB[p.kind];
        const pulse = Math.abs(Math.sin(time * 1.4 + p.x * 0.011));
        const alpha = p.baseOpacity * (0.55 + pulse * 0.45);
        if (p.kind === "gold") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.12})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      }

      // ── Glowing network nodes ─────────────────────────────────────
      const nodePositions: { x: number; y: number }[] = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        const nx = (W / NODE_COUNT) * i + W / NODE_COUNT / 2;
        const ny = H * 0.3 + Math.sin(time * 0.38 + i * 1.15) * H * 0.14;
        nodePositions.push({ x: nx, y: ny });

        const pulse = Math.abs(Math.sin(time * 0.75 + i * 0.65));
        const isGold = i % 3 === 0;

        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, 14 + pulse * 9);
        if (isGold) {
          grad.addColorStop(0, `rgba(255, 189, 89, ${0.14 + pulse * 0.22})`);
          grad.addColorStop(1, "rgba(255, 189, 89, 0)");
        } else {
          grad.addColorStop(0, `rgba(20, 88, 134, ${0.1 + pulse * 0.14})`);
          grad.addColorStop(1, "rgba(20, 88, 134, 0)");
        }
        ctx.beginPath();
        ctx.arc(nx, ny, 14 + pulse * 9, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(nx, ny, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isGold
          ? `rgba(255, 189, 89, ${0.5 + pulse * 0.45})`
          : `rgba(177, 201, 235, ${0.35 + pulse * 0.35})`;
        ctx.fill();
      }

      // ── Connect adjacent nodes ────────────────────────────────────
      for (let i = 0; i < nodePositions.length - 1; i++) {
        const pulse = Math.abs(Math.sin(time * 0.5 + i * 0.8));
        ctx.beginPath();
        ctx.moveTo(nodePositions[i].x, nodePositions[i].y);
        ctx.lineTo(nodePositions[i + 1].x, nodePositions[i + 1].y);
        ctx.strokeStyle = `rgba(20, 88, 134, ${0.045 + pulse * 0.05})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      // ── Primary chart line ────────────────────────────────────────
      const pts1: ChartPoint[] = [];
      for (let x = 0; x <= W; x += 6) {
        pts1.push({
          x,
          y:
            H * 0.55 +
            Math.sin(x * 0.008 + time) * H * 0.08 +
            Math.sin(x * 0.02 + time * 1.3) * H * 0.04 +
            Math.cos(x * 0.004 + time * 0.7) * H * 0.06,
        });
      }
      generatePath(ctx, pts1, "rgba(20, 88, 134, 0.22)", 1.5);

      // ── Secondary chart line ──────────────────────────────────────
      const pts2: ChartPoint[] = [];
      for (let x = 0; x <= W; x += 6) {
        pts2.push({
          x,
          y:
            H * 0.38 +
            Math.sin(x * 0.012 + time * 0.9) * H * 0.06 +
            Math.cos(x * 0.008 + time * 1.5) * H * 0.03,
        });
      }
      generatePath(ctx, pts2, "rgba(177, 201, 235, 0.13)", 1);

      // ── Accent gold chart line ────────────────────────────────────
      const pts3: ChartPoint[] = [];
      for (let x = 0; x <= W; x += 8) {
        pts3.push({
          x,
          y:
            H * 0.7 +
            Math.sin(x * 0.006 + time * 0.6) * H * 0.05 +
            Math.cos(x * 0.015 + time * 1.1) * H * 0.025,
        });
      }
      generatePath(ctx, pts3, "rgba(255, 189, 89, 0.1)", 1.2);

      // ── Data dots along primary line ──────────────────────────────
      pts1.forEach((pt, i) => {
        if (i % 60 === 0) {
          const pulse = Math.abs(Math.sin(time * 2 + i));
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2 + pulse * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(20, 88, 134, ${0.22 + pulse * 0.3})`;
          ctx.fill();
        }
      });

      // ── Candlestick bars ──────────────────────────────────────────
      for (let i = 0; i < 6; i++) {
        const barX = ((i / 6 + time * 0.03) % 1) * W;
        const barH = H * 0.1 + Math.sin(time + i) * H * 0.06;
        const barY = H * 0.4 + Math.sin(time * 0.5 + i * 0.8) * H * 0.1;
        ctx.fillStyle = "rgba(20, 88, 134, 0.04)";
        ctx.fillRect(barX - 8, barY, 16, barH);
        ctx.fillStyle = "rgba(255, 189, 89, 0.055)";
        ctx.fillRect(barX - 2, barY + barH * 0.2, 4, barH * 0.6);
      }

      animationId = requestAnimationFrame(drawFrame);
    }

    drawFrame();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }} aria-hidden>

      {/* ── Layer 1: actual video ──────────────────────────────────── */}
      <video
        ref={videoRef}
        src="/bg-finance.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.55, filter: "brightness(1.15) contrast(1.1)" }}
      />

      {/* ── Layer 2: canvas data-viz overlay ──────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.65 }}
      />

      {/* ── Layer 3: dark gradient overlay (lighter than before) ──── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(4,6,20,0.68) 0%, rgba(10,1,71,0.74) 40%, rgba(20,88,134,0.62) 100%)",
        }}
      />
    </div>
  );
}
