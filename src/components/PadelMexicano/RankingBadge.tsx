import React from 'react';

interface RankingBadgeProps {
  rank: number;
  className?: string;
}

export const RankingBadge: React.FC<RankingBadgeProps> = ({ rank, className = '' }) => {
  const getStyle = () => {
    switch (rank) {
      case 1: return 'bg-amber-100 text-amber-700 border-amber-200';
      case 2: return 'bg-slate-200 text-slate-600 border-slate-300';
      case 3: return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${getStyle()} ${className}`}>
      {rank}
    </span>
  );
};
