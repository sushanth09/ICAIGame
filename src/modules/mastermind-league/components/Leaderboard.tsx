"use client";

import { motion } from "framer-motion";
import type { LeaderboardEntry } from "../types/gameTypes";

const EASE = [0.33, 1, 0.68, 1] as const;

const getRankEmoji = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentScore?: number;
}

export function Leaderboard({ entries, currentScore }: LeaderboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="w-full max-w-md mx-auto"
    >
      <h3 className="text-lg font-semibold text-icai-dark-indigo mb-4">
        Top Scores
      </h3>
      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-icai-light-blue/70 text-center py-4">
            No scores yet. Be the first!
          </p>
        ) : (
          entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
              className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                currentScore !== undefined && entry.score === currentScore
                  ? "border-icai-yellow bg-icai-yellow/15"
                  : "border-icai-blue/30 bg-icai-dark-grey/40"
              }`}
            >
              <span className="text-icai-yellow font-medium">
                {getRankEmoji(entry.rank)}
              </span>
              <span className="text-icai-light-blue truncate flex-1 mx-3">
                {entry.playerName}
              </span>
              <span className="text-icai-yellow font-bold">{entry.score}</span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
