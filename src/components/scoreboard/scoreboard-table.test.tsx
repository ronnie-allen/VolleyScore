import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScoreboardTable } from '@/components/scoreboard/scoreboard-table';
import { useScoreboardStore } from '@/store/scoreboard-store';
import { buildDailyRows } from '@/lib/scoreboard';

const DATE = '2026-11-16';

function resetStore() {
  useScoreboardStore.setState({ teams: [], scores: [], selectedDate: DATE });
  window.localStorage.clear();
}

beforeEach(resetStore);

describe('ScoreboardTable', () => {
  it('shows an empty state when there are no teams', () => {
    render(<ScoreboardTable rows={[]} date={DATE} />);
    expect(screen.getByText(/no teams available/i)).toBeInTheDocument();
  });

  it('increments a score when the + button is clicked', async () => {
    const team = useScoreboardStore.getState().addTeam('Alpha', []);
    const user = userEvent.setup();
    const rows = buildDailyRows(useScoreboardStore.getState().teams, useScoreboardStore.getState().scores, DATE);
    render(<ScoreboardTable rows={rows} date={DATE} />);

    await user.click(screen.getByRole('button', { name: `Increase sets won for ${team.name}` }));
    expect(useScoreboardStore.getState().scores[0].setsWon).toBe(1);
  });

  it('does not allow scores to go below zero', async () => {
    const team = useScoreboardStore.getState().addTeam('Alpha', []);
    const rows = buildDailyRows(useScoreboardStore.getState().teams, useScoreboardStore.getState().scores, DATE);
    render(<ScoreboardTable rows={rows} date={DATE} />);

    expect(screen.getByRole('button', { name: `Decrease games won for ${team.name}` })).toBeDisabled();
  });
});
