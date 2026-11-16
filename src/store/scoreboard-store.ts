'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Score, ScoreField, Team } from '@/types';
import { todayISODate, isValidISODate, toISODateLocal } from '@/lib/date';
import { SCORE_FIELDS } from '@/lib/scoreboard';

export const STORAGE_KEY = 'volleytracker-storage';
export const STORAGE_VERSION = 1;

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function clampCount(value: unknown): number {
  const n = typeof value === 'number' && Number.isFinite(value) ? Math.trunc(value) : 0;
  return Math.max(0, Math.min(9999, n));
}

export interface ScoreboardState {
  teams: Team[];
  scores: Score[];
  selectedDate: string; // YYYY-MM-DD (local calendar date)
  addTeam: (name: string, members: string[]) => Team;
  updateTeam: (teamId: string, updates: { name?: string; members?: string[] }) => void;
  deleteTeam: (teamId: string) => void;
  updateScore: (
    teamId: string,
    date: string,
    updates: Partial<Record<ScoreField, number>>
  ) => void;
  setSelectedDate: (date: Date) => void;
  replaceAll: (data: { teams: Team[]; scores: Score[] }) => void;
}

// localStorage can be unavailable (private browsing, quota, SSR) — degrade to in-memory.
const safeStorage = {
  getItem: (name: string): string | null => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // Quota exceeded or storage blocked — keep in-memory state, skip persistence.
    }
  },
  removeItem: (name: string): void => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};

export const useScoreboardStore = create<ScoreboardState>()(
  persist(
    (set, get) => ({
      teams: [],
      scores: [],
      selectedDate: todayISODate(),

      addTeam: (name, members) => {
        const newTeam: Team = {
          id: generateId(),
          name: name.trim(),
          members: members.map((m) => m.trim()).filter(Boolean),
        };
        set((state) => ({ teams: [...state.teams, newTeam] }));
        return newTeam;
      },

      updateTeam: (teamId, updates) => {
        set((state) => ({
          teams: state.teams.map((team) => {
            if (team.id !== teamId) return team;
            const next = { ...team };
            if (updates.name !== undefined) {
              const trimmed = updates.name.trim();
              if (trimmed.length > 0) next.name = trimmed;
            }
            if (updates.members !== undefined) {
              next.members = updates.members.map((m) => m.trim()).filter(Boolean);
            }
            return next;
          }),
        }));
      },

      deleteTeam: (teamId) => {
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== teamId),
          scores: state.scores.filter((score) => score.teamId !== teamId),
        }));
      },

      updateScore: (teamId, date, updates) => {
        if (!isValidISODate(date)) return;
        const teamExists = get().teams.some((team) => team.id === teamId);
        if (!teamExists) return;

        const sanitized: Partial<Record<ScoreField, number>> = {};
        for (const field of SCORE_FIELDS) {
          if (updates[field] !== undefined) sanitized[field] = clampCount(updates[field]);
        }
        if (Object.keys(sanitized).length === 0) return;

        set((state) => {
          const index = state.scores.findIndex(
            (score) => score.teamId === teamId && score.date === date
          );
          if (index > -1) {
            const nextScores = [...state.scores];
            nextScores[index] = { ...nextScores[index], ...sanitized };
            return { scores: nextScores };
          }
          const newScore: Score = {
            id: generateId(),
            teamId,
            date,
            gamesWon: 0,
            gamesLost: 0,
            setsWon: 0,
            setsLost: 0,
            ...sanitized,
          };
          return { scores: [...state.scores, newScore] };
        });
      },

      setSelectedDate: (date) => {
        set({ selectedDate: toISODateLocal(date) });
      },

      replaceAll: ({ teams, scores }) => {
        set({ teams, scores });
      },
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        teams: state.teams,
        scores: state.scores,
        selectedDate: state.selectedDate,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ScoreboardState>;
        return {
          ...current,
          teams: Array.isArray(p.teams) ? p.teams : [],
          scores: Array.isArray(p.scores) ? p.scores : [],
          selectedDate: isValidISODate(p.selectedDate) ? p.selectedDate : todayISODate(),
        };
      },
    }
  )
);
