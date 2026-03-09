"use client";

import { MastermindProvider } from "@/modules/mastermind-league/MastermindProvider";
import { GameLayout } from "@/modules/mastermind-league/components";

export default function Home() {
  return (
    <GameLayout>
      <MastermindProvider />
    </GameLayout>
  );
}
