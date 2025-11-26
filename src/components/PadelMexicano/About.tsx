import React from 'react';

interface AboutProps {
  onBack: () => void;
}

export const About: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 pb-20">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 h-12 px-4 rounded-xl bg-white text-slate-600 font-semibold hover:bg-slate-50 transition-all active:scale-95 shadow-sm border border-slate-200"
        >
          ← Retour
        </button>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Règles du Jeu</h1>
            <p className="text-slate-500">Padel Mexicano</p>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold text-orange-600 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sm">1</span>
                Format du Tournoi
              </h2>
              <ul className="space-y-2 text-slate-600 ml-10 list-disc">
                <li><strong className="text-slate-800">8 joueurs</strong> s'affrontent sur <strong className="text-slate-800">7 rounds</strong>.</li>
                <li>Chaque round comporte 2 matchs (4 joueurs par match).</li>
                <li>L'objectif est de marquer le plus de points possible individuellement.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-amber-600 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-sm">2</span>
                Déroulement des Matchs
              </h2>
              <ul className="space-y-2 text-slate-600 ml-10 list-disc">
                <li>Les matchs se jouent au <strong className="text-slate-800">premier à 3 jeux gagnants</strong>.</li>
                <li>Scores possibles : 3-0, 3-1 ou 3-2.</li>
                <li>Chaque jeu gagné rapporte <strong className="text-slate-800">1 point</strong> à chaque joueur de l'équipe.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-600 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-sm">3</span>
                Règles du Jeu
              </h2>
              <ul className="space-y-2 text-slate-600 ml-10 list-disc">
                <li><strong className="text-slate-800">Tie-break à 2-2 :</strong> Si le score est de 2 jeux partout, on joue un tie-break à <strong className="text-slate-800">7 points</strong> avec 2 points de différence (maximum 10 points).</li>
                <li><strong className="text-slate-800">Juice (Deuce) :</strong> En cas d'égalité à 40-40, on joue une <strong className="text-slate-800">golden ball</strong> (point décisif).</li>
                <li><strong className="text-slate-800">Golden Ball :</strong> L'équipe qui reçoit peut choisir sur quel joueur le service sera effectué.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm">4</span>
                Génération des Équipes
              </h2>
              <div className="space-y-3 text-slate-600 ml-10">
                <p><strong className="text-slate-800">Round 1 :</strong> Tirage au sort intégral.</p>
                <p><strong className="text-slate-800">Rounds suivants :</strong> Basés sur le classement actuel.</p>
                <ul className="list-disc ml-5 space-y-1 text-sm">
                  <li>1er avec 8ème</li>
                  <li>2ème avec 7ème</li>
                  <li>3ème avec 6ème</li>
                  <li>4ème avec 5ème</li>
                </ul>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mt-2">
                  <p className="text-orange-800 text-sm font-medium">
                    ⚠️ Règle d'or : Un joueur ne joue jamais deux fois avec le même partenaire.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
