import { useTournament } from '../../hooks/useTournament';
import { About } from './About';
import { Leaderboard } from './Leaderboard';
import { PlayerSetup } from './PlayerSetup';
import { Tournament } from './Tournament';

export default function PadelMexicano() {
  const {
    players,
    rounds,
    screen,
    setScreen,
    addPlayer,
    startTournament,
    updateScore,
    nextRound,
    resetTournament,
  } = useTournament();

  if (screen === 'names') {
    return (
      <PlayerSetup
        players={players}
        onAddPlayer={addPlayer}
        onStart={startTournament}
        onAbout={() => setScreen('about')}
      />
    );
  }

  if (screen === 'tournament') {
    return (
      <Tournament
        players={players}
        rounds={rounds}
        onScoreUpdate={updateScore}
        onNextRound={nextRound}
        onShowLeaderboard={() => setScreen('leaderboard')}
        onReset={resetTournament}
        onAbout={() => setScreen('about')}
      />
    );
  }

  if (screen === 'leaderboard') {
    return (
      <Leaderboard
        players={players}
        rounds={rounds}
        onBack={() => setScreen('tournament')}
        onReset={resetTournament}
      />
    );
  }

  if (screen === 'about') {
    return <About onBack={() => setScreen(rounds.length > 0 ? 'tournament' : 'names')} />;
  }

  return null;
}
