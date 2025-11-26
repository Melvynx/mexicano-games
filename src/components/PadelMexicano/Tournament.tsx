import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { Round } from '../../utils/constants';
import { TOTAL_ROUNDS } from '../../utils/constants';
import { getLeaderboard } from '../../utils/mexicano';
import { ScoreModal } from './ScoreModal';

interface TournamentProps {
  players: string[];
  rounds: Round[];
  onScoreUpdate: (roundIndex: number, matchIndex: number, t1: number, t2: number) => void;
  onNextRound: () => void;
  onShowLeaderboard: () => void;
  onReset: () => void;
  onAbout: () => void;
}

const DEFAULT_TIMER_SECONDS = 14 * 60;

export const Tournament: React.FC<TournamentProps> = ({ 
  players, 
  rounds, 
  onScoreUpdate, 
  onNextRound, 
  onShowLeaderboard,
  onReset,
  onAbout
}) => {
  const [activeMatch, setActiveMatch] = useState<{ roundIndex: number, matchIndex: number, team: 'team1' | 'team2' } | null>(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(DEFAULT_TIMER_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const currentRoundIndex = rounds.length - 1;
  const currentRound = rounds[currentRoundIndex];
  const isRoundComplete = currentRound.matches.every(m => m.score !== null);
  const isTournamentComplete = isRoundComplete && rounds.length >= TOTAL_ROUNDS;

  const leaderboard = getLeaderboard(players, rounds);

  useEffect(() => {
    if (!isTimerRunning) {
      return;
    }

    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleToggleTimer = () => {
    if (timerSeconds === 0) {
      setTimerSeconds(DEFAULT_TIMER_SECONDS);
      setIsTimerRunning(true);
      return;
    }
    setIsTimerRunning(prev => !prev);
  };

  const handleTimerReset = () => {
    setTimerSeconds(DEFAULT_TIMER_SECONDS);
    setIsTimerRunning(false);
  };

  const handleNextRoundClick = () => {
    handleTimerReset();
    onNextRound();
  };

  const handleResetTournament = () => {
    handleTimerReset();
    onReset();
  };

  const timerMinutes = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const timerRemainingSeconds = String(timerSeconds % 60).padStart(2, '0');
  const timerColorClass = timerSeconds === 0
    ? 'text-red-600 animate-pulse'
    : timerSeconds <= 120
      ? 'text-orange-500'
      : 'text-emerald-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 z-40">
        <div className="max-w-4xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Padel Mexicano</h1>
            <p className="text-sm text-slate-500 font-medium">Round {rounds.length}/{TOTAL_ROUNDS}</p>
          </div>
          <div className="flex items-center gap-3 justify-between md:justify-center">
            <div className={`px-5 py-2 rounded-2xl border border-slate-200 bg-slate-50 shadow-inner font-mono text-3xl font-black tracking-tight ${timerColorClass}`}>
              {timerMinutes}:{timerRemainingSeconds}
            </div>
            <button
              onClick={handleToggleTimer}
              className="h-12 w-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 hover:bg-slate-200 transition-all active:scale-95"
              aria-label={isTimerRunning ? 'Mettre le timer en pause' : 'Lancer le timer'}
            >
              <span className="text-xl">{isTimerRunning ? '⏸️' : '▶️'}</span>
            </button>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={onAbout}
              className="h-12 w-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-all active:scale-95"
              title="Règles"
            >
              <span className="font-bold text-lg">?</span>
            </button>
            <button
              onClick={handleResetTournament}
              className="h-12 w-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
              title="Recommencer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={onShowLeaderboard}
              className="h-12 px-6 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-all active:scale-95"
            >
              🏆 Classement
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-200 w-full">
        <div
          className="h-full bg-orange-500 transition-all duration-500 ease-out"
          style={{ width: `${(rounds.length / TOTAL_ROUNDS) * 100}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Collapsible Leaderboard */}
        {rounds.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 overflow-hidden border border-slate-100">
            <button 
              onClick={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
              className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white"
            >
              <h3 className="font-bold text-lg">Classement Général</h3>
              {isLeaderboardOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {isLeaderboardOpen && (
              <div className="p-4 bg-slate-50">
                <div className="space-y-2">
                  {leaderboard.map((player, idx) => (
                    <div key={player.index} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0 ? 'bg-amber-100 text-amber-700' :
                          idx === 1 ? 'bg-slate-200 text-slate-600' :
                          idx === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-medium text-slate-700">{player.name}</span>
                      </div>
                      <span className="font-bold text-orange-600">{player.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {!isLeaderboardOpen && (
               <div className="px-5 py-3 bg-orange-50/50 flex flex-wrap gap-2">
                 {leaderboard.slice(0, 4).map((player, idx) => (
                   <span key={player.index} className="text-sm text-slate-600 font-medium flex items-center gap-1">
                     <span className="text-orange-500 font-bold">#{idx + 1}</span> {player.name}
                   </span>
                 ))}
                 <span className="text-sm text-slate-400">...</span>
               </div>
            )}
          </div>
        )}

        {/* Rounds List */}
        <div className="space-y-8">
          {rounds.map((round, rIndex) => (
            <div key={rIndex} className={`transition-all duration-500 ${rIndex !== currentRoundIndex ? 'opacity-60 hover:opacity-100' : ''}`}>
              <div className="flex items-center gap-4 mb-4 px-2">
                <h2 className="text-2xl font-bold text-slate-800">Round {rIndex + 1}</h2>
                <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide">
                  {rIndex === 0 ? 'Aléatoire' : 'Par Classement'}
                </span>
              </div>
              
              <div className="flex flex-col gap-4">
                {round.matches.map((match, mIndex) => {
                  const team1Names = match.team1.map(i => players[i]).join(' & ');
                  const team2Names = match.team2.map(i => players[i]).join(' & ');
                  const score = match.score;
                  const isWinner1 = score && score.team1 > score.team2;
                  const isWinner2 = score && score.team2 > score.team1;

                  return (
                    <div
                      key={mIndex}
                      className={`w-full rounded-3xl border-2 overflow-hidden transition-all duration-200 ${
                        score
                          ? 'border-orange-200 bg-orange-50/30'
                          : 'border-white bg-white shadow-lg shadow-slate-200/50'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row h-full">
                        {/* Team 1 Button */}
                        <button
                          onClick={() => setActiveMatch({ roundIndex: rIndex, matchIndex: mIndex, team: 'team1' })}
                          className={`flex-1 p-5 text-left transition-colors hover:bg-orange-50 active:bg-orange-100 flex items-center justify-between group border-b md:border-b-0 md:border-r border-slate-100 ${
                            isWinner1 ? 'bg-orange-100/50' : ''
                          }`}
                        >
                          <div>
                            <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">Équipe 1</p>
                            <p className={`font-bold text-lg leading-tight ${isWinner1 ? 'text-orange-600' : 'text-slate-700'}`}>
                              {team1Names}
                            </p>
                          </div>
                          {score && (
                            <span className={`text-3xl font-black ${isWinner1 ? 'text-orange-600' : 'text-slate-300'}`}>
                              {score.team1}
                            </span>
                          )}
                        </button>

                        {/* VS Separator (Visual only) */}
                        <div className="h-px md:h-auto md:w-px bg-slate-100 relative">
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-200 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-400 z-10">
                             VS
                           </div>
                        </div>

                        {/* Team 2 Button */}
                        <button
                          onClick={() => setActiveMatch({ roundIndex: rIndex, matchIndex: mIndex, team: 'team2' })}
                          className={`flex-1 p-5 text-right md:text-left transition-colors hover:bg-orange-50 active:bg-orange-100 flex items-center justify-between flex-row-reverse md:flex-row group ${
                            isWinner2 ? 'bg-orange-100/50' : ''
                          }`}
                        >
                           {score && (
                            <span className={`text-3xl font-black ${isWinner2 ? 'text-orange-600' : 'text-slate-300'}`}>
                              {score.team2}
                            </span>
                          )}
                          <div>
                            <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">Équipe 2</p>
                            <p className={`font-bold text-lg leading-tight ${isWinner2 ? 'text-orange-600' : 'text-slate-700'}`}>
                              {team2Names}
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-8 pb-4">
          {isRoundComplete && !isTournamentComplete && (
            <button
              onClick={handleNextRoundClick}
              className="w-full h-20 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xl shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-3"
            >
              <span>Générer Round {rounds.length + 1}</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}

          {isTournamentComplete && (
            <button
              onClick={onShowLeaderboard}
              className="w-full h-20 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold text-xl shadow-lg shadow-amber-200 hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all animate-pulse"
            >
              🏆 Voir le Classement Final
            </button>
          )}
        </div>
      </div>

      {activeMatch && (
        <ScoreModal
          isOpen={true}
          match={rounds[activeMatch.roundIndex].matches[activeMatch.matchIndex]}
          matchIndex={activeMatch.matchIndex}
          players={players}
          selectedTeam={activeMatch.team}
          onClose={() => setActiveMatch(null)}
          onSave={(t1, t2) => onScoreUpdate(activeMatch.roundIndex, activeMatch.matchIndex, t1, t2)}
        />
      )}
    </div>
  );
};
