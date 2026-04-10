"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Round2Question } from "../types/gameTypes";

const EASE_SMOOTH = [0.33, 1, 0.68, 1];

export type AnswerFeedback = { correct: boolean; points: number } | null;

// ── Shared MCQ question shape ───────────────────────────────────────────────
interface MCQCardQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

// ── Gold confetti burst on correct answer ───────────────────────────────────
const COIN_COLORS = ["#FFBD59", "#F6C453", "#FFE680", "#C8900A", "#FFC63B"];

interface ConfettiCoin {
  id: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  delay: number;
}

function CorrectConfetti() {
  const coins: ConfettiCoin[] = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        angle: (i / 14) * 360 + (Math.random() - 0.5) * 25,
        distance: 55 + Math.random() * 55,
        size: 6 + Math.random() * 6,
        color: COIN_COLORS[Math.floor(Math.random() * COIN_COLORS.length)],
        delay: Math.random() * 0.12,
      })),
    []
  );

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: "visible", zIndex: 40 }}
    >
      {coins.map((coin) => {
        const rad = (coin.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * coin.distance;
        const ty = Math.sin(rad) * coin.distance;
        return (
          <motion.div
            key={coin.id}
            className="absolute rounded-full"
            style={{
              width: coin.size,
              height: coin.size,
              left: "50%",
              top: "50%",
              marginLeft: -coin.size / 2,
              marginTop: -coin.size / 2,
              background: `radial-gradient(circle at 35% 30%, #FFE680 0%, ${coin.color} 50%, #A06800 100%)`,
              border: "1px solid rgba(255,220,80,0.5)",
              boxShadow: `0 0 5px ${coin.color}80`,
            }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: tx,
              y: ty + coin.distance * 0.4,
              scale: 0.2,
              opacity: 0,
            }}
            transition={{ duration: 0.75, delay: coin.delay, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

// ── Floating +N coin popup ───────────────────────────────────────────────────
function PointsPopup({ points }: { points: number }) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0, scale: 0.6 }}
      animate={{ y: [-4, -30, -70, -100], opacity: [0, 1, 1, 0], scale: [0.6, 1.25, 1.15, 0.9] }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], times: [0, 0.15, 0.7, 1.0] }}
      className="absolute left-1/2 bottom-1/2 -translate-x-1/2 pointer-events-none"
      style={{ zIndex: 50 }}
    >
      <div
        className="flex items-center gap-1.5 px-4 py-2 rounded-full"
        style={{
          background: "linear-gradient(135deg, rgba(10,14,40,0.96) 0%, rgba(5,8,25,0.99) 100%)",
          border: "1.5px solid rgba(255,189,89,0.75)",
          boxShadow: "0 0 22px rgba(255,189,89,0.5), 0 4px 16px rgba(0,0,0,0.55)",
        }}
      >
        <span className="text-lg leading-none">🪙</span>
        <span
          className="font-black text-2xl tabular-nums"
          style={{ color: "#FFBD59", textShadow: "0 0 14px rgba(255,189,89,0.8)" }}
        >
          +{points}
        </span>
      </div>
    </motion.div>
  );
}

// ── Time-warning border overlay ──────────────────────────────────────────────
function TimeCriticalBorder() {
  return (
    <motion.div
      className="absolute inset-0 rounded-2xl pointer-events-none"
      animate={{ opacity: [0.3, 0.85, 0.3] }}
      transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut" }}
      style={{
        border: "2px solid rgba(239,68,68,0.75)",
        boxShadow: "0 0 22px rgba(239,68,68,0.28), inset 0 0 18px rgba(239,68,68,0.06)",
        zIndex: 10,
      }}
    />
  );
}

// ── MCQ Question Card (Round 1 & Round 3) ───────────────────────────────────
interface QuestionCardMCQProps {
  question: MCQCardQuestion;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  feedback?: AnswerFeedback;
  timeRemaining?: number;
}

export function QuestionCardMCQ({
  question,
  onAnswer,
  disabled = false,
  feedback = null,
  timeRemaining,
}: QuestionCardMCQProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const isTimeCritical = timeRemaining !== undefined && timeRemaining <= 5 && timeRemaining > 0;
  const correctId = question.correctAnswer.toUpperCase();
  const isIncorrect = feedback !== null && !feedback.correct;

  const handleSelect = (optionId: string) => {
    if (disabled) return;
    setSelected(optionId);
    onAnswer(optionId);
  };

  const getBadgeStyle = (optId: string): string => {
    if (feedback !== null) {
      if (optId.toUpperCase() === correctId)
        return "bg-emerald-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]";
      if (optId === selected && optId.toUpperCase() !== correctId)
        return "bg-rose-500/80 text-white";
      return "bg-icai-blue/15 text-icai-light-blue/35";
    }
    if (optId === selected)
      return "bg-icai-yellow text-icai-dark-indigo shadow-[0_0_8px_rgba(255,189,89,0.4)]";
    return "bg-icai-blue/20 text-icai-yellow/80";
  };

  const getCardStyle = (optId: string): string => {
    if (feedback !== null) {
      if (optId.toUpperCase() === correctId)
        return "border-emerald-500/80 bg-emerald-500/12 shadow-[0_0_22px_rgba(34,197,94,0.2)]";
      if (optId === selected && optId.toUpperCase() !== correctId)
        return "border-rose-400/50 bg-rose-950/25 opacity-85";
      return "border-icai-blue/12 bg-icai-dark-grey/25 opacity-45";
    }
    if (optId === selected)
      return "border-icai-yellow/65 bg-icai-yellow/8 shadow-[0_0_14px_rgba(255,189,89,0.2)]";
    return "border-icai-blue/30 bg-icai-dark-grey/55 hover:border-icai-yellow/40 hover:bg-icai-dark-grey/65 hover:shadow-[0_0_18px_rgba(255,189,89,0.12)]";
  };

  return (
    <motion.div
      animate={{ x: isIncorrect ? [0, -8, 8, -5, 5, 0] : 0 }}
      transition={isIncorrect ? { x: { duration: 0.48, ease: "easeInOut" } } : undefined}
      className="relative rounded-2xl"
      style={{ overflow: "visible" }}
    >
      {isTimeCritical && <TimeCriticalBorder />}

      <div
        className="rounded-2xl p-6 md:p-8 backdrop-blur-sm"
        data-no-cursor-trail
        style={{
          background: "linear-gradient(148deg, rgba(8,12,35,0.93) 0%, rgba(4,6,20,0.97) 100%)",
          border: isTimeCritical
            ? "1px solid rgba(239,68,68,0.35)"
            : "1px solid rgba(20,88,134,0.38)",
          boxShadow:
            "0 10px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(177,201,235,0.07)",
        }}
      >
        {/* Accent rule */}
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="w-1 h-7 rounded-full"
            style={{
              background: "linear-gradient(to bottom, #FFBD59, rgba(20,88,134,0.5))",
            }}
          />
          <p className="text-[10px] text-icai-light-blue/45 tracking-[0.2em] uppercase font-semibold">
            Select the correct answer
          </p>
        </div>

        {/* Question text */}
        <p className="text-xl md:text-2xl text-icai-light-grey font-medium leading-relaxed mb-7">
          {question.text}
        </p>

        {/* Options */}
        <div className="grid gap-3">
          {question.options.map((opt) => {
            const isCorrectOpt = opt.id.toUpperCase() === correctId;
            const isWrongSelected =
              feedback !== null && opt.id === selected && !isCorrectOpt;

            return (
              <div key={opt.id} className="relative" style={{ overflow: "visible" }}>
                <motion.button
                  type="button"
                  whileHover={disabled ? undefined : { y: -3, scale: 1.015 }}
                  whileTap={disabled ? undefined : { scale: 0.975, y: 0 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onClick={() => handleSelect(opt.id)}
                  disabled={disabled}
                  className={`touch-manipulation w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${getCardStyle(opt.id)}`}
                  style={{ cursor: disabled ? "default" : "pointer", WebkitTapHighlightColor: "transparent" }}
                >
                  {/* Letter badge */}
                  <span
                    className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm transition-all duration-300 ${getBadgeStyle(opt.id)}`}
                  >
                    {opt.id}
                  </span>

                  {/* Option text */}
                  <span
                    className={`font-medium flex-1 transition-colors duration-300 ${
                      feedback !== null &&
                      opt.id.toUpperCase() !== correctId &&
                      opt.id !== selected
                        ? "text-icai-light-blue/35"
                        : "text-icai-light-grey"
                    }`}
                  >
                    {opt.text}
                  </span>

                  {/* Checkmark on correct */}
                  {feedback !== null && isCorrectOpt && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0, rotate: -20 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 18,
                        delay: 0.1,
                      }}
                      className="ml-auto text-emerald-400 text-xl flex-shrink-0"
                    >
                      ✓
                    </motion.span>
                  )}

                  {/* X mark on wrong selection */}
                  {isWrongSelected && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 18,
                        delay: 0.1,
                      }}
                      className="ml-auto text-rose-400 text-xl flex-shrink-0"
                    >
                      ✗
                    </motion.span>
                  )}
                </motion.button>

                {/* Confetti burst from correct option */}
                {feedback !== null && feedback.correct && isCorrectOpt && (
                  <CorrectConfetti />
                )}
              </div>
            );
          })}
        </div>

        {/* Points popup */}
        <AnimatePresence>
          {feedback !== null && feedback.correct && (
            <PointsPopup key="pts" points={feedback.points} />
          )}
        </AnimatePresence>

        {/* Wrong answer message */}
        {feedback !== null && !feedback.correct && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-5 flex items-center justify-center gap-2"
          >
            <span className="text-rose-400 text-sm">✗</span>
            <p className="text-sm text-icai-light-blue/55">
              Correct answer highlighted — moving on
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ── Myth or Fact Seesaw Card (Round 2) ──────────────────────────────────────
interface QuestionCardMythFactProps {
  question: Round2Question;
  onAnswer: (answer: boolean) => void;
  disabled?: boolean;
  feedback?: AnswerFeedback;
  timeRemaining?: number;
}

export function QuestionCardMythFact({
  question,
  onAnswer,
  disabled = false,
  feedback = null,
  timeRemaining,
}: QuestionCardMythFactProps) {
  const [selected, setSelected] = useState<boolean | null>(null);

  const isTimeCritical = timeRemaining !== undefined && timeRemaining <= 5 && timeRemaining > 0;
  const isIncorrect = feedback !== null && !feedback.correct;

  const handleSelect = (value: boolean) => {
    if (disabled) return;
    setSelected(value);
    onAnswer(value);
  };

  const seesawTilt = selected === false ? -14 : selected === true ? 14 : 0;

  const getCardStyle = (value: boolean): string => {
    const isSelected = selected === value;
    if (feedback !== null) {
      const isCorrect = question.correctAnswer === value;
      if (isCorrect)
        return "border-emerald-500/75 bg-emerald-500/12 shadow-[0_0_28px_rgba(34,197,94,0.25)]";
      if (isSelected)
        return "border-rose-400/50 bg-rose-950/25 opacity-80";
      return "border-icai-blue/15 bg-icai-dark-grey/25 opacity-40";
    }
    if (isSelected) {
      return value === false
        ? "border-rose-400/70 bg-rose-950/25 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
        : "border-emerald-500/70 bg-emerald-500/12 shadow-[0_0_20px_rgba(34,197,94,0.2)]";
    }
    return value === false
      ? "border-rose-400/25 bg-slate-800/45 hover:border-rose-400/55 hover:bg-rose-950/20 hover:shadow-[0_0_16px_rgba(239,68,68,0.12)]"
      : "border-emerald-500/25 bg-slate-800/45 hover:border-emerald-400/55 hover:bg-emerald-950/15 hover:shadow-[0_0_16px_rgba(34,197,94,0.12)]";
  };

  const getIconColor = (value: boolean): string => {
    if (feedback !== null) {
      if (question.correctAnswer === value) return "text-emerald-300";
      if (selected === value) return "text-rose-400";
      return "text-icai-light-blue/30";
    }
    if (selected === value)
      return value === false ? "text-rose-300" : "text-emerald-300";
    return value === false ? "text-rose-400/60" : "text-emerald-400/60";
  };

  const getLabelColor = (value: boolean): string => {
    if (feedback !== null) {
      if (question.correctAnswer === value) return "text-emerald-200";
      if (selected === value) return "text-rose-300";
      return "text-icai-light-blue/30";
    }
    if (selected === value)
      return value === false ? "text-rose-200" : "text-emerald-200";
    return "text-icai-light-grey";
  };

  return (
    <motion.div
      animate={{ x: isIncorrect ? [0, -8, 8, -5, 5, 0] : 0 }}
      transition={isIncorrect ? { x: { duration: 0.48, ease: "easeInOut" } } : undefined}
      className="relative rounded-2xl"
      style={{ overflow: "visible" }}
    >
      {isTimeCritical && <TimeCriticalBorder />}

      <div
        className="rounded-2xl p-6 md:p-8 backdrop-blur-sm"
        data-no-cursor-trail
        style={{
          background: "linear-gradient(148deg, rgba(8,12,35,0.93) 0%, rgba(4,6,20,0.97) 100%)",
          border: isTimeCritical
            ? "1px solid rgba(239,68,68,0.35)"
            : "1px solid rgba(255,189,89,0.22)",
          boxShadow:
            "0 10px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,189,89,0.05)",
        }}
      >
        {/* Header label */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <p className="text-[10px] text-icai-yellow/50 tracking-[0.2em] uppercase font-semibold">
            Myth or Fact?
          </p>
        </div>

        {/* Question text */}
        <p className="text-xl md:text-2xl text-icai-light-grey font-medium leading-relaxed mb-8 text-center italic">
          {question.text}
        </p>

        {/* Seesaw assembly — extra height to prevent overlap with answer cards */}
        <div className="relative h-20 mb-4 flex items-center justify-center" style={{ overflow: "visible", isolation: "isolate", zIndex: 10 }}>
          {/* Pivot point */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full z-20"
            style={{
              background: "radial-gradient(circle at 35% 30%, #FFE680, #C8900A)",
              boxShadow: "0 0 10px rgba(255,189,89,0.5)",
            }}
          />

          {/* Tilting beam */}
          <motion.div
            className="absolute w-[82%] h-1.5 rounded-full bottom-[6px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(239,68,68,0.55) 0%, rgba(255,189,89,0.8) 50%, rgba(34,197,94,0.55) 100%)",
              transformOrigin: "center center",
              boxShadow: "0 0 6px rgba(255,189,89,0.2)",
            }}
            animate={{ rotate: seesawTilt }}
            transition={{ type: "spring", stiffness: 220, damping: 20, mass: 0.7 }}
          >
            {/* Weight on MYTH side */}
            <AnimatePresence>
              {selected === false && (
                <motion.div
                  key="myth-weight"
                  initial={{ y: -28, opacity: 0, scale: 0.4 }}
                  animate={{ y: -26, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className="absolute w-7 h-7 rounded-full"
                  style={{
                    left: "8%",
                    transform: "translateX(-50%)",
                    bottom: "100%",
                    marginBottom: "2px",
                    background:
                      "radial-gradient(circle at 35% 30%, #FFE680 0%, #F6C453 45%, #C8900A 100%)",
                    boxShadow: "0 0 10px rgba(255,189,89,0.6), 0 2px 6px rgba(0,0,0,0.4)",
                  }}
                />
              )}
            </AnimatePresence>

            {/* Weight on FACT side */}
            <AnimatePresence>
              {selected === true && (
                <motion.div
                  key="fact-weight"
                  initial={{ y: -28, opacity: 0, scale: 0.4 }}
                  animate={{ y: -26, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className="absolute w-7 h-7 rounded-full"
                  style={{
                    right: "8%",
                    transform: "translateX(50%)",
                    bottom: "100%",
                    marginBottom: "2px",
                    background:
                      "radial-gradient(circle at 35% 30%, #FFE680 0%, #F6C453 45%, #C8900A 100%)",
                    boxShadow: "0 0 10px rgba(255,189,89,0.6), 0 2px 6px rgba(0,0,0,0.4)",
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Scale icon label in center */}
          <motion.div
            className="absolute text-2xl z-10"
            animate={{ rotate: seesawTilt * 0.5 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            style={{ bottom: "10px" }}
          >
            ⚖️
          </motion.div>
        </div>

        {/* MYTH | FACT cards */}
        <div className="flex gap-4 relative" style={{ zIndex: 1 }}>
          {/* MYTH */}
          <motion.button
            type="button"
            whileHover={disabled ? undefined : { y: -5, scale: 1.03 }}
            whileTap={disabled ? undefined : { scale: 0.96, y: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={() => handleSelect(false)}
            disabled={disabled}
            className={`touch-manipulation flex-1 py-6 px-4 rounded-2xl border-2 font-black text-xl transition-all duration-300 flex flex-col items-center justify-center gap-2.5 ${getCardStyle(false)}`}
            style={{ cursor: disabled ? "default" : "pointer", WebkitTapHighlightColor: "transparent" }}
          >
            <span className={`text-3xl transition-colors duration-300 ${getIconColor(false)}`}>
              💭
            </span>
            <span className={`transition-colors duration-300 tracking-widest ${getLabelColor(false)}`}>
              MYTH
            </span>
            {feedback !== null && question.correctAnswer === false && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.12 }}
                className="text-emerald-400 text-lg"
              >
                ✓
              </motion.span>
            )}
            {feedback !== null && selected === false && question.correctAnswer !== false && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.12 }}
                className="text-rose-400 text-lg"
              >
                ✗
              </motion.span>
            )}
          </motion.button>

          {/* FACT */}
          <motion.button
            type="button"
            whileHover={disabled ? undefined : { y: -5, scale: 1.03 }}
            whileTap={disabled ? undefined : { scale: 0.96, y: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={() => handleSelect(true)}
            disabled={disabled}
            className={`touch-manipulation flex-1 py-6 px-4 rounded-2xl border-2 font-black text-xl transition-all duration-300 flex flex-col items-center justify-center gap-2.5 ${getCardStyle(true)}`}
            style={{ cursor: disabled ? "default" : "pointer", WebkitTapHighlightColor: "transparent" }}
          >
            <span className={`text-3xl transition-colors duration-300 ${getIconColor(true)}`}>
              ✅
            </span>
            <span className={`transition-colors duration-300 tracking-widest ${getLabelColor(true)}`}>
              FACT
            </span>
            {feedback !== null && question.correctAnswer === true && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.12 }}
                className="text-emerald-400 text-lg"
              >
                ✓
              </motion.span>
            )}
            {feedback !== null && selected === true && question.correctAnswer !== true && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.12 }}
                className="text-rose-400 text-lg"
              >
                ✗
              </motion.span>
            )}
          </motion.button>
        </div>

        {/* Confetti & points */}
        <AnimatePresence>
          {feedback !== null && feedback.correct && (
            <>
              <CorrectConfetti key="confetti" />
              <PointsPopup key="pts" points={feedback.points} />
            </>
          )}
        </AnimatePresence>

        {/* Wrong answer message */}
        {feedback !== null && !feedback.correct && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-6 flex items-center justify-center gap-2"
          >
            <span className="text-rose-400 text-sm">✗</span>
            <p className="text-sm text-icai-light-blue/55">
              Not quite — correct answer highlighted
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ── Lightning card (kept for backward compatibility, not used in Round 3) ───
interface QuestionCardLightningProps {
  question: { id: string; text: string };
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  feedback?: AnswerFeedback;
}

export function QuestionCardLightning({
  question,
  onAnswer,
  disabled = false,
  feedback = null,
}: QuestionCardLightningProps) {
  const [input, setInput] = useState("");
  const isIncorrect = feedback !== null && !feedback.correct;

  const handleSubmit = () => {
    if (disabled || !input.trim()) return;
    onAnswer(input.trim());
  };

  return (
    <motion.div
      animate={{ x: isIncorrect ? [0, -8, 8, -5, 5, 0] : 0 }}
      transition={isIncorrect ? { x: { duration: 0.48, ease: "easeInOut" } } : undefined}
      className="relative rounded-2xl p-6 md:p-8 backdrop-blur-sm"
      style={{
        background: "linear-gradient(148deg, rgba(8,12,35,0.93) 0%, rgba(4,6,20,0.97) 100%)",
        border: "1px solid rgba(20,88,134,0.38)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
      }}
    >
      <p className="text-xl md:text-2xl text-icai-light-grey font-medium leading-relaxed mb-6 text-center">
        What is the term for:
      </p>
      <p
        className="text-2xl md:text-3xl font-bold text-center mb-8"
        style={{ color: "#B1C9EB" }}
      >
        {question.text}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Type your answer..."
          disabled={disabled}
          className={`flex-1 px-4 py-4 rounded-xl border-2 bg-icai-dark-grey/60 text-icai-light-grey placeholder-icai-light-blue/50 focus:outline-none text-lg transition-colors duration-300 ${
            feedback !== null && !feedback.correct
              ? "border-rose-400/40"
              : "border-icai-blue/35 focus:border-icai-blue"
          }`}
        />
        <motion.button
          whileHover={disabled ? undefined : { scale: 1.02 }}
          whileTap={disabled ? undefined : { scale: 0.98 }}
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="px-8 py-4 rounded-xl bg-icai-yellow text-icai-dark-indigo font-bold disabled:opacity-50 transition-all duration-300"
          style={{
            boxShadow: disabled ? "none" : "0 0 16px rgba(255,189,89,0.3)",
          }}
        >
          SUBMIT
        </motion.button>
      </div>

      <AnimatePresence>
        {feedback !== null && feedback.correct && (
          <>
            <CorrectConfetti key="confetti" />
            <PointsPopup key="pts" points={feedback.points} />
          </>
        )}
      </AnimatePresence>

      {feedback !== null && !feedback.correct && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-4 text-center text-sm text-icai-light-blue/55"
        >
          Not quite — moving to the next question
        </motion.p>
      )}
    </motion.div>
  );
}
