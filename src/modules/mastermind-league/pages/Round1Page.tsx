"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QuestionCardMCQ,
  Timer,
  ScoreDisplay,
  ProgressBar,
  TabBlockerOverlay,
} from "../components";
import type { AnswerFeedback } from "../components";
import { round1Questions } from "../data/questions";
import { useGameStore } from "../store/gameStore";
import { validateRound1Answer, createAnswer } from "../engine/gameEngine";
import { saveGameState } from "../services/gameService";
import { useGameTimer } from "../hooks/useGameTimer";
import { useTabSwitchDetection } from "../hooks/useTabSwitchDetection";

const TIME_PER_QUESTION = 30;
const FEEDBACK_DURATION_MS = 1600;

const EASE = [0.33, 1, 0.68, 1] as const;

export function Round1Page() {
  const {
    score,
    currentQuestionIndex,
    setPhase,
    addScore,
    nextQuestion,
    setCurrentRound,
    setCurrentQuestionIndex,
    setTimeRemaining,
    setGameStarted,
  } = useGameStore();

  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<AnswerFeedback>(null);
  const { tabHidden, acknowledgeLeave } = useTabSwitchDetection(true);
  const timeRemaining = useGameStore((s) => s.timeRemaining);

  const question = round1Questions[currentQuestionIndex];
  const totalQuestions = round1Questions.length;
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  const advanceRound = useCallback(() => {
    setPhase("round2");
    setCurrentRound(2);
    setCurrentQuestionIndex(0);
    setTimeRemaining(20);
    saveGameState({ phase: "round2", currentRound: 2, currentQuestionIndex: 0, timeRemaining: 20 });
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
    setGameStarted(true);
  }, [setTimeRemaining, setGameStarted]);

  const handleAnswer = (answer: string) => {
    if (answered) return;
    setAnswered(true);
    const correct = validateRound1Answer(question, answer);
    const points = correct ? 10 : 0;
    addScore(points);
    setFeedback({ correct, points });
    createAnswer(question.id, answer, correct, 1);
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
              "linear-gradient(135deg, rgba(20,88,134,0.35) 0%, rgba(10,1,71,0.6) 100%)",
            border: "1px solid rgba(20, 88, 134, 0.45)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div>
            <p className="text-icai-light-blue/60 text-[10px] tracking-widest uppercase font-semibold">
              Round 1 of 3
            </p>
            <h2 className="text-lg font-black text-icai-light-grey">
              📊 The Analyst Arena
            </h2>
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
            initial={{ opacity: 0, x: 30, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.98 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <QuestionCardMCQ
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
