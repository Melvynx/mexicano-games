# Mexicano Games - Padel Tournament Manager

## Project Purpose
A modern web application for managing Padel Mexicano tournaments - a competitive padel tennis format where 8 players compete over 7 rounds with dynamic team generation based on rankings.

## App Overview
- **Type**: React + TypeScript + Vite web application
- **Styling**: Tailwind CSS
- **State Management**: Custom hooks (useLocalStorage, useTournament)
- **Deployment**: Vercel

## Core Features
1. **Tournament Management**: 8-player tournament across 7 rounds
2. **Dynamic Team Generation**: Teams based on current rankings, with constraint that no player pairs twice
3. **Score Tracking**: First to 3 games wins format with detailed scoring
4. **Leaderboard**: Real-time ranking updates based on match results
5. **Rules Engine**: Complex rules including tie-breaks, deuce, and golden ball mechanics
6. **Player Setup**: Modal-based player name entry and selection

## Key Rules
- **Format**: 8 players, 7 rounds, 2 matches per round (4 players per match)
- **Scoring**: First to 3 games wins, 1 point per game won
- **Tie-break**: At 2-2 games, play to 7 points (with 2-point margin, max 10 points)
- **Deuce Rule**: At 40-40, play one deuce (ad-40/40-ad), then golden ball if tied again
- **Golden Ball**: Receiving team chooses which player to serve to; at 9-9 in tie-break, receiver also chooses
- **Serve Determination**: Use paddle spin - handle position pointing up determines first server
- **Tie-break Serves**: First team serves left, second team serves 2 (starting right), then alternates

## Project Structure
```
src/
├── components/PadelMexicano/
│   ├── index.tsx              # Main tournament component
│   ├── PlayerSetup.tsx        # Initial player entry
│   ├── Tournament.tsx          # Tournament logic and UI
│   ├── Leaderboard.tsx         # Rankings display
│   ├── RankingBadge.tsx        # Badge component
│   ├── NameModal.tsx           # Player name input modal
│   ├── ScoreModal.tsx          # Score input modal
│   └── About.tsx               # Rules and information
├── hooks/
│   ├── useTournament.ts        # Tournament state management
│   └── useLocalStorage.ts      # Local storage persistence
└── utils/
    ├── constants.ts            # Types and configurations
    └── mexicano.ts             # Tournament logic (team generation, scoring)
```

## Development Guidelines
- Use TypeScript for type safety
- Keep components focused and composable
- Use Tailwind for styling (no CSS files except global)
- Persist state to localStorage automatically
- Follow existing modal and button styling patterns

## Deployment
- Hosted on Vercel (auto-deploys from main branch)
- Build command: `npm run build` (TypeScript + Vite)
- Live URL: https://mexicano-games.vercel.app/

---

See [AGENTS.md](./AGENTS.md) for AI agent guidelines and project context.
