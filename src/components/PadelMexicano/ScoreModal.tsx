import React, { useEffect, useState } from 'react';
import type { Match } from '../../utils/constants';

interface ScoreModalProps {
  isOpen: boolean;
  match: Match | null;
  matchIndex: number;
  players: string[];
  selectedTeam: 'team1' | 'team2' | null;
  onClose: () => void;
  onSave: (team1Score: number, team2Score: number) => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({ isOpen, match, players, selectedTeam, onClose, onSave }) => {
  const [step, setStep] = useState<'score' | 'opponent-score'>('score');
  const [firstScore, setFirstScore] = useState<number | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('score');
      setFirstScore(null);
    }
  }, [isOpen, selectedTeam]);

  if (!isOpen || !match || !selectedTeam) return null;

  const isTeam1 = selectedTeam === 'team1';
  const teamName = (isTeam1 ? match.team1 : match.team2).map(i => players[i]).join(' & ');
  const opponentName = (isTeam1 ? match.team2 : match.team1).map(i => players[i]).join(' & ');

  const handleFirstScoreSelect = (score: number) => {
    if (score === 3) {
      // They won, ask for opponent score
      setFirstScore(3);
      setStep('opponent-score');
    } else {
      // They lost, so opponent got 3
      if (isTeam1) {
        onSave(score, 3);
      } else {
        onSave(3, score);
      }
      onClose();
    }
  };

  const handleOpponentScoreSelect = (opponentScore: number) => {
    if (isTeam1) {
      onSave(3, opponentScore);
    } else {
      onSave(opponentScore, 3);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl w-full max-w-lg p-6 mb-4 animate-in slide-in-from-bottom duration-300" 
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">Résultat du match</h3>
        <p className="text-slate-500 text-center mb-6">Premier à 3 games gagnants</p>

        {step === 'score' ? (
          <div className="space-y-4">
            <p className="text-center font-semibold text-slate-700 mb-2">
              Score de <span className="text-orange-600">{teamName}</span> ?
            </p>
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map(score => (
                <button
                  key={score}
                  onClick={() => handleFirstScoreSelect(score)}
                  className="h-20 rounded-2xl bg-slate-100 text-3xl font-bold text-slate-700 hover:bg-orange-100 hover:text-orange-600 active:scale-95 transition-all"
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center font-semibold text-slate-700 mb-2">
              Score de l'adversaire (<span className="text-slate-600">{opponentName}</span>) ?
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map(score => (
                <button
                  key={score}
                  onClick={() => handleOpponentScoreSelect(score)}
                  className="h-20 rounded-2xl bg-slate-100 text-3xl font-bold text-slate-700 hover:bg-orange-100 hover:text-orange-600 active:scale-95 transition-all"
                >
                  {score}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('score')}
              className="w-full h-12 mt-4 text-slate-500 font-medium hover:text-slate-700"
            >
              ← Retour
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full h-14 mt-6 rounded-xl bg-slate-100 text-slate-600 font-semibold active:scale-95 transition-transform"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};
