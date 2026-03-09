"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL_LENGTH = 6;
const PARTICLE_SIZE = 5;
const MOVE_THRESHOLD = 14;
const FADE_MS = 200;
const PRUNE_MS = 260;

interface TrailPoint {
  x: number;
  y: number;
  id: number;
  driftX: number;
  driftY: number;
  createdAt: number;
}

function TrailParticle({ point }: { point: TrailPoint }) {
  const age = Date.now() - point.createdAt;
  const opacity = Math.max(0, 1 - age / FADE_MS);
  const drift = Math.min(1, age / 80) * 6;
  const x = point.x + point.driftX * drift;
  const y = point.y + point.driftY * drift;

  if (opacity <= 0.01) return null;

  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: PARTICLE_SIZE,
        height: PARTICLE_SIZE,
        marginLeft: -PARTICLE_SIZE / 2,
        marginTop: -PARTICLE_SIZE / 2,
        background: "radial-gradient(circle, rgba(177,201,235,0.6) 0%, rgba(20,88,134,0.25) 100%)",
        boxShadow: "0 0 6px rgba(177,201,235,0.4)",
        opacity,
        transform: "translate(-50%, -50%)",
        transition: "opacity 0.06s ease-out",
      }}
    />
  );
}

export function CursorTrail() {
  const [points, setPoints] = useState<TrailPoint[]>([]);
  const idRef = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const rafRef = useRef<number>();
  const pruneRef = useRef<number>();

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      const { clientX, clientY } = e;
      const dx = clientX - lastPos.current.x;
      const dy = clientY - lastPos.current.y;
      if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
      if (now - lastTime.current < 16) return;

      lastPos.current = { x: clientX, y: clientY };
      lastTime.current = now;

      rafRef.current = requestAnimationFrame(() => {
        const newPoint: TrailPoint = {
          x: clientX,
          y: clientY,
          id: idRef.current++,
          driftX: (Math.random() - 0.5) * 2.5,
          driftY: (Math.random() - 0.5) * 2.5,
          createdAt: now,
        };
        setPoints((prev) => [...prev.slice(-TRAIL_LENGTH + 1), newPoint]);
      });
    };

    const prune = () => {
      const now = Date.now();
      setPoints((prev) => prev.filter((p) => now - p.createdAt < PRUNE_MS));
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    pruneRef.current = window.setInterval(prune, 50);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (pruneRef.current) clearInterval(pruneRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {points.map((p) => (
        <TrailParticle key={p.id} point={p} />
      ))}
    </div>
  );
}
