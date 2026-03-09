"use client";

import { useEffect, useRef, useState } from "react";

// ── Coin trail config ──────────────────────────────────────────────────────
const MAX_COINS     = 10;       // max simultaneous coins on screen
const COIN_LIFE_MS  = 800;      // how long each coin lives
const EMIT_DELAY_MS = 85;       // min ms between emitting new coins
const PRUNE_MS      = 60;       // garbage-collect interval
const FLOAT_PX      = 32;       // how far each coin drifts upward

interface Coin {
  id: number;
  x: number;
  y: number;
  drift: number;   // horizontal drift (-1 … 1)
  size: number;    // diameter in px
  createdAt: number;
}

// ── Single coin renderer ───────────────────────────────────────────────────
function CoinParticle({ coin }: { coin: Coin }) {
  const age      = Date.now() - coin.createdAt;
  const progress = Math.min(1, age / COIN_LIFE_MS);
  const opacity  = Math.max(0, (1 - progress) * 0.75);

  if (opacity < 0.01) return null;

  const floatY   = progress * FLOAT_PX;
  const driftX   = coin.drift * progress * 10;
  const scale    = 1 - progress * 0.25;   // shrinks slightly as it rises

  return (
    <div
      className="fixed pointer-events-none select-none"
      style={{
        left:   coin.x + driftX - coin.size / 2,
        top:    coin.y - floatY  - coin.size / 2,
        width:  coin.size,
        height: coin.size,
        borderRadius: "50%",
        /* Gold coin gradient with subtle 3-D rim */
        background:
          "radial-gradient(circle at 35% 30%, #FFE680 0%, #F6C453 45%, #C8900A 100%)",
        border: "1px solid rgba(255, 220, 80, 0.55)",
        boxShadow:
          "0 0 5px rgba(246,196,83,0.5), 0 1px 3px rgba(0,0,0,0.35)",
        opacity,
        transform: `scale(${scale})`,
        zIndex: 9999,
      }}
    />
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function CursorTrail() {
  const [coins, setCoins]   = useState<Coin[]>([]);
  const idRef               = useRef(0);
  const lastPos             = useRef({ x: 0, y: 0 });
  const lastEmit            = useRef(0);
  const rafRef              = useRef<number>();
  const pruneRef            = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      const { clientX, clientY } = e;

      // Skip emission when hovering over question cards (marked with data-no-cursor-trail)
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-no-cursor-trail]")) return;

      // Skip if cursor barely moved
      const dx = clientX - lastPos.current.x;
      const dy = clientY - lastPos.current.y;
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;

      // Throttle emission
      if (now - lastEmit.current < EMIT_DELAY_MS) return;

      lastPos.current  = { x: clientX, y: clientY };
      lastEmit.current = now;

      rafRef.current = requestAnimationFrame(() => {
        const coin: Coin = {
          id:        idRef.current++,
          x:         clientX,
          y:         clientY,
          drift:     (Math.random() - 0.5) * 2,
          size:      8 + Math.random() * 5,   // 8–13 px
          createdAt: now,
        };
        setCoins((prev) => [...prev.slice(-(MAX_COINS - 1)), coin]);
      });
    };

    // Remove expired coins periodically
    const prune = () => {
      const cutoff = Date.now() - COIN_LIFE_MS - 50;
      setCoins((prev) => prev.filter((c) => c.createdAt > cutoff));
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    pruneRef.current = setInterval(prune, PRUNE_MS);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafRef.current)  cancelAnimationFrame(rafRef.current);
      if (pruneRef.current) clearInterval(pruneRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {coins.map((c) => (
        <CoinParticle key={c.id} coin={c} />
      ))}
    </div>
  );
}
