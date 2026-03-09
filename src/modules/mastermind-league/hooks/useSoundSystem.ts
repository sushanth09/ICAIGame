"use client";

import { useCallback, useRef, useEffect } from "react";

const STORAGE_KEY = "mastermind_sound_enabled";

export function getSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === "true"; // default ON
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, String(enabled));
  // Dispatch a custom event so other components can react
  window.dispatchEvent(new CustomEvent("soundToggle", { detail: { enabled } }));
}

type AudioCtxCompat = AudioContext & { createOscillator: () => OscillatorNode };

function getAudioContext(ref: React.MutableRefObject<AudioContext | null>): AudioContext | null {
  try {
    if (!ref.current) {
      const Ctor =
        window.AudioContext ||
        ((window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
      ref.current = new Ctor() as AudioCtxCompat;
    }
    if (ref.current.state === "suspended") {
      ref.current.resume().catch(() => {});
    }
    return ref.current;
  } catch {
    return null;
  }
}

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);

  const playCorrect = useCallback(() => {
    if (!getSoundEnabled()) return;
    try {
      const ctx = getAudioContext(ctxRef);
      if (!ctx) return;
      // Bright ascending chord: C5–E5–G5
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.11, ctx.currentTime + i * 0.08 + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 1.0);
      });
    } catch {}
  }, []);

  const playWrong = useCallback(() => {
    if (!getSoundEnabled()) return;
    try {
      const ctx = getAudioContext(ctxRef);
      if (!ctx) return;
      // Descending dissonant buzz
      [220, 196].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.7);
      });
    } catch {}
  }, []);

  const playClick = useCallback(() => {
    if (!getSoundEnabled()) return;
    try {
      const ctx = getAudioContext(ctxRef);
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }, []);

  const playTransition = useCallback(() => {
    if (!getSoundEnabled()) return;
    try {
      const ctx = getAudioContext(ctxRef);
      if (!ctx) return;
      // Rising arpeggio sweep
      [261.63, 329.63, 392.0, 523.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.09);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + i * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.09);
        osc.stop(ctx.currentTime + i * 0.09 + 0.7);
      });
    } catch {}
  }, []);

  const playHover = useCallback(() => {
    if (!getSoundEnabled()) return;
    try {
      const ctx = getAudioContext(ctxRef);
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  }, []);

  const playCoinReward = useCallback(() => {
    if (!getSoundEnabled()) return;
    try {
      const ctx = getAudioContext(ctxRef);
      if (!ctx) return;
      // Coin jingle: quick ascending notes
      [784, 880, 1047, 1175].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + i * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.5);
      });
    } catch {}
  }, []);

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  return { playCorrect, playWrong, playClick, playTransition, playHover, playCoinReward };
}
