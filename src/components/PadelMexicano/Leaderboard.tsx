import React from 'react';
import type { Round } from '../../utils/constants';
import { TOTAL_ROUNDS } from '../../utils/constants';
import { getLeaderboard } from '../../utils/mexicano';

interface LeaderboardProps {
  players: string[];
  rounds: Round[];
  onBack: () => void;
  onReset: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ players, rounds, onBack, onReset }) => {
  const leaderboard = getLeaderboard(players, rounds);
  const maxPoints = leaderboard[0]?.points || 1;
  const totalMatches = rounds.reduce((acc, r) => acc + r.matches.filter(m => m.score).length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="h-12 px-4 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-all active:scale-95"
          >
            ← Retour
          </button>
          <h1 className="text-xl font-bold text-slate-800">Classement</h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        {/* Podium for top 3 */}
        <div className="flex items-end justify-center gap-4 mb-10 h-56 pt-16">
          {/* 2nd place */}
          {leaderboard[1] && (
            <div className="flex flex-col items-center w-1/3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center mb-2 shadow-lg ring-4 ring-white">
                <span className="text-3xl">🥈</span>
              </div>
              <p className="font-bold text-slate-700 text-sm text-center truncate w-full px-2">{leaderboard[1].name}</p>
              <p className="text-slate-500 text-xs font-medium mb-1">{leaderboard[1].points} pts • V {leaderboard[1].matchWins} / D {leaderboard[1].matchLosses}</p>
              <div className="w-full h-24 bg-gradient-to-t from-slate-300 to-slate-200 rounded-t-2xl opacity-80" />
            </div>
          )}
          {/* 1st place */}
          {leaderboard[0] && (
            <div className="flex flex-col items-center w-1/3 -mt-8 z-10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center mb-2 shadow-xl shadow-amber-200 ring-4 ring-white">
                <span className="text-4xl">🏆</span>
              </div>
              <p className="font-bold text-slate-800 text-center truncate w-full px-2">{leaderboard[0].name}</p>
              <p className="text-amber-600 font-bold mb-1">{leaderboard[0].points} pts • V {leaderboard[0].matchWins} / D {leaderboard[0].matchLosses}</p>
              <div className="w-full h-32 bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-2xl shadow-lg shadow-amber-100" />
            </div>
          )}
          {/* 3rd place */}
          {leaderboard[2] && (
            <div className="flex flex-col items-center w-1/3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center mb-2 shadow-lg ring-4 ring-white">
                <span className="text-3xl">🥉</span>
              </div>
              <p className="font-bold text-slate-700 text-sm text-center truncate w-full px-2">{leaderboard[2].name}</p>
              <p className="text-slate-500 text-xs font-medium mb-1">{leaderboard[2].points} pts • V {leaderboard[2].matchWins} / D {leaderboard[2].matchLosses}</p>
              <div className="w-full h-16 bg-gradient-to-t from-orange-300 to-orange-200 rounded-t-2xl opacity-80" />
            </div>
          )}
        </div>

        {/* Full leaderboard */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden mb-8">
          {leaderboard.map((player, index) => (
            <div
              key={player.index}
              className={`flex items-center gap-4 p-5 ${
                index !== leaderboard.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index === 0 ? 'bg-amber-100 text-amber-700' :
                index === 1 ? 'bg-slate-200 text-slate-600' :
                index === 2 ? 'bg-orange-100 text-orange-700' :
                'bg-slate-100 text-slate-500'
              }`}>
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1 gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate">{player.name}</p>
                    <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
                      <span className="text-emerald-600">V {player.matchWins}</span>
                      <span className="mx-1 text-slate-400">/</span>
                      <span className="text-rose-500">D {player.matchLosses}</span>
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 whitespace-nowrap">{player.matchesPlayed} matchs</p>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${maxPoints > 0 ? (player.points / maxPoints) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="text-right min-w-[3.5rem]">
                <span className="text-xl font-bold text-orange-600">{player.points}</span>
                <span className="text-xs text-slate-400 block -mt-1">pts</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50">
            <p className="text-slate-500 text-sm font-medium mb-1">Rounds joués</p>
            <p className="text-3xl font-bold text-slate-800">{rounds.length}<span className="text-slate-300 text-xl">/{TOTAL_ROUNDS}</span></p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50">
            <p className="text-slate-500 text-sm font-medium mb-1">Matchs joués</p>
            <p className="text-3xl font-bold text-slate-800">{totalMatches}</p>
          </div>
        </div>

        {/* Reset button */}
        <button
          onClick={onReset}
          className="w-full h-16 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all active:scale-98"
        >
          Nouveau tournoi
        </button>
      </div>
    </div>
  );
};
