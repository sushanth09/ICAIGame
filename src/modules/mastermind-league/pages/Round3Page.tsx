"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QuestionCardMCQ,
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
import { useSoundEffects } from "../hooks/useSoundSystem";

const TOTAL_TIME = 60;
const POINTS_PER_CORRECT = 5;
const FEEDBACK_DURATION_MS = 1000;

const EASE = [0.33, 1, 0.68, 1] as const;

// Shuffle options and remap correct answer letter to new position
function shuffleOptions(question: (typeof round3Questions)[number]) {
  const shuffled = [...question.options].sort(() => Math.random() - 0.5);
  const remapped = shuffled.map((opt, i) => ({
    ...opt,
    id: String.fromCharCode(65 + i), // A, B, C, D
  }));
  const originalCorrectText = question.options.find(
    (o) => o.id === question.correctAnswer
  )?.text;
  const newCorrectId =
    remapped.find((o) => o.text === originalCorrectText)?.id ?? question.correctAnswer;
  return { ...question, options: remapped, correctAnswer: newCorrectId };
}

export function Round3Page() {
  const {
    score,
    roundScores,
    currentQuestionIndex,
    setPhase,
    addScore,
    nextQuestion,
    setGameCompleted,
    setRoundScore,
  } = useGameStore();

  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<AnswerFeedback>(null);
  const { tabHidden, acknowledgeLeave } = useTabSwitchDetection(true);
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const { setTimeRemaining } = useGameStore();
  const { playCorrect, playWrong } = useSoundEffects();

  const rawQuestion = round3Questions[currentQuestionIndex];
  const totalQuestions = round3Questions.length;
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;
  const timeExpired = timeRemaining <= 0;
  const isCritical = timeRemaining <= 5 && timeRemaining > 0;

  // Shuffle options once per question change — stable within a question
  const question = useMemo(
    () => (rawQuestion ? shuffleOptions(rawQuestion) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawQuestion?.id]
  );

  const finishGame = useCallback(() => {
    setRoundScore(3, score - roundScores[0] - roundScores[1]);
    setPhase("result");
    setGameCompleted(true);
    saveGameState({ phase: "result", gameCompleted: true });
  }, [score, roundScores, setRoundScore, setPhase, setGameCompleted]);

  // Ensure timer is initialized to TOTAL_TIME when Round 3 mounts
  useEffect(() => {
    setTimeRemaining(TOTAL_TIME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only on mount

  useGameTimer(true, () => {
    finishGame();
  });

  useEffect(() => {
    if (timeExpired) finishGame();
  }, [timeExpired, finishGame]);

  const handleAnswer = (answer: string) => {
    if (answered || timeExpired || !question) return;
    setAnswered(true);
    const correct = validateRound3Answer(question, answer);
    const points = correct ? POINTS_PER_CORRECT : 0;
    addScore(points);
    setFeedback({ correct, points });
    createAnswer(question.id, answer, correct, 3);
    saveGameState({ score: score + points });
    if (correct) playCorrect(); else playWrong();
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

      {/* Screen border flash on time critical */}
      <AnimatePresence>
        {isCritical && (
          <motion.div
            key="screen-warning"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut" }}
            className="fixed inset-0 pointer-events-none z-40"
            style={{
              boxShadow: "inset 0 0 60px rgba(239,68,68,0.35)",
              border: "3px solid rgba(239,68,68,0.5)",
            }}
          />
        )}
      </AnimatePresence>

      <div className="w-full h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-5 space-y-3">
        {/* Round header banner */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(177,201,235,0.15) 0%, rgba(10,1,71,0.7) 100%)",
            border: "1px solid rgba(177,201,235,0.35)",
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

        {/* Question dots indicator */}
        <motion.div
          className="flex justify-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: i === currentQuestionIndex ? 10 : 7,
                height: i === currentQuestionIndex ? 10 : 7,
                background:
                  i < currentQuestionIndex
                    ? "#22C55E"
                    : i === currentQuestionIndex
                    ? "#FFBD59"
                    : "rgba(20,88,134,0.3)",
                boxShadow:
                  i === currentQuestionIndex
                    ? "0 0 8px rgba(255,189,89,0.5)"
                    : i < currentQuestionIndex
                    ? "0 0 4px rgba(34,197,94,0.3)"
                    : undefined,
                transition: "background 0.3s ease, box-shadow 0.3s ease",
              }}
              animate={
                i === currentQuestionIndex
                  ? { scale: [1, 1.35, 1], opacity: [1, 0.8, 1] }
                  : {}
              }
              transition={{ duration: 1.1, repeat: Infinity }}
            />
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <QuestionCardMCQ
              question={question}
              onAnswer={handleAnswer}
              disabled={answered || timeExpired}
              feedback={feedback}
              timeRemaining={timeRemaining}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      </div>
    </>
  );
}
