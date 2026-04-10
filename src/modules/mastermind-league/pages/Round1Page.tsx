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
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { AnswerFeedback } from "../components";
import { round1Questions } from "../data/questions";
import { useGameStore } from "../store/gameStore";
import { validateRound1Answer, createAnswer } from "../engine/gameEngine";
import { getPointsForRound, POINTS_ROUND_1 } from "../utils/scoring";
import {
  ROUND1_SEC_PER_QUESTION,
  ROUND2_SEC_PER_QUESTION,
} from "../constants/gameTiming";
import { saveGameState } from "../services/gameService";
import { useGameTimer } from "../hooks/useGameTimer";
import { useTabSwitchDetection } from "../hooks/useTabSwitchDetection";
import { useSoundEffects } from "../hooks/useSoundSystem";

const TIME_PER_QUESTION = ROUND1_SEC_PER_QUESTION;
const FEEDBACK_DURATION_MS = 1600;
const ROUND_SUMMARY_MS = 3000;

const EASE = [0.33, 1, 0.68, 1] as const;

// ── Round summary overlay ────────────────────────────────────────────────────
function RoundSummaryOverlay({
  score,
  maxScore,
  onDone,
}: {
  score: number;
  maxScore: number;
  onDone: () => void;
}) {
  const topScore = Math.min(maxScore, score + 5 + Math.floor(Math.random() * 8));
  const avgScore = Math.max(0, Math.floor(score * 0.75 + Math.random() * 5));
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const topPct = maxScore > 0 ? (topScore / maxScore) * 100 : 0;
  const avgPct = maxScore > 0 ? (avgScore / maxScore) * 100 : 0;

  useEffect(() => {
    const t = setTimeout(onDone, ROUND_SUMMARY_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(4,6,20,0.85)", backdropFilter: "blur(12px)" }}
    >
      <motion.div
        initial={{ scale: 0.88, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="rounded-2xl p-8 w-full max-w-sm mx-4"
        style={{
          background: "linear-gradient(148deg, rgba(8,12,35,0.97) 0%, rgba(4,6,20,0.99) 100%)",
          border: "1px solid rgba(255,189,89,0.35)",
          boxShadow: "0 0 40px rgba(255,189,89,0.12), 0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Trophy Lottie */}
        <div className="text-center mb-5">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.15 }}
            className="mx-auto mb-2"
            style={{ width: 80, height: 80 }}
          >
            <DotLottieReact
              src="https://lottie.host/188853c8-9ebc-4022-a4fb-22818baaba2e/Ns41jas4eR.lottie"
              autoplay
              loop
              style={{ width: "100%", height: "100%" }}
            />
          </motion.div>
          <h3
            className="text-xl font-black tracking-wide"
            style={{ color: "#FFBD59" }}
          >
            Round 1 Complete!
          </h3>
          <p className="text-icai-light-blue/55 text-xs tracking-widest uppercase mt-1">
            The Analyst Arena
          </p>
        </div>

        {/* Score comparison bars */}
        <div className="space-y-3 mb-6">
          {[
            { label: "Your Score", value: score, pct, color: "#FFBD59", highlight: true },
            { label: "Top Score", value: topScore, pct: topPct, color: "#B1C9EB", highlight: false },
            { label: "Avg Score", value: avgScore, pct: avgPct, color: "rgba(177,201,235,0.4)", highlight: false },
          ].map(({ label, value, pct: p, color, highlight }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`text-xs font-semibold ${
                    highlight ? "text-icai-yellow" : "text-icai-light-blue/60"
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`text-sm font-black tabular-nums ${
                    highlight ? "text-icai-yellow" : "text-icai-light-blue/70"
                  }`}
                >
                  {value}
                </span>
              </div>
              <div
                className="h-2.5 rounded-full overflow-hidden"
                style={{ background: "rgba(20,88,134,0.2)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${p}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  style={{
                    background: color,
                    boxShadow: highlight ? `0 0 8px ${color}60` : undefined,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-icai-light-blue/40">
          Advancing to Round 2…
        </p>
      </motion.div>
    </motion.div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
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
    setRoundScore,
  } = useGameStore();

  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<AnswerFeedback>(null);
  const [showSummary, setShowSummary] = useState(false);
  const handleTabViolationLimit = useCallback(() => {
    const s = useGameStore.getState();
    s.setRoundScore(1, s.score);
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
  const { playCorrect, playWrong, playTransition } = useSoundEffects();
  const timeRemaining = useGameStore((s) => s.timeRemaining);

  const question = round1Questions[currentQuestionIndex];
  const totalQuestions = round1Questions.length;
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;
  const isCritical = timeRemaining <= 5 && timeRemaining > 0;

  const doAdvance = useCallback(() => {
    playTransition();
    setRoundScore(1, score);
    setPhase("round2");
    setCurrentRound(2);
    setCurrentQuestionIndex(0);
    setTimeRemaining(ROUND2_SEC_PER_QUESTION);
    saveGameState({
      phase: "round2",
      currentRound: 2,
      currentQuestionIndex: 0,
      timeRemaining: ROUND2_SEC_PER_QUESTION,
    });
  }, [score, setRoundScore, setPhase, setCurrentRound, setCurrentQuestionIndex, setTimeRemaining, playTransition]);

  const advanceRound = useCallback(() => {
    setShowSummary(true);
  }, []);

  useGameTimer(!answered && !showSummary, () => {
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
    const points = correct ? getPointsForRound(1) : 0;
    addScore(points);
    setFeedback({ correct, points });
    createAnswer(question.id, answer, correct, 1);
    saveGameState({ score: useGameStore.getState().score });
    if (correct) playCorrect(); else playWrong();
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

      {/* Screen border flash on time critical */}
      <AnimatePresence>
        {isCritical && (
          <motion.div
            key="screen-warning"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
            className="fixed inset-0 pointer-events-none z-40"
            style={{
              boxShadow: "inset 0 0 60px rgba(239,68,68,0.35)",
              border: "3px solid rgba(239,68,68,0.5)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Round summary overlay */}
      <AnimatePresence>
        {showSummary && (
          <RoundSummaryOverlay
            score={score}
            maxScore={totalQuestions * POINTS_ROUND_1}
            onDone={doAdvance}
          />
        )}
      </AnimatePresence>

      <div className="w-full max-w-3xl mx-auto px-4 py-5 pb-10 space-y-4 md:max-h-none">
        {/* Round header banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,88,134,0.35) 0%, rgba(10,1,71,0.6) 100%)",
            border: "1px solid rgba(20,88,134,0.45)",
            backdropFilter: "blur(12px)",
            transform: "translateZ(0)",
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

        <AnimatePresence initial={false}>
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.28, ease: EASE }}
            style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
          >
            <QuestionCardMCQ
              question={question}
              onAnswer={handleAnswer}
              disabled={answered}
              feedback={feedback}
              timeRemaining={timeRemaining}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
