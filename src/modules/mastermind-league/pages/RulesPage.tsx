"use client";

import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import { AnimatedButton } from "../components/AnimatedButton";
import { AnimatedRibbon } from "../components/AnimatedRibbon";

const EASE = [0.33, 1, 0.68, 1] as const;

const ROUNDS = [
  {
    number: 1,
    tag: "MCQ",
    title: "The Analyst Arena",
    description:
      "Answer 5 multiple-choice questions on Ind AS, accounting principles, and financial analysis.",
    icon: "📊",
    accentColor: "rgba(20, 88, 134, 0.5)",
    borderColor: "rgba(20, 88, 134, 0.4)",
    glowColor: "rgba(20, 88, 134, 0.3)",
    bgGradient: "linear-gradient(160deg, rgba(20,88,134,0.2) 0%, rgba(10,1,71,0.5) 100%)",
    points: "10 pts",
    time: "30s / Q",
    questions: 5,
  },
  {
    number: 2,
    tag: "TRUE/FALSE",
    title: "Myth or Fact?",
    description:
      "Determine whether accounting statements are true or false. Test your conceptual clarity.",
    icon: "🔍",
    accentColor: "rgba(255, 189, 89, 0.5)",
    borderColor: "rgba(255, 189, 89, 0.35)",
    glowColor: "rgba(255, 189, 89, 0.25)",
    bgGradient: "linear-gradient(160deg, rgba(255,189,89,0.12) 0%, rgba(10,1,71,0.6) 100%)",
    points: "10 pts",
    time: "20s / Q",
    questions: 5,
  },
  {
    number: 3,
    tag: "TYPE-IN",
    title: "Lightning Round",
    description:
      "60 seconds. 10 finance terms. Type fast, think faster. Speed AND accuracy both matter!",
    icon: "⚡",
    accentColor: "rgba(177, 201, 235, 0.5)",
    borderColor: "rgba(177, 201, 235, 0.35)",
    glowColor: "rgba(177, 201, 235, 0.2)",
    bgGradient: "linear-gradient(160deg, rgba(177,201,235,0.12) 0%, rgba(10,1,71,0.6) 100%)",
    points: "5 pts",
    time: "60s total",
    questions: 10,
  },
];

const TITLES = [
  { icon: "⭐", name: "Rising Star",   range: "0 – 50 pts",  color: "#B1C9EB" },
  { icon: "📚", name: "Scholar",        range: "51 – 80 pts", color: "#FFBD59" },
  { icon: "🧠", name: "Mastermind",    range: "81+ pts",     color: "#E8E9E4" },
];

interface RulesPageProps {
  onBegin: () => void;
}

export function RulesPage({ onBegin }: RulesPageProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="max-w-4xl mx-auto">
      {/* Ribbon header */}
      <div className="mb-8">
        <AnimatedRibbon delay={0.1}>HOW IT WORKS</AnimatedRibbon>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        className="text-2xl md:text-3xl font-black text-icai-light-grey text-center mb-10"
      >
        Three Rounds.{" "}
        <span className="text-icai-yellow">One Champion.</span>
      </motion.h2>

      {/* Round Cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-12">
        {ROUNDS.map((round, i) => (
          <motion.div
            key={round.number}
            initial={{ opacity: 0, y: 40, rotateX: -12 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{
              delay: 0.2 + i * 0.18,
              duration: 0.85,
              ease: EASE,
            }}
            style={{ transformStyle: "preserve-3d", perspective: 800 }}
          >
            <motion.div
              whileHover={{ y: -8, scale: 1.02, boxShadow: `0 20px 60px ${round.glowColor}` }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-full rounded-2xl overflow-hidden relative"
              style={{
                background: round.bgGradient,
                border: `1px solid ${round.borderColor}`,
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Top accent line */}
              <div
                className="h-0.5 w-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${round.accentColor}, transparent)`,
                }}
              />

              <div className="p-6">
                {/* Header row */}
                <div className="flex justify-between items-start mb-5">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded tracking-widest"
                    style={{
                      background: "rgba(15,14,12,0.7)",
                      border: `1px solid ${round.borderColor}`,
                      color: "#FFBD59",
                    }}
                  >
                    {round.tag}
                  </span>
                  <span className="text-icai-light-blue/50 text-[10px] font-semibold tracking-widest">
                    ROUND {round.number}
                  </span>
                </div>

                {/* Animated icon */}
                <motion.div
                  className="text-5xl mb-4 text-center block"
                  animate={{
                    y: [0, -8, 0],
                    rotate: round.number === 3 ? [-5, 5, -5] : [-2, 2, -2],
                  }}
                  transition={{
                    duration: 3 + i * 0.7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {round.icon}
                </motion.div>

                <h3 className="text-base font-bold text-icai-yellow mb-2 text-center">
                  {round.title}
                </h3>

                <p className="text-icai-light-blue/85 text-xs leading-relaxed mb-5 text-center">
                  {round.description}
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Questions", value: `${round.questions}` },
                    { label: "Points",    value: round.points },
                    { label: "Time",      value: round.time },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="text-center p-2 rounded-lg"
                      style={{ background: "rgba(15,14,12,0.5)" }}
                    >
                      <p className="text-[10px] text-icai-light-blue/50 mb-0.5">{s.label}</p>
                      <p className="text-icai-yellow font-bold text-xs">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard titles section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8, duration: 0.7, ease: EASE }}
        className="rounded-2xl p-6 mb-8 text-center"
        style={{
          background:
            "linear-gradient(160deg, rgba(10,1,71,0.8) 0%, rgba(15,14,12,0.6) 100%)",
          border: "1px solid rgba(255,189,89,0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-icai-light-blue/70 text-sm mb-4 font-medium"
        >
          Earn a leaderboard title based on your score:
        </motion.p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-5">
          {TITLES.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.0 + i * 0.12, type: "spring", stiffness: 220, damping: 16 }}
              whileHover={{ y: -4, scale: 1.05 }}
              className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl"
              style={{
                background: "rgba(20,88,134,0.18)",
                border: `1px solid rgba(255,189,89,0.25)`,
              }}
            >
              <span className="text-2xl">{tier.icon}</span>
              <span className="font-bold text-sm" style={{ color: tier.color }}>
                {tier.name}
              </span>
              <span className="text-icai-light-blue/50 text-xs">{tier.range}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.35, duration: 0.6 }}
          className="text-icai-yellow font-bold text-sm"
        >
          🏆 Annual Mastermind Champion crowned at year end!
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.1, duration: 0.7 }}
        className="flex justify-center"
      >
        <AnimatedButton onClick={onBegin}>BEGIN GAME ⚡</AnimatedButton>
      </motion.div>
    </div>
  );
}
