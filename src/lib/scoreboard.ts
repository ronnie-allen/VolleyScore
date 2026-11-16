import type { DailyScoreRow, Score, ScoreField, StandingsEntry, Team } from '@/types';
import { isValidISODate } from '@/lib/date';

export const SCORE_FIELDS: ScoreField[] = ['gamesWon', 'gamesLost', 'setsWon', 'setsLost'];

export function buildDailyRows(teams: Team[], scores: Score[], date: string): DailyScoreRow[] {
  const byTeam = new Map(scores.filter((s) => s.date === date).map((s) => [s.teamId, s]));
  return teams.map((team) => ({ team, score: byTeam.get(team.id) ?? null }));
}

export function computeStandings(teams: Team[], scores: Score[]): StandingsEntry[] {
  const totals = new Map<string, StandingsEntry>(
    teams.map((team) => [
      team.id,
      {
        team,
        gamesWon: 0,
        gamesLost: 0,
        setsWon: 0,
        setsLost: 0,
        matchesPlayed: 0,
        winPct: 0,
        setRatio: 0,
      },
    ])
  );

  for (const score of scores) {
    const entry = totals.get(score.teamId);
    if (!entry) continue; // score for a deleted team — ignore defensively
    entry.gamesWon += score.gamesWon;
    entry.gamesLost += score.gamesLost;
    entry.setsWon += score.setsWon;
    entry.setsLost += score.setsLost;
    if (score.gamesWon > 0 || score.gamesLost > 0 || score.setsWon > 0 || score.setsLost > 0) {
      entry.matchesPlayed += 1;
    }
  }

  const entries = [...totals.values()].map((entry) => {
    const totalGames = entry.gamesWon + entry.gamesLost;
    const setRatio = entry.setsLost === 0 ? entry.setsWon : entry.setsWon / entry.setsLost;
    return {
      ...entry,
      winPct: totalGames === 0 ? 0 : entry.gamesWon / totalGames,
      setRatio,
    };
  });

  return entries.sort(
    (a, b) =>
      b.winPct - a.winPct ||
      b.setRatio - a.setRatio ||
      b.gamesWon - a.gamesWon ||
      a.team.name.localeCompare(b.team.name)
  );
}

export function collectScoreDates(scores: Score[]): string[] {
  return [...new Set(scores.map((s) => s.date).filter(isValidISODate))].sort().reverse();
}

export function buildHistoryRows(
  teams: Team[],
  scores: Score[],
  date: string
): DailyScoreRow[] {
  return buildDailyRows(teams, scores, date);
}
