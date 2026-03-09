"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Round1Question, Round2Question } from "../types/gameTypes";

const EASE_SMOOTH = [0.33, 1, 0.68, 1];
const HOVER_TRANSITION = { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] };
const CARD_ENTRANCE = { duration: 0.75, ease: EASE_SMOOTH };

export type AnswerFeedback = { correct: boolean; points: number } | null;

interface QuestionCardMCQProps {
  question: Round1Question;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  feedback?: AnswerFeedback;
}

export function QuestionCardMCQ({
  question,
  onAnswer,
  disabled = false,
  feedback = null,
}: QuestionCardMCQProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (optionId: string) => {
    if (disabled) return;
    setSelected(optionId);
    onAnswer(optionId);
  };

  const correctId = question.correctAnswer.toUpperCase();
  const isIncorrect = feedback !== null && !feedback.correct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{
        opacity: 1,
        y: 0,
        x: isIncorrect ? [0, -6, 6, -4, 4, 0] : 0,
      }}
      transition={
        isIncorrect
          ? { x: { duration: 0.5, ease: "easeInOut" } }
          : { duration: 0.75, ease: EASE_SMOOTH }
      }
      className="relative rounded-2xl border border-icai-blue/30 bg-icai-dark-grey/50 p-6 md:p-8 backdrop-blur-sm overflow-hidden"
    >
      <p className="text-xl md:text-2xl text-icai-light-grey font-medium leading-relaxed mb-6">
        {question.text}
      </p>
      <div className="grid gap-3">
        {question.options.map((opt) => {
          const isSelected = selected === opt.id;
          const showCorrect = feedback !== null && opt.id === correctId;
          const showWrong = feedback !== null && isSelected && opt.id !== correctId;
          return (
            <motion.button
              key={opt.id}
              whileHover={disabled ? undefined : { scale: 1.01, x: 4 }}
              whileTap={disabled ? undefined : { scale: 0.99 }}
              transition={HOVER_TRANSITION}
              onClick={() => handleSelect(opt.id)}
              disabled={disabled}
              className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-colors duration-300 ease-out ${
                feedback !== null
                  ? showCorrect
                    ? "border-emerald-500/70 bg-emerald-500/15 text-icai-light-grey"
                    : showWrong
                      ? "border-rose-400/30 bg-rose-950/20 text-icai-light-blue/90"
                      : "border-icai-blue/30 bg-icai-dark-grey/50 text-icai-light-blue/90"
                  : isSelected
                    ? "border-icai-yellow/60 bg-icai-yellow/10 text-icai-light-grey"
                    : "border-icai-blue/30 hover:border-icai-blue/50 bg-icai-dark-grey/50 text-icai-light-blue"
              }`}
            >
              <span className="font-bold text-icai-yellow mr-3">{opt.id}.</span>
              {opt.text}
            </motion.button>
          );
        })}
      </div>

      {feedback !== null && feedback.correct && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE_SMOOTH }}
            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-emerald-500/10 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: EASE_SMOOTH }}
              className="text-center px-8 py-6 rounded-2xl border border-emerald-400/40 bg-emerald-500/20"
            >
              <p className="text-2xl font-bold text-emerald-200">Correct!</p>
              <p className="text-icai-yellow text-lg font-semibold mt-1">
                +{feedback.points} pts
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {feedback !== null && !feedback.correct && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-4 text-center text-sm text-icai-light-blue/70"
        >
          Not quite — moving to the next question
        </motion.p>
      )}
    </motion.div>
  );
}

interface QuestionCardMythFactProps {
  question: Round2Question;
  onAnswer: (answer: boolean) => void;
  disabled?: boolean;
  feedback?: AnswerFeedback;
}

export function QuestionCardMythFact({
  question,
  onAnswer,
  disabled = false,
  feedback = null,
}: QuestionCardMythFactProps) {
  const [selected, setSelected] = useState<boolean | null>(null);

  const handleSelect = (value: boolean) => {
    if (disabled) return;
    setSelected(value);
    onAnswer(value);
  };

  const isIncorrect = feedback !== null && !feedback.correct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{
        opacity: 1,
        y: 0,
        x: isIncorrect ? [0, -6, 6, -4, 4, 0] : 0,
      }}
      transition={
        isIncorrect
          ? { x: { duration: 0.5, ease: "easeInOut" } }
          : { duration: 0.75, ease: EASE_SMOOTH }
      }
      className="relative rounded-2xl border border-icai-blue/30 bg-icai-dark-grey/50 p-6 md:p-8 backdrop-blur-sm overflow-hidden"
    >
      <p className="text-xl md:text-2xl text-icai-light-grey font-medium leading-relaxed mb-8 text-center italic">
        {question.text}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          whileHover={disabled ? undefined : { scale: 1.02 }}
          whileTap={disabled ? undefined : { scale: 0.98 }}
          transition={HOVER_TRANSITION}
          onClick={() => handleSelect(false)}
          disabled={disabled}
          className={`flex-1 py-6 px-8 rounded-xl border-2 font-bold text-lg transition-colors duration-300 ${
            feedback !== null
              ? selected === false
                ? question.correctAnswer === false
                  ? "border-emerald-500/70 bg-emerald-500/15 text-emerald-200"
                  : "border-rose-400/30 bg-rose-950/20 text-icai-light-blue/90"
                : "border-icai-blue/30 bg-icai-dark-grey/50 text-icai-light-blue/90"
              : selected === false
                ? "border-rose-400/50 bg-rose-950/20 text-rose-200"
                : "border-slate-600/50 hover:border-rose-400/40 bg-slate-800/40 text-icai-light-blue"
          }`}
        >
          MYTH
        </motion.button>
        <motion.button
          whileHover={disabled ? undefined : { scale: 1.02 }}
          whileTap={disabled ? undefined : { scale: 0.98 }}
          transition={HOVER_TRANSITION}
          onClick={() => handleSelect(true)}
          disabled={disabled}
          className={`flex-1 py-6 px-8 rounded-xl border-2 font-bold text-lg transition-colors duration-300 ${
            feedback !== null
              ? selected === true
                ? question.correctAnswer === true
                  ? "border-emerald-500/70 bg-emerald-500/15 text-emerald-200"
                  : "border-rose-400/30 bg-rose-950/20 text-icai-light-blue/90"
                : "border-icai-blue/30 bg-icai-dark-grey/50 text-icai-light-blue/90"
              : selected === true
                ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-200"
                : "border-slate-600/50 hover:border-emerald-400/40 bg-slate-800/40 text-icai-light-blue"
          }`}
        >
          FACT
        </motion.button>
      </div>

      {feedback !== null && feedback.correct && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE_SMOOTH }}
            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-emerald-500/10 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: EASE_SMOOTH }}
              className="text-center px-8 py-6 rounded-2xl border border-emerald-400/40 bg-emerald-500/20"
            >
              <p className="text-2xl font-bold text-emerald-200">Correct!</p>
              <p className="text-icai-yellow text-lg font-semibold mt-1">
                +{feedback.points} pts
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {feedback !== null && !feedback.correct && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-6 text-center text-sm text-icai-light-blue/70"
        >
          Not quite — moving to the next question
        </motion.p>
      )}
    </motion.div>
  );
}

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
      initial={{ opacity: 0, y: 32 }}
      animate={{
        opacity: 1,
        y: 0,
        x: isIncorrect ? [0, -6, 6, -4, 4, 0] : 0,
      }}
      transition={
        isIncorrect
          ? { x: { duration: 0.5, ease: "easeInOut" } }
          : { duration: 0.75, ease: EASE_SMOOTH }
      }
      className="relative rounded-2xl border border-icai-blue/30 bg-icai-dark-grey/50 p-6 md:p-8 backdrop-blur-sm overflow-hidden"
    >
      <p className="text-xl md:text-2xl text-icai-light-grey font-medium leading-relaxed mb-6 text-center">
        What is the term for:
      </p>
      <p className="text-2xl md:text-3xl font-bold text-icai-blue text-center mb-8">
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
          className={`flex-1 px-4 py-4 rounded-xl border-2 bg-icai-dark-grey/60 text-icai-light-grey placeholder-icai-light-blue/60 focus:outline-none text-lg transition-colors duration-300 ${
            feedback !== null && !feedback.correct
              ? "border-rose-400/30"
              : "border-icai-blue/30 focus:border-icai-blue"
          }`}
        />
        <motion.button
          whileHover={disabled ? undefined : { scale: 1.02 }}
          whileTap={disabled ? undefined : { scale: 0.98 }}
          transition={HOVER_TRANSITION}
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="px-8 py-4 rounded-xl bg-icai-yellow text-icai-dark-indigo font-bold hover:shadow-glow disabled:opacity-50 transition-shadow duration-300"
        >
          SUBMIT
        </motion.button>
      </div>

      {feedback !== null && feedback.correct && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE_SMOOTH }}
            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-emerald-500/10 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: EASE_SMOOTH }}
              className="text-center px-8 py-6 rounded-2xl border border-emerald-400/40 bg-emerald-500/20"
            >
              <p className="text-2xl font-bold text-emerald-200">Correct!</p>
              <p className="text-icai-yellow text-lg font-semibold mt-1">
                +{feedback.points} pts
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {feedback !== null && !feedback.correct && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-4 text-center text-sm text-icai-light-blue/70"
        >
          Not quite — moving to the next question
        </motion.p>
      )}
    </motion.div>
  );
}
