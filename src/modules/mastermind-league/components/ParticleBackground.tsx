"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const OPTIONS: ISourceOptions = {
  fullScreen: false,
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "grab" },
      onClick: { enable: true, mode: "repulse" },
    },
    modes: {
      grab: {
        distance: 180,
        links: { opacity: 0.3, color: "#145886" },
      },
      repulse: { distance: 100, duration: 0.35 },
    },
  },
  particles: {
    color: { value: ["#145886", "#B1C9EB", "#FFBD59"] },
    links: {
      color: "#B1C9EB",
      distance: 100,
      enable: true,
      opacity: 0.15,
      width: 0.6,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: { default: "bounce" },
      random: true,
      speed: 0.4,
      straight: false,
    },
    number: {
      density: { enable: true, width: 1200, height: 800 },
      value: 35,
    },
    opacity: { value: { min: 0.15, max: 0.5 } },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 2 } },
  },
};

export function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  if (!init) return <div className="fixed inset-0 -z-10" />;

  return (
    <div className="fixed inset-0 -z-10">
      <Particles id="mastermind-particles" options={OPTIONS} className="w-full h-full" />
    </div>
  );
}
