"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { getSoundEnabled, setSoundEnabled } from "../../hooks/useSoundSystem";

// Ambient Cmaj9 pad: tonic, fifth, third, seventh, ninth
const PAD_NOTES = [
  { freq: 65.41,  gain: 0.10 }, // C2
  { freq: 98.00,  gain: 0.08 }, // G2
  { freq: 130.81, gain: 0.07 }, // C3
  { freq: 164.81, gain: 0.05 }, // E3
  { freq: 196.00, gain: 0.04 }, // G3
  { freq: 246.94, gain: 0.03 }, // B3
];

// Pentatonic arpeggio note sequence (C major pentatonic)
const ARP_FREQS = [261.63, 329.63, 392.00, 493.88, 587.33, 493.88, 392.00, 329.63];

export function AudioToggle() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const arpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const arpIdxRef = useRef(0);
  const initialized = useRef(false);
  const [isOn, setIsOn] = useState(() => getSoundEnabled());

  const scheduleArp = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;

    const freq = ARP_FREQS[arpIdxRef.current % ARP_FREQS.length];
    arpIdxRef.current += 1;

    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    env.gain.setValueAtTime(0, ctx.currentTime);
    env.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.06);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(env);
    env.connect(master);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.3);

    arpTimerRef.current = setTimeout(scheduleArp, 620);
  }, []);

  const init = useCallback(() => {
    if (initialized.current) return;
    initialized.current = true;

    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.setValueAtTime(-18, ctx.currentTime);
    comp.knee.setValueAtTime(6, ctx.currentTime);
    comp.ratio.setValueAtTime(3, ctx.currentTime);
    comp.attack.setValueAtTime(0.003, ctx.currentTime);
    comp.release.setValueAtTime(0.25, ctx.currentTime);
    master.connect(comp);
    comp.connect(ctx.destination);

    for (const { freq, gain } of PAD_NOTES) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * (1 + (Math.random() - 0.5) * 0.003), ctx.currentTime);
      g.gain.setValueAtTime(gain, ctx.currentTime);
      osc.connect(g);
      g.connect(master);
      osc.start();
    }

    ctxRef.current = ctx;
    masterRef.current = master;
  }, []);

  const toggle = useCallback(() => {
    init();
    const ctx = ctxRef.current!;
    const master = masterRef.current!;
    const nextOn = !isOn;

    if (nextOn) {
      if (ctx.state === "suspended") ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 1.2);
      scheduleArp();
    } else {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      if (arpTimerRef.current) clearTimeout(arpTimerRef.current);
    }

    setIsOn(nextOn);
    setSoundEnabled(nextOn);
  }, [isOn, init, scheduleArp]);

  // Sync with external sound toggle events
  useEffect(() => {
    const handler = (e: Event) => {
      const enabled = (e as CustomEvent<{ enabled: boolean }>).detail.enabled;
      setIsOn(enabled);
      // If ambient music is playing and sound gets disabled, mute it
      if (!enabled && masterRef.current && ctxRef.current) {
        masterRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
        masterRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 0.6);
        if (arpTimerRef.current) clearTimeout(arpTimerRef.current);
      }
    };
    window.addEventListener("soundToggle", handler);
    return () => window.removeEventListener("soundToggle", handler);
  }, []);

  useEffect(() => {
    return () => {
      if (arpTimerRef.current) clearTimeout(arpTimerRef.current);
      ctxRef.current?.close();
    };
  }, []);

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      title={isOn ? "Mute sounds" : "Enable sounds"}
      className="flex items-center justify-center w-9 h-9 rounded-full transition-colors"
      style={{
        background: isOn ? "rgba(246, 196, 83, 0.15)" : "rgba(255, 255, 255, 0.08)",
        border: `1px solid ${isOn ? "rgba(246,196,83,0.45)" : "rgba(255,255,255,0.18)"}`,
        backdropFilter: "blur(8px)",
        color: isOn ? "#F6C453" : "#9CA3AF",
      }}
    >
      {isOn ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
        </svg>
      )}
    </motion.button>
  );
}
