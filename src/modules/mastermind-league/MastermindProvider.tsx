"use client";

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
import {
  recordLastPlayedQuarter,
  saveGameState,
  clearGameState,
} from "./services/gameService";
import { getCurrentQuarter } from "./utils/helpers";
import { useCanPlayThisQuarter } from "./hooks/useQuarterRestrictionSync";

export function MastermindProvider() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);
  const { canPlay, currentQuarter } = useCanPlayThisQuarter();

  const handleStart = () => {
    if (!canPlay) return;
    setPhase("rules");
    saveGameState({ phase: "rules" });
  };

  const handleBeginGame = () => {
    recordLastPlayedQuarter(getCurrentQuarter()).catch(() => {});
    setPhase("startgame");
    saveGameState({ phase: "startgame" });
  };

  const handleActualBegin = () => {
    setPhase("round1");
    saveGameState({
      phase: "round1",
      currentRound: 1,
      currentQuestionIndex: 0,
      timeRemaining: 30,
      gameStarted: true,
      score: 0,
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
      <AnimatePresence mode="wait" initial={false}>
        {phase === "landing" && (
          <LandingPage
            key="landing"
            onStart={handleStart}
            canPlay={canPlay}
            nextQuarterInfo={canPlay ? undefined : `Q${currentQuarter}`}
          />
        )}
        {phase === "rules" && (
          <RulesPage key="rules" onBegin={handleBeginGame} />
        )}
        {phase === "startgame" && (
          <StartGamePage key="startgame" onBegin={handleActualBegin} />
        )}
        {phase === "round1" && <Round1Page key="round1" />}
        {phase === "round2" && <Round2Page key="round2" />}
        {phase === "round3" && <Round3Page key="round3" />}
        {phase === "result" && <ResultPage key="result" />}
      </AnimatePresence>
    </>
  );
}
