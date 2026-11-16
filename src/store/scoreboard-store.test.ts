import { beforeEach, describe, expect, it } from 'vitest';
import { useScoreboardStore, STORAGE_KEY } from '@/store/scoreboard-store';

function resetStore() {
  useScoreboardStore.setState({ teams: [], scores: [], selectedDate: '2026-11-16' });
  window.localStorage.clear();
}

beforeEach(resetStore);

describe('teams', () => {
  it('adds a team with trimmed name and members', () => {
    const team = useScoreboardStore.getState().addTeam('  Alpha  ', [' A ', '', 'B']);
    expect(team.name).toBe('Alpha');
    expect(team.members).toEqual(['A', 'B']);
    expect(team.id).toBeTruthy();
    expect(useScoreboardStore.getState().teams).toHaveLength(1);
  });

  it('updates a team name and members', () => {
    const team = useScoreboardStore.getState().addTeam('Alpha', ['A']);
    useScoreboardStore.getState().updateTeam(team.id, { name: '  Alpha Prime ', members: ['X', ' Y '] });
    const updated = useScoreboardStore.getState().teams[0];
    expect(updated.name).toBe('Alpha Prime');
    expect(updated.members).toEqual(['X', 'Y']);
  });

  it('ignores blank name updates', () => {
    const team = useScoreboardStore.getState().addTeam('Alpha', []);
    useScoreboardStore.getState().updateTeam(team.id, { name: '   ' });
    expect(useScoreboardStore.getState().teams[0].name).toBe('Alpha');
  });

  it('deletes a team and cascades its scores', () => {
    const team = useScoreboardStore.getState().addTeam('Alpha', []);
    useScoreboardStore.getState().updateScore(team.id, '2026-11-16', { gamesWon: 2 });
    useScoreboardStore.getState().deleteTeam(team.id);
    expect(useScoreboardStore.getState().teams).toHaveLength(0);
    expect(useScoreboardStore.getState().scores).toHaveLength(0);
  });
});

describe('updateScore', () => {
  it('creates a score entry on first update', () => {
    const team = useScoreboardStore.getState().addTeam('Alpha', []);
    useScoreboardStore.getState().updateScore(team.id, '2026-11-16', { gamesWon: 3 });
    const score = useScoreboardStore.getState().scores[0];
    expect(score).toMatchObject({ teamId: team.id, date: '2026-11-16', gamesWon: 3, gamesLost: 0 });
  });

  it('upserts an existing entry instead of duplicating', () => {
    const team = useScoreboardStore.getState().addTeam('Alpha', []);
    useScoreboardStore.getState().updateScore(team.id, '2026-11-16', { gamesWon: 1 });
    useScoreboardStore.getState().updateScore(team.id, '2026-11-16', { gamesWon: 5 });
    const scores = useScoreboardStore.getState().scores;
    expect(scores).toHaveLength(1);
    expect(scores[0].gamesWon).toBe(5);
  });

  it('clamps values to non-negative integers', () => {
    const team = useScoreboardStore.getState().addTeam('Alpha', []);
    useScoreboardStore.getState().updateScore(team.id, '2026-11-16', { gamesWon: -3 });
    expect(useScoreboardStore.getState().scores[0].gamesWon).toBe(0);
    useScoreboardStore.getState().updateScore(team.id, '2026-11-16', { gamesWon: 4.9 });
    expect(useScoreboardStore.getState().scores[0].gamesWon).toBe(4);
  });

  it('rejects invalid dates and unknown teams', () => {
    const team = useScoreboardStore.getState().addTeam('Alpha', []);
    useScoreboardStore.getState().updateScore(team.id, 'not-a-date', { gamesWon: 3 });
    useScoreboardStore.getState().updateScore('ghost', '2026-11-16', { gamesWon: 3 });
    expect(useScoreboardStore.getState().scores).toHaveLength(0);
  });
});

describe('persistence', () => {
  it('writes teams and scores to localStorage under the storage key', () => {
    const team = useScoreboardStore.getState().addTeam('Alpha', ['A']);
    useScoreboardStore.getState().updateScore(team.id, '2026-11-16', { setsWon: 2 });
    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    const persisted = JSON.parse(raw!);
    expect(persisted.state.teams).toHaveLength(1);
    expect(persisted.state.scores).toHaveLength(1);
    expect(persisted.version).toBe(1);
  });

  it('replaceAll swaps the dataset atomically', () => {
    useScoreboardStore.getState().addTeam('Alpha', []);
    useScoreboardStore.getState().replaceAll({
      teams: [{ id: 'imported', name: 'Imported FC', members: [] }],
      scores: [],
    });
    const state = useScoreboardStore.getState();
    expect(state.teams).toHaveLength(1);
    expect(state.teams[0].id).toBe('imported');
  });
});
