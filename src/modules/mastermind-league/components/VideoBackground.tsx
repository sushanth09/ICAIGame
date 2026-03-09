"use client";

import { useEffect, useRef } from "react";

interface ChartPoint {
  x: number;
  y: number;
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

export function VideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    function drawFrame() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.008;

      const W = canvas.width;
      const H = canvas.height;

      // Subtle grid
      ctx.strokeStyle = "rgba(20, 88, 134, 0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Primary chart line — slow sinusoidal
      const pts1: ChartPoint[] = [];
      for (let x = 0; x <= W; x += 6) {
        const y =
          H * 0.55 +
          Math.sin(x * 0.008 + time) * H * 0.08 +
          Math.sin(x * 0.02 + time * 1.3) * H * 0.04 +
          Math.cos(x * 0.004 + time * 0.7) * H * 0.06;
        pts1.push({ x, y });
      }
      generatePath(ctx, pts1, "rgba(20, 88, 134, 0.18)", 1.5);

      // Secondary chart line
      const pts2: ChartPoint[] = [];
      for (let x = 0; x <= W; x += 6) {
        const y =
          H * 0.38 +
          Math.sin(x * 0.012 + time * 0.9) * H * 0.06 +
          Math.cos(x * 0.008 + time * 1.5) * H * 0.03;
        pts2.push({ x, y });
      }
      generatePath(ctx, pts2, "rgba(177, 201, 235, 0.1)", 1);

      // Accent (yellow) line — subtle
      const pts3: ChartPoint[] = [];
      for (let x = 0; x <= W; x += 8) {
        const y =
          H * 0.7 +
          Math.sin(x * 0.006 + time * 0.6) * H * 0.05 +
          Math.cos(x * 0.015 + time * 1.1) * H * 0.025;
        pts3.push({ x, y });
      }
      generatePath(ctx, pts3, "rgba(255, 189, 89, 0.07)", 1);

      // Floating data dots along primary line
      pts1.forEach((pt, i) => {
        if (i % 60 === 0) {
          const pulse = Math.abs(Math.sin(time * 2 + i));
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2 + pulse * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(20, 88, 134, ${0.2 + pulse * 0.3})`;
          ctx.fill();
        }
      });

      // Vertical highlight bars (candlestick-like)
      for (let i = 0; i < 6; i++) {
        const barX = ((i / 6 + time * 0.03) % 1) * W;
        const barH = H * 0.1 + Math.sin(time + i) * H * 0.06;
        const barY = H * 0.4 + Math.sin(time * 0.5 + i * 0.8) * H * 0.1;
        ctx.fillStyle = `rgba(20, 88, 134, 0.04)`;
        ctx.fillRect(barX - 8, barY, 16, barH);
        ctx.fillStyle = `rgba(255, 189, 89, 0.05)`;
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
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -1 }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.9 }}
      />
      {/* Gradient overlay to maintain readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(15,14,12,0.88) 0%, rgba(10,1,71,0.92) 40%, rgba(20,88,134,0.82) 100%)",
        }}
      />
    </div>
  );
}
