"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QuestionCardMythFact,
  Timer,
  ScoreDisplay,
  ProgressBar,
  TabBlockerOverlay,
} from "../components";
import type { AnswerFeedback } from "../components";
import { round2Questions } from "../data/questions";
import { useGameStore } from "../store/gameStore";
import { validateRound2Answer, createAnswer } from "../engine/gameEngine";
import { saveGameState } from "../services/gameService";
import { useGameTimer } from "../hooks/useGameTimer";
import { useTabSwitchDetection } from "../hooks/useTabSwitchDetection";

const TIME_PER_QUESTION = 20;
const FEEDBACK_DURATION_MS = 1600;

const EASE = [0.33, 1, 0.68, 1] as const;

export function Round2Page() {
  const {
    score,
    currentQuestionIndex,
    setPhase,
    addScore,
    nextQuestion,
    setCurrentRound,
    setCurrentQuestionIndex,
    setTimeRemaining,
  } = useGameStore();

  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<AnswerFeedback>(null);
  const { tabHidden, acknowledgeLeave } = useTabSwitchDetection(true);
  const timeRemaining = useGameStore((s) => s.timeRemaining);

  const question = round2Questions[currentQuestionIndex];
  const totalQuestions = round2Questions.length;
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  const advanceRound = useCallback(() => {
    setPhase("round3");
    setCurrentRound(3);
    setCurrentQuestionIndex(0);
    setTimeRemaining(60);
    saveGameState({ phase: "round3", currentRound: 3, currentQuestionIndex: 0, timeRemaining: 60 });
  }, [setPhase, setCurrentRound, setCurrentQuestionIndex, setTimeRemaining]);

  useGameTimer(true, () => {
    if (!answered && question) {
      setAnswered(true);
      setFeedback({ correct: false, points: 0 });
      setTimeout(() => {
        if (isLastQuestion) advanceRound();
        else {
          nextQuestion();
          setTimeRemaining(TIME_PER_QUESTION);
          setAnswered(false);
          setFeedback(null);
        }
      }, FEEDBACK_DURATION_MS);
    }
  });

  useEffect(() => {
    setTimeRemaining(TIME_PER_QUESTION);
  }, [currentQuestionIndex, setTimeRemaining]);

  const handleAnswer = (answer: boolean) => {
    if (answered) return;
    setAnswered(true);
    const correct = validateRound2Answer(question, answer);
    const points = correct ? 10 : 0;
    addScore(points);
    setFeedback({ correct, points });
    createAnswer(question.id, answer, correct, 2);
    saveGameState({ score: score + points });
    setTimeout(() => {
      if (isLastQuestion) advanceRound();
      else {
        nextQuestion();
        setTimeRemaining(TIME_PER_QUESTION);
        setAnswered(false);
        setFeedback(null);
      }
    }, FEEDBACK_DURATION_MS);
  };

  if (!question) return null;

  return (
    <>
      <TabBlockerOverlay visible={tabHidden} onAcknowledge={acknowledgeLeave} />
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Round header banner */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,189,89,0.15) 0%, rgba(10,1,71,0.7) 100%)",
            border: "1px solid rgba(255, 189, 89, 0.35)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div>
            <p className="text-icai-light-blue/60 text-[10px] tracking-widest uppercase font-semibold">
              Round 2 of 3
            </p>
            <h2 className="text-lg font-black text-icai-light-grey">🔍 Myth or Fact?</h2>
          </div>
          <div className="flex items-center gap-6">
            <Timer timeRemaining={timeRemaining} totalTime={TIME_PER_QUESTION} label="Time" />
            <ScoreDisplay score={score} />
          </div>
        </motion.div>

        <ProgressBar
          current={currentQuestionIndex + 1}
          total={totalQuestions}
          label="Question"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <QuestionCardMythFact
              question={question}
              onAnswer={handleAnswer}
              disabled={answered}
              feedback={feedback}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
