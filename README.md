# ICAI Atlanta Mastermind League

**The Quarterly Knowledge Challenge** — A premium interactive quiz game for finance professionals.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Framer Motion** — animations
- **Zustand** — state management
- **tsParticles** — particle background
- **React Confetti** — celebration
- **React CountUp** — animated score
- **React Hot Toast** — notifications
- **use-sound** — sound effects (optional)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
└── modules/
    └── mastermind-league/    ← Self-contained game module
        ├── pages/
        ├── components/
        ├── engine/
        ├── store/
        ├── hooks/
        ├── services/
        ├── data/
        ├── types/
        ├── utils/
        ├── MastermindProvider.tsx
        └── UI_LAYOUT_DESIGN.md
```

## Game Flow

1. **Landing** → Start screen
2. **Welcome** → Introduction
3. **Rules** → Round descriptions
4. **Round 1** — The Analyst Arena (5 MCQs, 30s each, 10 pts)
5. **Round 2** — Myth or Fact (5 T/F, 20s each, 10 pts)
6. **Round 3** — Lightning Round (10 questions, 60s total, 5 pts each)
7. **Result** → Final score, leaderboard, confetti

## Features

- Premium dark UI (gradient `#020617` → `#0f172a`)
- Gold & electric blue accents
- Particle background
- Glowing buttons and animated cards
- Countdown timers
- Anti-cheating (tab switch warning)
- Quarterly restriction (play once per quarter)
- Leaderboard (localStorage; ready for API)

## Migration to Production

The entire game lives in `src/modules/mastermind-league/`. Copy this folder into a Next.js project:

```text
src/modules/mastermind-league/
```

Replace `gameService.ts` and `leaderboardService.ts` with API calls:

- `POST /api/mastermind/start`
- `POST /api/mastermind/answer`
- `POST /api/mastermind/finish`
- `GET /api/mastermind/leaderboard`

---

Built for ICAI Atlanta Chapter.
