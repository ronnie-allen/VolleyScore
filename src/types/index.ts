export interface Team {
  id: string;
  name: string;
  members: string[]; // Array of member names
}

export interface Score {
  id: string;
  teamId: string;
  date: string; // Format: YYYY-MM-DD
  gamesWon: number;
  gamesLost: number;
  setsWon: number; // Or points, depending on tracking detail
  setsLost: number;
}

// Represents the combined state for a team's score on a specific day
export interface DailyScore extends Team, Score {
    // Inherits all properties from Team and Score
}
