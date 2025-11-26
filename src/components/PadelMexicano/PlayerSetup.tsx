import { faker } from '@faker-js/faker';
import React, { useState } from 'react';
import { NameModal } from './NameModal';

interface PlayerSetupProps {
  players: string[];
  onAddPlayer: (index: number, name: string) => void;
  onStart: () => void;
  onAbout: () => void;
}

const cityNameRegex = /^[\p{L}]+$/u;

const generateSingleWordCity = () => {
  let city = '';
  // Retry until faker returns a single-word city (avoids spaces or symbols).
  while (!city || !cityNameRegex.test(city)) {
    city = faker.location.city();
  }
  return city;
};

export const PlayerSetup: React.FC<PlayerSetupProps> = ({ players, onAddPlayer, onStart, onAbout }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const isReady = players.every(p => p.trim());
  const handleRandomNames = () => {
    players.forEach((name, index) => {
      if (!name.trim()) {
        onAddPlayer(index, generateSingleWordCity());
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 pt-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-orange-500 mb-6 shadow-lg shadow-orange-200 rotate-3 hover:rotate-6 transition-transform">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-2">Padel Mexicano</h1>
          <p className="text-slate-500 text-lg mb-4">8 joueurs • Équipes dynamiques • Premier à 3 games</p>
          <button
            onClick={onAbout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-500 text-sm font-medium shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">?</span>
            Voir les règles
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm">1</span>
            Inscription des joueurs
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {players.map((name, index) => (
              <button
                key={index}
                onClick={() => setEditingIndex(index)}
                className={`h-20 rounded-2xl border-2 border-dashed transition-all text-left px-4 flex items-center gap-3 active:scale-98 ${
                  name
                    ? 'border-orange-200 bg-orange-50 hover:border-orange-300'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                  name 
                    ? 'bg-orange-500 text-white border-orange-500' 
                    : 'bg-slate-200 text-slate-500 border-slate-300'
                }`}>
                  {index + 1}
                </span>
                <span className={`text-lg truncate ${name ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
                  {name || 'Ajouter...'}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleRandomNames}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 active:scale-95 transition-all"
            >
              Random player name
              <span role="img" aria-hidden="true">🎲</span>
            </button>
          </div>
        </div>

        <button
          onClick={onStart}
          disabled={!isReady}
          className={`w-full h-20 rounded-2xl font-bold text-xl transition-all shadow-lg ${
            isReady
              ? 'bg-orange-500 text-white shadow-orange-200 hover:bg-orange-600 active:scale-98 hover:shadow-xl'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-transparent'
          }`}
        >
          Lancer le Tournoi →
        </button>
      </div>

      <NameModal
        isOpen={editingIndex !== null}
        initialName={editingIndex !== null ? players[editingIndex] : ''}
        playerIndex={editingIndex !== null ? editingIndex : 0}
        onClose={() => setEditingIndex(null)}
        onSave={(name) => editingIndex !== null && onAddPlayer(editingIndex, name)}
      />
    </div>
  );
};
