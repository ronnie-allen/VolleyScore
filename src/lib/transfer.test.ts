import { describe, expect, it } from 'vitest';
import { buildExportData, parseExportData, serializeExportData } from '@/lib/transfer';
import type { Score, Team } from '@/types';

const teams: Team[] = [
  { id: 't1', name: 'Alpha', members: ['Alice'] },
  { id: 't2', name: 'Beta', members: [] },
];

const scores: Score[] = [
  { id: 's1', teamId: 't1', date: '2026-11-01', gamesWon: 3, gamesLost: 1, setsWon: 9, setsLost: 4 },
];

describe('parseExportData', () => {
  it('round-trips a serialized export', () => {
    const json = serializeExportData(teams, scores);
    const parsed = parseExportData(JSON.parse(json));
    expect(parsed.teams).toEqual(teams);
    expect(parsed.scores).toEqual(scores);
  });

  it('drops scores that reference unknown teams', () => {
    const parsed = parseExportData({
      teams,
      scores: [
        ...scores,
        { id: 's2', teamId: 'ghost', date: '2026-11-01', gamesWon: 1, gamesLost: 0, setsWon: 3, setsLost: 0 },
      ],
    });
    expect(parsed.scores).toHaveLength(1);
  });

  it('rejects duplicate team ids', () => {
    expect(() =>
      parseExportData({ teams: [...teams, { id: 't1', name: 'Dupe', members: [] }], scores: [] })
    ).toThrow(/duplicate/i);
  });

  it('rejects structurally invalid payloads', () => {
    expect(() => parseExportData(null)).toThrow();
    expect(() => parseExportData({ teams: 'nope', scores: [] })).toThrow();
    expect(() =>
      parseExportData({
        teams,
        scores: [{ id: 's1', teamId: 't1', date: 'not-a-date', gamesWon: 1, gamesLost: 1, setsWon: 1, setsLost: 1 }],
      })
    ).toThrow();
    expect(() =>
      parseExportData({
        teams,
        scores: [{ id: 's1', teamId: 't1', date: '2026-11-01', gamesWon: -1, gamesLost: 1, setsWon: 1, setsLost: 1 }],
      })
    ).toThrow();
  });
});

describe('buildExportData', () => {
  it('stamps version and export time', () => {
    const data = buildExportData(teams, scores);
    expect(data.version).toBeGreaterThanOrEqual(1);
    expect(() => new Date(data.exportedAt).toISOString()).not.toThrow();
    expect(data.teams).toBe(teams);
    expect(data.scores).toBe(scores);
  });
});
