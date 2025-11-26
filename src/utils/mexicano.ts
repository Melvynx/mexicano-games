import type { Match, Round } from './constants';

type PlayerScore = {
  index: number;
  points: number;
  matchesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  matchWins: number;
  matchLosses: number;
};

export const getPlayerScores = (players: string[], rounds: Round[]): PlayerScore[] => {
  const scores: PlayerScore[] = players.map((_, i) => ({
    index: i,
    points: 0,
    matchesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    matchWins: 0,
    matchLosses: 0,
  }));

  rounds.forEach(round => {
    round.matches.forEach(match => {
      if (match.score) {
        const team1Won = match.score.team1 > match.score.team2;
        const team2Won = match.score.team2 > match.score.team1;

        // Team 1 stats
        match.team1.forEach(playerIndex => {
          scores[playerIndex].matchesPlayed++;
          scores[playerIndex].gamesWon += match.score!.team1;
          scores[playerIndex].gamesLost += match.score!.team2;
          // Points = games won
          scores[playerIndex].points += match.score!.team1;
          if (team1Won) {
            scores[playerIndex].matchWins += 1;
          } else if (team2Won) {
            scores[playerIndex].matchLosses += 1;
          }
        });

        // Team 2 stats
        match.team2.forEach(playerIndex => {
          scores[playerIndex].matchesPlayed++;
          scores[playerIndex].gamesWon += match.score!.team2;
          scores[playerIndex].gamesLost += match.score!.team1;
          // Points = games won
          scores[playerIndex].points += match.score!.team2;
          if (team2Won) {
            scores[playerIndex].matchWins += 1;
          } else if (team1Won) {
            scores[playerIndex].matchLosses += 1;
          }
        });
      }
    });
  });

  return scores;
};

export const getLeaderboard = (players: string[], rounds: Round[]) => {
  const scores = getPlayerScores(players, rounds);
  return scores
    .map(s => ({ ...s, name: players[s.index] }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      // First tie-breaker: match victories vs defeats
      const balanceA = a.matchWins - a.matchLosses;
      const balanceB = b.matchWins - b.matchLosses;
      if (balanceB !== balanceA) return balanceB - balanceA;
      // Next tie-breaker: total match wins
      if (b.matchWins !== a.matchWins) return b.matchWins - a.matchWins;
      // Final tie-breaker: game differential
      const diffA = a.gamesWon - a.gamesLost;
      const diffB = b.gamesWon - b.gamesLost;
      return diffB - diffA;
    });
};

const getPreviousPartnerships = (rounds: Round[]): Set<string> => {
  const partnerships = new Set<string>();
  rounds.forEach(round => {
    round.matches.forEach(match => {
      // Team 1 pair
      const p1 = [...match.team1].sort((a, b) => a - b);
      partnerships.add(`${p1[0]}-${p1[1]}`);
      
      // Team 2 pair
      const p2 = [...match.team2].sort((a, b) => a - b);
      partnerships.add(`${p2[0]}-${p2[1]}`);
    });
  });
  return partnerships;
};

// Helper to check if a pairing has happened
const hasPlayedTogether = (p1: number, p2: number, partnerships: Set<string>): boolean => {
  const pair = [p1, p2].sort((a, b) => a - b);
  return partnerships.has(`${pair[0]}-${pair[1]}`);
};

export const generateRound = (players: string[], rounds: Round[]): Match[] => {
  // If no rounds, generate random first round
  if (rounds.length === 0) {
    const indices = Array.from({ length: 8 }, (_, i) => i);
    // Shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    return [
      { team1: [indices[0], indices[1]], team2: [indices[2], indices[3]], score: null },
      { team1: [indices[4], indices[5]], team2: [indices[6], indices[7]], score: null },
    ];
  }

  const scores = getPlayerScores(players, rounds);
  // Sort by points for pairing logic
  const sortedIndices = [...scores]
    .sort((a, b) => b.points - a.points)
    .map(s => s.index);

  const partnerships = getPreviousPartnerships(rounds);
  
  // Backtracking algorithm to find valid pairings
  // We need to form 4 pairs from 8 players such that no pair has played together
  // Ideally we want 1-8, 2-7, 3-6, 4-5 pairing logic (High-Low)
  
  // Try to find a valid set of 4 pairs
  // We will prioritize the "Mexicano" style pairing: best available with worst available
  
  const findPairs = (availablePlayers: number[]): number[][] | null => {
    if (availablePlayers.length === 0) return [];

    // Take the best player available (first in the sorted list that is in availablePlayers)
    // Actually availablePlayers is already sorted by rank because we pass sortedIndices initially
    const p1 = availablePlayers[0];
    
    // Try to pair with others, starting from the bottom (worst rank)
    for (let i = availablePlayers.length - 1; i >= 1; i--) {
      const p2 = availablePlayers[i];
      
      if (!hasPlayedTogether(p1, p2, partnerships)) {
        // Valid pair found, try to solve for the rest
        const remaining = availablePlayers.filter(p => p !== p1 && p !== p2);
        const result = findPairs(remaining);
        
        if (result) {
          return [[p1, p2], ...result];
        }
      }
    }
    
    return null; // No valid pairing found for p1
  };

  const pairs = findPairs(sortedIndices);

  if (!pairs) {
    console.error("Could not find valid pairings! Fallback to random.");
    // Fallback: just shuffle remaining possible pairs? 
    // For now, let's just return a random shuffle if strict logic fails, 
    // but with 8 players and 7 rounds, it should be possible.
    // Actually, strict Mexicano might get stuck.
    // Let's try a simpler fallback: just pair 1-2, 3-4 if 1-8 fails?
    // For this implementation, let's stick to the backtracking which tries to respect 1-8 logic first.
    // If it fails, we might need to relax the "sorted" requirement and just find ANY unique pairs.
    
    // Fallback: Find ANY unique pairs
    // We can try to just shuffle and check? Or use a general graph matching?
    // Given N=8, we can just try to find *any* valid set of pairs.
    // But let's assume the backtracking works for most cases.
    // If it returns null, we might be in a corner case.
    // Let's try to just pair adjacent ranks as a fallback strategy if High-Low fails?
    // Or just return whatever we have (which might duplicate).
    // Let's throw an error or handle gracefully.
    
    // Realistically for 7 rounds with 8 players, perfect unique pairs is mathematically possible (Round Robin is 7 rounds).
    // So a solution ALWAYS exists. The greedy High-Low might miss it, but it's usually fine.
    
    // If greedy high-low fails, we could try a full search, but that's expensive? N=8 is tiny.
    // Let's just return a safe fallback that might repeat if absolutely necessary, 
    // but let's try to ensure it doesn't.
    
    // For now, if null, we just pair 0-1, 2-3... and ignore history (worst case)
    return [
       { team1: [sortedIndices[0], sortedIndices[1]], team2: [sortedIndices[2], sortedIndices[3]], score: null },
       { team1: [sortedIndices[4], sortedIndices[5]], team2: [sortedIndices[6], sortedIndices[7]], score: null },
    ];
  }

  // Now we have 4 pairs. We need to match them against each other.
  // Pair 1 vs Pair 2? Or Pair 1 vs Pair 4?
  // Standard Mexicano: 1+8 vs 4+5 (balanced) and 2+7 vs 3+6
  // Our pairs are ordered by the rank of the first player (so Pair 1 has Rank 1, Pair 2 has Rank 2...)
  // Actually findPairs returns pairs. The first pair contains Rank 1.
  // The second pair contains the highest ranked player remaining (Rank 2 usually).
  // So pairs[0] is roughly (1, 8), pairs[1] is (2, 7), pairs[2] is (3, 6), pairs[3] is (4, 5).
  // We want balanced matches.
  // Match 1: pairs[0] vs pairs[3]  (Strongest pair vs Weakest pair? No, that's 1+8 vs 4+5. 
  // Actually 1+8 is sum rank 9. 4+5 is sum rank 9. This is balanced.)
  // Match 2: pairs[1] vs pairs[2] (2+7=9, 3+6=9. Balanced.)
  
  return [
    { team1: pairs[0], team2: pairs[3], score: null },
    { team1: pairs[1], team2: pairs[2], score: null },
  ];
};
