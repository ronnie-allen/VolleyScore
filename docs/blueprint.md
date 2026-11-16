# VolleyTracker — Product Blueprint

## Purpose
A local-first volleyball score tracker. Single-page web app, no backend,
data persisted in the browser (`localStorage`). Ships as a static Next.js site.

## Features (shipped)
- **Team management** — add, edit, delete teams (name + one member per line).
  Deleting a team cascades to its score history.
- **Daily scoreboard** — per team, per day: games won/lost, sets won/lost (0+, clamped).
- **Match history** (`/history`) — all recorded match days, most recent first, filterable by team.
- **Standings** (`/standings`) — aggregate ranked by win %, tie-broken by set ratio.
- **Export / import** — dated JSON snapshot; zod-validated import that drops orphaned
  scores and duplicate ids, confirms before replacing, and auto-downloads a backup of
  current data first.

## Style
- Dark theme by default (deep navy `#0d1321`-family background, teal primary `#3c6e71`-family,
  light accents). CSS variables in `src/app/globals.css` allow a light theme later.
- Volleyball-themed icons (lucide `Volleyball`, `Users`).
- Clean sections: left column team management, right column scoreboard.
- Subtle motion on score buttons (`score-update-animation`), disabled under
  `prefers-reduced-motion`.

## Architecture
- Next.js 16 (App Router) + React 19 + TypeScript strict.
- zustand + `persist` (key `volleytracker-storage`, versioned schema).
- zod for form validation (react-hook-form) and import parsing.
- Derived data (daily rows, standings, history) computed in `src/lib/`.
- Local calendar-date handling only (`src/lib/date.ts`).

## Out of scope (deliberately)
No accounts, no server persistence, no realtime multiplayer, no PWA, no light theme (yet).
