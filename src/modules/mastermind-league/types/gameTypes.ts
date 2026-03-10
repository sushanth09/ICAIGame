// ICAI Atlanta Mastermind League - Game Types

export type GamePhase =
  | "landing"
  | "rules"
  | "startgame"
  | "round1"
  | "round2"
  | "round3"
  | "result";

export type RoundType = "analyst" | "myth-fact" | "lightning";

export interface MCQOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Round1Question {
  id: string;
  text: string;
  options: MCQOption[];
  correctAnswer: string; // A, B, C, or D
}

export interface Round2Question {
  id: string;
  text: string;
  correctAnswer: boolean; // true = Fact, false = Myth
}

export interface Round3Question {
  id: string;
  text: string;
  options: MCQOption[];
  correctAnswer: string; // option id: A, B, C, or D
}

export type Question = Round1Question | Round2Question | Round3Question;

export interface GameRound {
  id: RoundType;
  title: string;
  questions: Question[];
  timePerQuestion?: number; // seconds
  totalTime?: number; // for round 3
  pointsPerCorrect: number;
}

export interface Answer {
  questionId: string;
  userAnswer: string | boolean;
  isCorrect: boolean;
  points: number;
}

export interface GameState {
  score: number;
  currentRound: 1 | 2 | 3;
  currentQuestionIndex: number;
  answers: Answer[];
  timeRemaining: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  phase: GamePhase;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  rank: number;
  date: string;
}
