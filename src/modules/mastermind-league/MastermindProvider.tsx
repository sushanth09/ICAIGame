"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { LandingPage } from "./pages/LandingPage";
import { RulesPage } from "./pages/RulesPage";
import { StartGamePage } from "./pages/StartGamePage";
import { Round1Page } from "./pages/Round1Page";
import { Round2Page } from "./pages/Round2Page";
import { Round3Page } from "./pages/Round3Page";
import { ResultPage } from "./pages/ResultPage";
import { useGameStore } from "./store/gameStore";
import { saveGameState } from "./services/gameService";
import { useChallengeAccess } from "./hooks/useChallengeAccess";
import { getSessionProfile } from "./services/registrationService";
import type { PlayerProfile } from "./types/gameTypes";
import { startGameBackgroundMusic } from "./audio/backgroundMusic";

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
      timeRemaining: 30,
      gameStarted: false,
      gameCompleted: false,
      disqualified: false,
    });
    useGameStore.setState({
      score: 0,
      roundScores: [0, 0, 0],
      currentRound: 1,
      currentQuestionIndex: 0,
      timeRemaining: 30,
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
      timeRemaining: 30,
      gameStarted: true,
      score: 0,
      disqualified: false,
    });
    useGameStore.setState({
      gameStarted: true,
      timeRemaining: 30,
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
