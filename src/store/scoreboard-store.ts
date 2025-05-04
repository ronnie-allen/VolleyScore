"use client";

import { create } from 'zustand';
import type { Team, Score, DailyScore } from '@/types';
import { format } from 'date-fns';

// In-memory storage for demonstration purposes
// In a real app, this would interact with a database or localStorage.
let teamsData: Team[] = [
    { id: '1', name: 'Spike Squad', members: ['Alice', 'Bob'] },
    { id: '2', name: 'Block Party', members: ['Charlie', 'Diana'] },
];
let scoresData: Score[] = [
    { id: 's1', teamId: '1', date: format(new Date(), 'yyyy-MM-dd'), gamesWon: 1, gamesLost: 0, setsWon: 3, setsLost: 1 },
    { id: 's2', teamId: '2', date: format(new Date(), 'yyyy-MM-dd'), gamesWon: 0, gamesLost: 1, setsWon: 1, setsLost: 3 },
    { id: 's3', teamId: '1', date: '2023-10-25', gamesWon: 2, gamesLost: 0, setsWon: 6, setsLost: 0 },
];
let teamIdCounter = teamsData.length + 1;
let scoreIdCounter = scoresData.length + 1;


interface ScoreboardState {
  teams: Team[];
  scores: Score[];
  selectedDate: string; // YYYY-MM-DD format
  addTeam: (name: string, members: string[]) => Team;
  updateScore: (teamId: string, date: string, updates: Partial<Omit<Score, 'id' | 'teamId' | 'date'>>) => void;
  getScoresForDate: (date: string) => DailyScore[];
  setSelectedDate: (date: Date) => void;
  deleteTeam: (teamId: string) => void;
}

export const useScoreboardStore = create<ScoreboardState>((set, get) => ({
  teams: teamsData,
  scores: scoresData,
  selectedDate: format(new Date(), 'yyyy-MM-dd'),

  addTeam: (name, members) => {
    const newTeam: Team = {
      id: String(teamIdCounter++),
      name,
      members,
    };
    teamsData = [...teamsData, newTeam];
    set({ teams: teamsData });
    return newTeam;
  },

  updateScore: (teamId, date, updates) => {
     const existingScoreIndex = scoresData.findIndex(score => score.teamId === teamId && score.date === date);
     let newScores = [...scoresData];

     if (existingScoreIndex > -1) {
       // Update existing score
       const updatedScore = { ...newScores[existingScoreIndex], ...updates };
       newScores[existingScoreIndex] = updatedScore;
     } else {
       // Add new score entry
       const newScore: Score = {
         id: String(scoreIdCounter++),
         teamId,
         date,
         gamesWon: 0,
         gamesLost: 0,
         setsWon: 0,
         setsLost: 0,
         ...updates,
       };
       newScores.push(newScore);
     }
     scoresData = newScores;
     set({ scores: scoresData });
   },

  getScoresForDate: (date) => {
    const teams = get().teams;
    const scores = get().scores;
    const scoresForDate = scores.filter(score => score.date === date);

    return teams.map(team => {
      const teamScore = scoresForDate.find(score => score.teamId === team.id);
      return {
        ...team,
        id: team.id, // Ensure team ID is used
        scoreId: teamScore?.id ?? `temp-${team.id}-${date}`, // Provide a score ID or a temporary one
        date: date,
        gamesWon: teamScore?.gamesWon ?? 0,
        gamesLost: teamScore?.gamesLost ?? 0,
        setsWon: teamScore?.setsWon ?? 0,
        setsLost: teamScore?.setsLost ?? 0,
      };
    });
  },

  setSelectedDate: (date) => {
    set({ selectedDate: format(date, 'yyyy-MM-dd') });
  },

  deleteTeam: (teamId) => {
    teamsData = teamsData.filter(team => team.id !== teamId);
    // Also remove associated scores
    scoresData = scoresData.filter(score => score.teamId !== teamId);
    set({ teams: teamsData, scores: scoresData });
  }
}));
