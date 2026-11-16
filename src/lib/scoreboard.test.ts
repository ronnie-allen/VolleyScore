import { describe, expect, it } from 'vitest';
import { buildDailyRows, collectScoreDates, computeStandings } from '@/lib/scoreboard';
import type { Score, Team } from '@/types';

const teams: Team[] = [
  { id: 't1', name: 'Alpha', members: ['A'] },
  { id: 't2', name: 'Beta', members: ['B'] },
];

const scores: Score[] = [
  { id: 's1', teamId: 't1', date: '2026-11-01', gamesWon: 3, gamesLost: 1, setsWon: 9, setsLost: 4 },
  { id: 's2', teamId: 't2', date: '2026-11-01', gamesWon: 1, gamesLost: 3, setsWon: 4, setsLost: 9 },
  { id: 's3', teamId: 't1', date: '2026-11-05', gamesWon: 2, gamesLost: 2, setsWon: 6, setsLost: 6 },
  { id: 's-orphan', teamId: 't999', date: '2026-11-05', gamesWon: 9, gamesLost: 0, setsWon: 9, setsLost: 0 },
];

describe('buildDailyRows', () => {
  it('pairs each team with its score for the date', () => {
    const rows = buildDailyRows(teams, scores, '2026-11-01');
    expect(rows).toHaveLength(2);
    expect(rows.find((r) => r.team.id === 't1')?.score?.gamesWon).toBe(3);
    expect(rows.find((r) => r.team.id === 't2')?.score?.gamesLost).toBe(3);
  });

  it('returns null score for dates with no entry', () => {
    const rows = buildDailyRows(teams, scores, '2026-12-01');
    expect(rows.every((r) => r.score === null)).toBe(true);
  });
});

describe('computeStandings', () => {
  it('aggregates totals across dates and ranks by win percentage', () => {
    const standings = computeStandings(teams, scores);
    const alpha = standings.find((s) => s.team.id === 't1')!;
    const beta = standings.find((s) => s.team.id === 't2')!;

    expect(alpha.gamesWon).toBe(5);
    expect(alpha.gamesLost).toBe(3);
    expect(alpha.setsWon).toBe(15);
    expect(alpha.setsLost).toBe(10);
    expect(beta.gamesWon).toBe(1);
    expect(standings[0].team.id).toBe('t1');
    expect(alpha.winPct).toBeCloseTo(5 / 8);
  });

  it('ignores scores referencing unknown teams', () => {
    const standings = computeStandings(teams, scores);
    expect(standings).toHaveLength(2);
    expect(standings.every((s) => s.team.id !== 't999')).toBe(true);
  });

  it('handles empty input and zero totals without dividing by zero', () => {
    expect(computeStandings([], [])).toEqual([]);
    const standings = computeStandings(teams, []);
    expect(standings.every((s) => s.winPct === 0 && s.setRatio === 0)).toBe(true);
  });
});

describe('collectScoreDates', () => {
  it('returns unique dates, most recent first', () => {
    expect(collectScoreDates(scores)).toEqual(['2026-11-05', '2026-11-01']);
  });

  it('returns an empty array for no scores', () => {
    expect(collectScoreDates([])).toEqual([]);
  });
});
