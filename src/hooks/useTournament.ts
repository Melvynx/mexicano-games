import type { Round } from '../utils/constants';
import { STORAGE_KEY, TOTAL_PLAYERS, TOTAL_ROUNDS } from '../utils/constants';
import { generateRound } from '../utils/mexicano';
import { useLocalStorage } from './useLocalStorage';

type Screen = 'names' | 'tournament' | 'leaderboard' | 'about';

export const useTournament = () => {
  const [players, setPlayers] = useLocalStorage<string[]>(`${STORAGE_KEY}-players`, Array(TOTAL_PLAYERS).fill(''));
  const [rounds, setRounds] = useLocalStorage<Round[]>(`${STORAGE_KEY}-rounds`, []);
  const [screen, setScreen] = useLocalStorage<Screen>(`${STORAGE_KEY}-screen`, 'names');

  // Hydration fix for Next.js/SSR if needed, but fine for Vite usually.
  // Ensuring we have loaded from local storage before rendering might be good if we see flashes.
  // But useLocalStorage handles initial read.

  const addPlayer = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const startTournament = () => {
    if (players.every(p => p.trim())) {
      const firstRoundMatches = generateRound(players, []);
      setRounds([{ matches: firstRoundMatches, rankings: null }]);
      setScreen('tournament');
    }
  };

  const updateScore = (roundIndex: number, matchIndex: number, team1Score: number, team2Score: number) => {
    const newRounds = [...rounds];
    newRounds[roundIndex].matches[matchIndex].score = { team1: team1Score, team2: team2Score };
    setRounds(newRounds);
  };

  const nextRound = () => {
    if (rounds.length >= TOTAL_ROUNDS) return;
    
    // Generate next round
    const nextMatches = generateRound(players, rounds);
    
    // Calculate current rankings to store with the round (snapshot)
    // Actually generateRound uses current stats.
    // We can store the rankings used to generate this round for display purposes if we want.
    // For now, let's just store the matches.
    
    setRounds([...rounds, { matches: nextMatches, rankings: null }]);
  };

  const resetTournament = () => {
    if (window.confirm('Êtes-vous sûr de vouloir tout effacer ?')) {
      setPlayers(Array(TOTAL_PLAYERS).fill(''));
      setRounds([]);
      setScreen('names');
      localStorage.removeItem(`${STORAGE_KEY}-players`);
      localStorage.removeItem(`${STORAGE_KEY}-rounds`);
      localStorage.removeItem(`${STORAGE_KEY}-screen`);
    }
  };

  const isCurrentRoundComplete = () => {
    if (rounds.length === 0) return false;
    const currentRound = rounds[rounds.length - 1];
    return currentRound.matches.every(m => m.score !== null);
  };

  return {
    players,
    rounds,
    screen,
    setScreen,
    addPlayer,
    startTournament,
    updateScore,
    nextRound,
    resetTournament,
    isCurrentRoundComplete,
  };
};
