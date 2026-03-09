import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "Poppins", "system-ui", "sans-serif"],
      },
      colors: {
        icai: {
          blue: "#145886",
          "light-blue": "#B1C9EB",
          yellow: "#FFBD59",
          "dark-indigo": "#0A0147",
          "light-grey": "#E8E9E4",
          "dark-grey": "#0F0E0C",
        },
      },
      backgroundColor: {
        icai: {
          main: "#E8E9E4",
          dark: "#0F0E0C",
          card: "rgba(255,255,255,0.06)",
        },
      },
      backgroundImage: {
        "icai-gradient":
          "linear-gradient(160deg, #0F0E0C 0%, #0A0147 40%, #145886 100%)",
        "icai-gold":
          "linear-gradient(135deg, #FFBD59 0%, #E8A930 50%, #FFBD59 100%)",
        "icai-card":
          "linear-gradient(160deg, rgba(20,88,134,0.15) 0%, rgba(10,1,71,0.6) 100%)",
      },
      boxShadow: {
        "icai-glow":
          "0 0 24px rgba(255, 189, 89, 0.35), 0 0 48px rgba(255, 189, 89, 0.15)",
        "icai-glow-lg":
          "0 0 50px rgba(255, 189, 89, 0.5), 0 0 100px rgba(255, 189, 89, 0.25)",
        "icai-blue":
          "0 0 24px rgba(20, 88, 134, 0.4), 0 0 48px rgba(20, 88, 134, 0.2)",
        "icai-blue-lg":
          "0 0 50px rgba(20, 88, 134, 0.5), 0 0 100px rgba(177, 201, 235, 0.2)",
      },
      keyframes: {
        "spotlight-drift": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)", opacity: "0.6" },
          "25%": { transform: "translate(40px, -30px) scale(1.08)", opacity: "0.8" },
          "50%": { transform: "translate(-20px, 20px) scale(0.95)", opacity: "0.65" },
          "75%": { transform: "translate(30px, 10px) scale(1.04)", opacity: "0.75" },
        },
        "float-gentle": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-12px) rotate(3deg)" },
          "66%": { transform: "translateY(-6px) rotate(-2deg)" },
        },
        "shimmer-sweep": {
          "0%": { transform: "translateX(-150%)" },
          "100%": { transform: "translateX(250%)" },
        },
        "ring-expand": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        "text-glow": {
          "0%, 100%": { textShadow: "0 0 10px rgba(255, 189, 89, 0.4)" },
          "50%": { textShadow: "0 0 30px rgba(255, 189, 89, 1), 0 0 60px rgba(255, 189, 89, 0.4)" },
        },
        "charge-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "scan-line": {
          "0%": { top: "-5%", opacity: "0" },
          "10%": { opacity: "0.4" },
          "90%": { opacity: "0.4" },
          "100%": { top: "105%", opacity: "0" },
        },
      },
      animation: {
        "spotlight-drift": "spotlight-drift 10s ease-in-out infinite",
        "float-gentle": "float-gentle 4s ease-in-out infinite",
        "shimmer-sweep": "shimmer-sweep 3s linear infinite",
        "ring-expand": "ring-expand 2s ease-out infinite",
        "text-glow": "text-glow 2.5s ease-in-out infinite",
        "charge-pulse": "charge-pulse 0.8s ease-in-out infinite",
        "scan-line": "scan-line 6s linear infinite",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.33, 1, 0.68, 1)",
        "smooth-out": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [],
};

export default config;
