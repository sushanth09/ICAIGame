/**
 * Shared Web Audio “music” pad + arpeggio. One engine for the whole session.
 * Start after user gesture (game begin / unmute). Toggle only stops when user mutes.
 */

import { getSoundEnabled } from "../hooks/useSoundSystem";

const PAD_NOTES = [
  { freq: 65.41, gain: 0.1 },
  { freq: 98.0, gain: 0.08 },
  { freq: 130.81, gain: 0.07 },
  { freq: 164.81, gain: 0.05 },
  { freq: 196.0, gain: 0.04 },
  { freq: 246.94, gain: 0.03 },
];

const ARP_FREQS = [261.63, 329.63, 392.0, 493.88, 587.33, 493.88, 392.0, 329.63];

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let arpTimer: ReturnType<typeof setTimeout> | null = null;
let arpIdx = 0;
let engineReady = false;
/** True while pad + arp should be running (respects mute via gain). */
let wantsPlayback = false;
/** True after quiz play has started — unmute on landing should not start music. */
let sessionStarted = false;

function clearArp() {
  if (arpTimer != null) {
    clearTimeout(arpTimer);
    arpTimer = null;
  }
}

function scheduleArp() {
  if (!ctx || !master || !wantsPlayback) return;

  const freq = ARP_FREQS[arpIdx % ARP_FREQS.length];
  arpIdx += 1;

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

  arpTimer = setTimeout(scheduleArp, 620);
}

export function initBackgroundMusicEngine(): void {
  if (engineReady || typeof window === "undefined") return;

  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioCtx = new Ctor();
  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);

  const comp = audioCtx.createDynamicsCompressor();
  comp.threshold.setValueAtTime(-18, audioCtx.currentTime);
  comp.knee.setValueAtTime(6, audioCtx.currentTime);
  comp.ratio.setValueAtTime(3, audioCtx.currentTime);
  comp.attack.setValueAtTime(0.003, audioCtx.currentTime);
  comp.release.setValueAtTime(0.25, audioCtx.currentTime);
  masterGain.connect(comp);
  comp.connect(audioCtx.destination);

  for (const { freq, gain } of PAD_NOTES) {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * (1 + (Math.random() - 0.5) * 0.003), audioCtx.currentTime);
    g.gain.setValueAtTime(gain, audioCtx.currentTime);
    osc.connect(g);
    g.connect(masterGain);
    osc.start();
  }

  ctx = audioCtx;
  master = masterGain;
  engineReady = true;
}

/** Call when quiz play starts (Round 1). Respects mute preference. */
export function startGameBackgroundMusic(): void {
  if (!getSoundEnabled()) return;
  initBackgroundMusicEngine();
  if (!ctx || !master) return;
  void ctx.resume().catch(() => {});
  wantsPlayback = true;
  sessionStarted = true;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 1.0);
  clearArp();
  scheduleArp();
}

/** User muted or left game — fade out and stop arp. */
export function stopGameBackgroundMusic(): void {
  wantsPlayback = false;
  clearArp();
  if (ctx && master) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.55);
  }
}

/** After mute → unmute during a session that had already started music. */
export function resumeGameBackgroundMusicIfPreferred(): void {
  if (!getSoundEnabled() || !sessionStarted) return;
  initBackgroundMusicEngine();
  if (!ctx || !master) return;
  void ctx.resume().catch(() => {});
  wantsPlayback = true;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.8);
  clearArp();
  scheduleArp();
}

/** Leaving the game — stop audio and clear session so landing doesn’t resume music. */
export function resetGameMusicSession(): void {
  sessionStarted = false;
  wantsPlayback = false;
  clearArp();
  if (ctx && master) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.55);
  }
}
