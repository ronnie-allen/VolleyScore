import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddTeamForm } from '@/components/teams/add-team-form';
import { useScoreboardStore } from '@/store/scoreboard-store';
import { Toaster } from '@/components/ui/toaster';

function resetStore() {
  useScoreboardStore.setState({ teams: [], scores: [], selectedDate: '2026-11-16' });
  window.localStorage.clear();
}

beforeEach(resetStore);

describe('AddTeamForm', () => {
  it('shows a validation error for a too-short name', async () => {
    const user = userEvent.setup();
    render(<AddTeamForm />);

    await user.type(screen.getByLabelText(/team name/i), 'A');
    await user.click(screen.getByRole('button', { name: /add team/i }));

    expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument();
    expect(useScoreboardStore.getState().teams).toHaveLength(0);
  });

  it('adds a team with one member per line, preserving commas in names', async () => {
    const user = userEvent.setup();
    render(<><AddTeamForm /><Toaster /></>);

    await user.type(screen.getByLabelText(/team name/i), 'Spike Squad');
    await user.type(
      screen.getByLabelText(/team members/i),
      'Alice\nBob, Jr.\nBob, Jr.\n\nEve'
    );
    await user.click(screen.getByRole('button', { name: /add team/i }));

    const { teams } = useScoreboardStore.getState();
    expect(teams).toHaveLength(1);
    expect(teams[0].name).toBe('Spike Squad');
    // Blank lines dropped, names trimmed, commas inside names preserved
    expect(teams[0].members).toEqual(['Alice', 'Bob, Jr.', 'Bob, Jr.', 'Eve']);
  });
});
