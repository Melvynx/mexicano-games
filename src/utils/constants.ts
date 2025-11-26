export const TOTAL_ROUNDS = 7;
export const TOTAL_PLAYERS = 8;
export const STORAGE_KEY = 'padel-mexicano-storage-v1';

export type Player = {
  id: string;
  name: string;
  index: number;
};

export type MatchScore = {
  team1: number;
  team2: number;
};

export type Match = {
  team1: number[]; // Indices of players
  team2: number[]; // Indices of players
  score: MatchScore | null;
};

export type Round = {
  matches: Match[];
  rankings: number[] | null; // Indices of players sorted by rank at start of round
};
