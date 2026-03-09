"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QuestionCardLightning,
  Timer,
  ScoreDisplay,
  ProgressBar,
  TabBlockerOverlay,
} from "../components";
import type { AnswerFeedback } from "../components";
import { round3Questions } from "../data/questions";
import { useGameStore } from "../store/gameStore";
import { validateRound3Answer, createAnswer } from "../engine/gameEngine";
import { saveGameState } from "../services/gameService";
import { useGameTimer } from "../hooks/useGameTimer";
import { useTabSwitchDetection } from "../hooks/useTabSwitchDetection";

const TOTAL_TIME = 60;
const POINTS_PER_CORRECT = 5;
const FEEDBACK_DURATION_MS = 1000;

const EASE = [0.33, 1, 0.68, 1] as const;

export function Round3Page() {
  const {
    score,
    currentQuestionIndex,
    setPhase,
    addScore,
    nextQuestion,
    setGameCompleted,
  } = useGameStore();

  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<AnswerFeedback>(null);
  const { tabHidden, acknowledgeLeave } = useTabSwitchDetection(true);
  const timeRemaining = useGameStore((s) => s.timeRemaining);

  const question = round3Questions[currentQuestionIndex];
  const totalQuestions = round3Questions.length;
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;
  const timeExpired = timeRemaining <= 0;

  const finishGame = useCallback(() => {
    setPhase("result");
    setGameCompleted(true);
    saveGameState({ phase: "result", gameCompleted: true });
  }, [setPhase, setGameCompleted]);

  useGameTimer(true, () => { finishGame(); });

  useEffect(() => {
    if (timeExpired) finishGame();
  }, [timeExpired, finishGame]);

  const handleAnswer = (answer: string) => {
    if (answered || timeExpired) return;
    setAnswered(true);
    const correct = validateRound3Answer(question, answer);
    const points = correct ? POINTS_PER_CORRECT : 0;
    addScore(points);
    setFeedback({ correct, points });
    createAnswer(question.id, answer, correct, 3);
    saveGameState({ score: score + points });
    setTimeout(() => {
      if (isLastQuestion || timeExpired) finishGame();
      else {
        nextQuestion();
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
              "linear-gradient(135deg, rgba(177,201,235,0.15) 0%, rgba(10,1,71,0.7) 100%)",
            border: "1px solid rgba(177, 201, 235, 0.35)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div>
            <p className="text-icai-light-blue/60 text-[10px] tracking-widest uppercase font-semibold">
              Round 3 of 3 · Final Round
            </p>
            <h2 className="text-lg font-black text-icai-light-grey">⚡ Lightning Round</h2>
          </div>
          <div className="flex items-center gap-6">
            <Timer
              timeRemaining={timeRemaining}
              totalTime={TOTAL_TIME}
              label="Time Left"
              variant="circular"
            />
            <ScoreDisplay score={score} />
          </div>
        </motion.div>

        <ProgressBar
          current={currentQuestionIndex + 1}
          total={totalQuestions}
          label="Question"
        />

        {/* Lightning indicator */}
        <motion.div
          className="flex justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: 8,
                height: 8,
                background:
                  i < currentQuestionIndex
                    ? "#FFBD59"
                    : i === currentQuestionIndex
                    ? "#B1C9EB"
                    : "rgba(20,88,134,0.3)",
              }}
              animate={
                i === currentQuestionIndex
                  ? { scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }
                  : {}
              }
              transition={{ duration: 1, repeat: Infinity }}
            />
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <QuestionCardLightning
              question={question}
              onAnswer={handleAnswer}
              disabled={answered || timeExpired}
              feedback={feedback}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
