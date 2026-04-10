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
import { getPointsForRound, ROUND3_MAX_QUESTIONS } from "../utils/scoring";
import { ROUND3_TOTAL_SECONDS } from "../constants/gameTiming";
import { saveGameState } from "../services/gameService";
import { useGameTimer } from "../hooks/useGameTimer";
import { useTabSwitchDetection } from "../hooks/useTabSwitchDetection";
import { useSoundEffects } from "../hooks/useSoundSystem";

const TOTAL_TIME = ROUND3_TOTAL_SECONDS;
const FEEDBACK_DURATION_MS = 1000;

const EASE = [0.33, 1, 0.68, 1] as const;

function shuffleOptions(question: (typeof round3Questions)[number]) {
  const shuffled = [...question.options].sort(() => Math.random() - 0.5);
  const remapped = shuffled.map((opt, i) => ({
    ...opt,
    id: String.fromCharCode(65 + i),
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
    currentQuestionIndex,
    setPhase,
    addScore,
    nextQuestion,
    setGameCompleted,
    setRoundScore,
  } = useGameStore();

  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<AnswerFeedback>(null);

  const handleTabViolationLimit = useCallback(() => {
    const s = useGameStore.getState();
    s.setRoundScore(3, s.score - s.roundScores[0] - s.roundScores[1]);
    s.setDisqualified(true);
    s.setGameCompleted(true);
    s.setPhase("result");
    saveGameState({
      phase: "result",
      gameCompleted: true,
      disqualified: true,
      score: s.score,
    });
  }, []);

  const { tabHidden, acknowledgeLeave } = useTabSwitchDetection(true, {
    onViolationLimit: handleTabViolationLimit,
  });

  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const score = useGameStore((s) => s.score);
  const { setTimeRemaining } = useGameStore();
  const { playCorrect, playWrong } = useSoundEffects();

  const r3PlayCount = Math.min(ROUND3_MAX_QUESTIONS, round3Questions.length);
  const rawQuestion =
    currentQuestionIndex < r3PlayCount
      ? round3Questions[currentQuestionIndex]
      : undefined;
  const totalQuestions = r3PlayCount;
  const isLastQuestion = currentQuestionIndex >= r3PlayCount - 1;
  const timeExpired = timeRemaining <= 0;
  const isCritical = timeRemaining <= 5 && timeRemaining > 0;

  const question = useMemo(
    () => (rawQuestion ? shuffleOptions(rawQuestion) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawQuestion?.id]
  );

  const finishGame = useCallback(() => {
    const s = useGameStore.getState();
    s.setRoundScore(3, s.score - s.roundScores[0] - s.roundScores[1]);
    s.setPhase("result");
    s.setGameCompleted(true);
    saveGameState({ phase: "result", gameCompleted: true });
  }, []);

  useEffect(() => {
    setTimeRemaining(TOTAL_TIME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (r3PlayCount <= 0) finishGame();
  }, [r3PlayCount, finishGame]);

  useEffect(() => {
    if (r3PlayCount > 0 && currentQuestionIndex >= r3PlayCount) finishGame();
  }, [currentQuestionIndex, r3PlayCount, finishGame]);

  useGameTimer(!timeExpired && !answered, finishGame);

  const handleAnswer = (answer: string) => {
    if (answered || timeExpired || !question) return;
    setAnswered(true);
    const correct = validateRound3Answer(question, answer);
    const points = correct ? getPointsForRound(3) : 0;
    addScore(points);
    setFeedback({ correct, points });
    createAnswer(question.id, answer, correct, 3);
    const nextScore = useGameStore.getState().score;
    saveGameState({ score: nextScore });
    if (correct) playCorrect();
    else playWrong();
    setTimeout(() => {
      if (useGameStore.getState().timeRemaining <= 0) {
        finishGame();
        return;
      }
      if (isLastQuestion) {
        finishGame();
      } else {
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

      <AnimatePresence>
        {isCritical && (
          <motion.div
            key="screen-warning"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
            className="fixed inset-0 pointer-events-none z-40"
            style={{
              boxShadow: "inset 0 0 60px rgba(239,68,68,0.35)",
              border: "3px solid rgba(239,68,68,0.5)",
              transform: "translateZ(0)",
            }}
          />
        )}
      </AnimatePresence>

      <div className="w-full max-w-3xl mx-auto px-4 py-5 pb-10 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(177,201,235,0.15) 0%, rgba(10,1,71,0.7) 100%)",
              border: "1px solid rgba(177,201,235,0.35)",
              backdropFilter: "blur(12px)",
              transform: "translateZ(0)",
            }}
          >
            <div>
              <p className="text-icai-light-blue/60 text-[10px] tracking-widest uppercase font-semibold">
                Round 3 of 3 · Final Round
              </p>
              <h2 className="text-lg font-black text-icai-light-grey">⚡ Lightning Round</h2>
              <p className="text-icai-light-blue/45 text-[10px] mt-1">
                {TOTAL_TIME} seconds for the full round
              </p>
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

          <AnimatePresence initial={false}>
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.28, ease: EASE }}
              style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
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
    </>
  );
}
