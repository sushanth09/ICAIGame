# ICAI Atlanta Mastermind League — UI Layout Design

## Design System
- **Theme**: Premium dark UI
- **Background**: Gradient `#020617` → `#0f172a`
- **Accent Gold**: `#FFD700` (buttons, highlights, score)
- **Accent Blue**: `#00D9FF` (secondary actions, links)
- **Typography**: Large, readable (min 18px body, 32px+ questions)

---

## 1. Landing Page (Game Start Screen)

```
┌─────────────────────────────────────────────────────────────┐
│  [ParticleBackground - full viewport]                        │
│                                                              │
│     ICAI Atlanta Chapter                                     │
│     Presents                                                 │
│                                                              │
│     ┌─────────────────────────────────────┐                 │
│     │   MASTERMIND LEAGUE                  │  ← Animated     │
│     │   The Quarterly Knowledge Challenge  │    title card   │
│     └─────────────────────────────────────┘                 │
│                                                              │
│     "Knowledge is the new currency.                          │
│      Are you ready to prove your worth?"                     │
│                                                              │
│     ┌─────────────────────────────────────┐                 │
│     │     [  START GAME  ]                 │  ← Glowing btn  │
│     └─────────────────────────────────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Components**: ParticleBackground, AnimatedTitle, QuoteCard, AnimatedButton

---

## 2. Welcome Page

```
┌─────────────────────────────────────────────────────────────┐
│  [GameLayout - ParticleBackground]                           │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ [Animated Card - m-4, p-6]                           │    │
│  │                                                      │    │
│  │  Welcome to the ICAI Atlanta's Mastermind League     │    │
│  │  [Body text - 2-3 paragraphs]                        │    │
│  │                                                      │    │
│  │  🏆 Play. Compete. Conquer.                          │    │
│  │                                                      │    │
│  │  [  CONTINUE  ]                                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Components**: GameLayout, AnimatedCard, AnimatedButton

---

## 3. Rules Page

```
┌─────────────────────────────────────────────────────────────┐
│  [GameLayout]                                                │
│                                                              │
│  Rules of the League                                         │
│                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ RoundCard 1 │ │ RoundCard 2 │ │ RoundCard 3 │  ← 3 cards │
│  │ Analyst     │ │ Myth or     │ │ Lightning   │    side by │
│  │ Arena       │ │ Fact        │ │ Round       │    side    │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                              │
│  Leaderboard Titles                                          │
│  ⭐ Rising Star | 📚 Scholar | 🧠 Mastermind                 │
│  🏆 Mastermind Champion 2026                                 │
│                                                              │
│  [  BEGIN GAME  ]                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Components**: GameLayout, RoundCard (×3), AnimatedButton

---

## 4. Round 1 (The Analyst Arena)

```
┌─────────────────────────────────────────────────────────────┐
│  [GameLayout]  [ProgressBar]  [Timer]  [ScoreDisplay]        │
│                                                              │
│  Round 1 — The Analyst Arena                                 │
│  Question 2 of 5                                             │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ [QuestionCard - hover tilt]                          │    │
│  │                                                      │    │
│  │  Question text (large, 24px+)                        │    │
│  │                                                      │    │
│  │  [ A ] Option A                                      │    │
│  │  [ B ] Option B   ← Clickable, glow on hover         │    │
│  │  [ C ] Option C                                      │    │
│  │  [ D ] Option D                                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  [  SUBMIT  ]  (or auto-advance)                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Components**: GameLayout, ProgressBar, Timer, ScoreDisplay, QuestionCard, AnimatedButton

---

## 5. Round 2 (Myth or Fact)

```
┌─────────────────────────────────────────────────────────────┐
│  [Same header as Round 1]                                    │
│                                                              │
│  Round 2 — Myth or Fact                                      │
│  Question 3 of 5                                             │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Statement (large)                                   │    │
│  │                                                      │    │
│  │  [  MYTH  ]  [  FACT  ]   ← Two large buttons        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Components**: Same as Round 1, QuestionCard with Myth/Fact variant

---

## 6. Round 3 (Lightning Round)

```
┌─────────────────────────────────────────────────────────────┐
│  [Same header - Timer prominent, 60s countdown]              │
│                                                              │
│  Round 3 — Lightning Round                                   │
│  Answer the term for the abbreviation / definition           │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ROE  (or definition)                                │    │
│  │                                                      │    │
│  │  [ Input field - large, centered ]                   │    │
│  │                                                      │    │
│  │  [  SUBMIT  ]                                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Components**: Same header, QuestionCard with input variant, Timer (60s)

---

## 7. Result Page

```
┌─────────────────────────────────────────────────────────────┐
│  [React Confetti overlay]                                    │
│  [GameLayout - ParticleBackground]                           │
│                                                              │
│  🎉 Congratulations Challenger!                              │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Final Score: [CountUp animation] 85                 │    │
│  │  Leaderboard Rank: #3                                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  "Great finance professionals don't just manage numbers      │
│   — they master them."                                       │
│                                                              │
│  Will you be ICAI Atlanta's next Mastermind Champion?        │
│                                                              │
│  [  PLAY AGAIN  ]  (disabled if quarter restriction)         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Components**: React Confetti, GameLayout, CountUp, AnimatedCard, Leaderboard

---

## Shared Patterns

- **Animated cards**: Framer Motion `motion.div` with `whileHover={{ scale: 1.02, y: -2 }}`, `transition`
- **Glowing buttons**: `box-shadow: 0 0 20px rgba(255,215,0,0.5)`, hover intensify
- **Page transitions**: AnimatePresence with fade/slide
- **Responsive**: Stack cards vertically on mobile; horizontal on desktop
