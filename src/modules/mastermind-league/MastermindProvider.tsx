"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { LandingPage } from "./pages/LandingPage";
import { ROUND1_SEC_PER_QUESTION } from "./constants/gameTiming";
import { useGameStore } from "./store/gameStore";
import { saveGameState } from "./services/gameService";
import { useChallengeAccess } from "./hooks/useChallengeAccess";
import { getSessionProfile } from "./services/registrationService";
import type { PlayerProfile } from "./types/gameTypes";
import { startGameBackgroundMusic } from "./audio/backgroundMusic";

const RulesPage = dynamic(() =>
  import("./pages/RulesPage").then((m) => ({ default: m.RulesPage }))
);
const StartGamePage = dynamic(() =>
  import("./pages/StartGamePage").then((m) => ({ default: m.StartGamePage }))
);
const Round1Page = dynamic(() =>
  import("./pages/Round1Page").then((m) => ({ default: m.Round1Page }))
);
const Round2Page = dynamic(() =>
  import("./pages/Round2Page").then((m) => ({ default: m.Round2Page }))
);
const Round3Page = dynamic(() =>
  import("./pages/Round3Page").then((m) => ({ default: m.Round3Page }))
);
const ResultPage = dynamic(() =>
  import("./pages/ResultPage").then((m) => ({ default: m.ResultPage }))
);

export function MastermindProvider() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);
  const setPlayerProfile = useGameStore((s) => s.setPlayerProfile);
  const {
    canEnter,
    challengeActive,
    deviceLocked,
    statusMessage,
    quarterLabel,
    msUntilStart,
  } = useChallengeAccess();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const existing = getSessionProfile();
    if (existing && !useGameStore.getState().playerProfile) {
      setPlayerProfile(existing);
    }
  }, [setPlayerProfile]);

  const handleStart = () => {
    if (!canEnter) return;
    setPhase("rules");
    saveGameState({ phase: "rules" });
  };

  const handleRegistered = (profile: PlayerProfile) => {
    setPlayerProfile(profile);
    setPhase("startgame");
    saveGameState({
      phase: "startgame",
      score: 0,
      currentRound: 1,
      currentQuestionIndex: 0,
      timeRemaining: ROUND1_SEC_PER_QUESTION,
      gameStarted: false,
      gameCompleted: false,
      disqualified: false,
    });
    useGameStore.setState({
      score: 0,
      roundScores: [0, 0, 0],
      currentRound: 1,
      currentQuestionIndex: 0,
      timeRemaining: ROUND1_SEC_PER_QUESTION,
      gameStarted: false,
      gameCompleted: false,
      disqualified: false,
    });
  };

  const handleBeginQuiz = () => {
    startGameBackgroundMusic();
    setPhase("round1");
    saveGameState({
      phase: "round1",
      currentRound: 1,
      currentQuestionIndex: 0,
      timeRemaining: ROUND1_SEC_PER_QUESTION,
      gameStarted: true,
      score: 0,
      disqualified: false,
    });
    useGameStore.setState({
      gameStarted: true,
      timeRemaining: ROUND1_SEC_PER_QUESTION,
    });
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#0A0147",
            color: "#E8E9E4",
            border: "1px solid rgba(20, 88, 134, 0.5)",
            fontFamily: "var(--font-poppins)",
          },
        }}
      />
      <AnimatePresence initial={false}>
        {phase === "landing" && (
          <LandingPage
            key="landing"
            onStart={handleStart}
            canPlay={canEnter}
            statusMessage={statusMessage}
            quarterLabel={quarterLabel}
            challengeActive={challengeActive}
            deviceLocked={deviceLocked}
            msUntilStart={msUntilStart}
          />
        )}
        {phase === "rules" && (
          <RulesPage key="rules" onRegistered={handleRegistered} />
        )}
        {phase === "startgame" && (
          <StartGamePage key="startgame" onBegin={handleBeginQuiz} />
        )}
        {phase === "round1" && <Round1Page key="round1" />}
        {phase === "round2" && <Round2Page key="round2" />}
        {phase === "round3" && <Round3Page key="round3" />}
        {phase === "result" && <ResultPage key="result" />}
      </AnimatePresence>
    </>
  );
}
