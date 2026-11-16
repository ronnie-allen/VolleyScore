# VolleyTracker

Track volleyball teams and their daily match scores. Local-first: all data lives in your
browser's `localStorage` — no backend or account required.

## Features

- **Team management** — add, edit, and delete teams (with members). Deleting a team also removes its score history.
- **Daily scoreboard** — increment/decrement games won/lost and sets won/lost per team, per day.
- **Match history** — browse all previously recorded match days, filterable by team.
- **Standings** — aggregate win percentage and set ratio per team, ranked automatically.
- **Export / import** — download a JSON snapshot of all data and re-import it later (or on another device). Imports are validated with zod; orphaned scores and duplicate ids are dropped. Importing **replaces all current data** — your current data is downloaded as a backup file first, and the import is confirmed before it is applied.
- **Persistence** — zustand + `persist` middleware; state survives reloads. Storage failures (private browsing, quota) degrade gracefully to in-memory.

## Requirements

- Node.js >= 20

## Getting started

```bash
npm ci
npm run dev        # http://localhost:9002
```

## Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the dev server (port 9002)     |
| `npm run build`     | Production build                     |
| `npm start`         | Serve the production build           |
| `npm run typecheck` | `tsc --noEmit`                       |
| `npm run lint`      | ESLint (flat config)                 |
| `npm test`          | Vitest unit/component tests          |
| `npm run test:watch`| Vitest in watch mode                 |

## Architecture

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript (strict)
- **UI**: Tailwind CSS + shadcn/ui (Radix primitives)
- **State**: zustand with `persist` → `localStorage` key `volleytracker-storage`, schema version 1
- **Validation**: zod (forms via react-hook-form, import parsing)
- **Tests**: Vitest + Testing Library (jsdom)

### Data model

```ts
Team  { id: string; name: string; members: string[] }
Score { id: string; teamId: string; date: string /* YYYY-MM-DD, local */;
        gamesWon: number; gamesLost: number; setsWon: number; setsLost: number }
```

Derived views (`DailyScoreRow`, standings, history) are computed in `src/lib/scoreboard.ts`.
Date handling (`src/lib/date.ts`) always uses **local** calendar dates — never `new Date('YYYY-MM-DD')`.

### Export format

```json
{
  "version": 1,
  "exportedAt": "<ISO-8601 timestamp>",
  "teams": [...],
  "scores": [...]
}
```

## CI

GitHub Actions (`.github/workflows/ci.yml`): install → typecheck → lint → test → build on every push and PR.

## Deployment (Vercel, zero-config)

The app is a fully static Next.js site (all routes are prerendered) with no environment
variables, no database, and no server-side secrets — hosting is entirely optional and
`localStorage` keeps data per-browser.

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the project at [vercel.com/new](https://vercel.com/new) — the Next.js preset is detected automatically.
3. Deploy. Every push to the default branch redeploys automatically; pull requests get preview URLs.

No configuration files, build overrides, or environment variables are required.
Alternatively, self-host with `npm ci && npm run build && npm start` (Node >= 20).

Note: persisted browser data (`localStorage`) is per-origin — exporting a JSON backup
before switching domains is recommended.

## Security posture

`npm audit` currently reports **8 moderate** advisories, all inside the dev-only
`@typescript-eslint/minimatch` chain used by ESLint (ReDoS in the linter, not shipped to
users). There are no high or critical findings; run `npm audit` before releases.
