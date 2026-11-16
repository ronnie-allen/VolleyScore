export interface Team {
  id: string;
  name: string;
  members: string[];
}

export interface Score {
  id: string;
  teamId: string;
  date: string; // Format: YYYY-MM-DD (local calendar date)
  gamesWon: number;
  gamesLost: number;
  setsWon: number;
  setsLost: number;
}

// Combined view of a team and its score entry for a specific day.
// `score` is null when the team has no recorded score for that date yet.
export interface DailyScoreRow {
  team: Team;
  score: Score | null;
}

export type ScoreField = 'gamesWon' | 'gamesLost' | 'setsWon' | 'setsLost';

export interface StandingsEntry {
  team: Team;
  gamesWon: number;
  gamesLost: number;
  setsWon: number;
  setsLost: number;
  matchesPlayed: number;
  winPct: number;
  setRatio: number;
}

export interface ExportData {
  version: number;
  exportedAt: string;
  teams: Team[];
  scores: Score[];
}
