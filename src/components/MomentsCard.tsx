'use client';

import React from 'react';
import { Moments } from '@/types/distributions';
import { Sigma } from 'lucide-react';

interface MomentsCardProps {
  moments: Moments;
}

export const MomentsCard: React.FC<MomentsCardProps> = ({ moments }) => {
  const formatVal = (v: number | null | undefined): string => {
    if (v === null || v === undefined) return 'No definida';
    if (!isFinite(v)) return '∞';
    return Number(v.toFixed(4)).toString();
  };

  const statItems = [
    { label: 'Media (Esperanza)', symbol: 'μ / E(X)', val: formatVal(moments.mean) },
    { label: 'Varianza', symbol: 'σ² / Var(X)', val: formatVal(moments.variance) },
    { label: 'Desv. Estándar', symbol: 'σ', val: formatVal(moments.std) },
    { label: 'Asimetría (Skewness)', symbol: 'γ₁', val: formatVal(moments.skewness) },
    { label: 'Exceso de Curtosis', symbol: 'γ₂', val: formatVal(moments.kurtosis) },
  ];

  return (
    <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
      <div className="flex items-center space-x-2">
        <Sigma className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-white">Estadísticos Teóricos (Momentos)</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {statItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-neutral-950/50 p-2.5 rounded-xl border border-neutral-800/60 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
              <span className="truncate">{item.label}</span>
              <span className="font-mono text-indigo-400 font-bold ml-1">{item.symbol}</span>
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-white">
              {item.val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
