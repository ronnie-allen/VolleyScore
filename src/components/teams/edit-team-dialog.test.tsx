import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditTeamDialog } from '@/components/teams/edit-team-dialog';
import { useScoreboardStore } from '@/store/scoreboard-store';

function resetStore() {
  useScoreboardStore.setState({ teams: [], scores: [], selectedDate: '2026-11-16' });
  window.localStorage.clear();
}

beforeEach(resetStore);

describe('EditTeamDialog', () => {
  it('round-trips member names containing commas', async () => {
    const team = useScoreboardStore.getState().addTeam('Alpha', ['Bob, Jr.', 'Eve']);
    const user = userEvent.setup();
    render(<EditTeamDialog team={team} open={true} onOpenChange={() => {}} />);

    // Members are shown one per line; saving must not split on commas
    const textarea = screen.getByLabelText(/team members/i);
    expect(textarea).toHaveValue('Bob, Jr.\nEve');

    await user.clear(textarea);
    await user.type(textarea, 'Bob, Jr.\nMallory, III\nEve');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(useScoreboardStore.getState().teams[0].members).toEqual(['Bob, Jr.', 'Mallory, III', 'Eve']);
  });

  it('updates the team name', async () => {
    const team = useScoreboardStore.getState().addTeam('Alpha', []);
    const user = userEvent.setup();
    render(<EditTeamDialog team={team} open={true} onOpenChange={() => {}} />);

    const nameInput = screen.getByLabelText(/team name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Alpha Prime');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(useScoreboardStore.getState().teams[0].name).toBe('Alpha Prime');
  });
});
