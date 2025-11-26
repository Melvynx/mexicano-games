import React, { useEffect, useState } from 'react';

interface NameModalProps {
  isOpen: boolean;
  initialName: string;
  playerIndex: number;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const NameModal: React.FC<NameModalProps> = ({ isOpen, initialName, playerIndex, onClose, onSave }) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl w-full max-w-lg p-6 mb-4 animate-in slide-in-from-bottom duration-300" 
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-slate-800 mb-4">Joueur {playerIndex + 1}</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="Nom du joueur"
          className="w-full h-14 px-4 rounded-xl border-2 border-slate-200 text-lg focus:border-orange-500 focus:outline-none mb-4"
          autoFocus
        />
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="h-14 rounded-xl bg-slate-100 text-slate-600 font-semibold active:scale-95 transition-transform"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="h-14 rounded-xl bg-orange-500 text-white font-semibold active:scale-95 transition-transform"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};
