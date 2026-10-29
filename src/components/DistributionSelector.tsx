'use client';

import React from 'react';
import { DistributionType } from '@/types/distributions';
import { DISTRIBUTION_METAS } from '@/lib/distributions';
import { Activity, BarChart2, Layers } from 'lucide-react';

interface DistributionSelectorProps {
  selected: DistributionType;
  onSelect: (type: DistributionType) => void;
  categoryFilter: 'all' | 'continuous' | 'discrete';
  setCategoryFilter: (filter: 'all' | 'continuous' | 'discrete') => void;
}

export const DistributionSelector: React.FC<DistributionSelectorProps> = ({
  selected,
  onSelect,
  categoryFilter,
  setCategoryFilter,
}) => {
  const filteredMetas = DISTRIBUTION_METAS.filter((meta) => {
    if (categoryFilter === 'all') return true;
    return meta.category === categoryFilter;
  });

  return (
    <div className="space-y-3">
      {/* Category filter pills */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-300 flex items-center space-x-1.5">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Distribución</span>
        </h2>
        <div className="flex items-center bg-neutral-900/90 p-0.5 rounded-lg border border-neutral-800 text-[11px]">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
              categoryFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setCategoryFilter('continuous')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center space-x-1 ${
              categoryFilter === 'continuous'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>Continuas</span>
          </button>
          <button
            onClick={() => setCategoryFilter('discrete')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center space-x-1 ${
              categoryFilter === 'discrete'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3 h-3" />
            <span>Discretas</span>
          </button>
        </div>
      </div>

      {/* Distribution button pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {filteredMetas.map((meta) => {
          const isCurrent = selected === meta.id;
          return (
            <button
              key={meta.id}
              onClick={() => onSelect(meta.id)}
              className={`group relative flex flex-col items-start p-2.5 rounded-xl border text-left transition-all duration-200 ${
                isCurrent
                  ? 'bg-gradient-to-b from-indigo-950/80 to-neutral-900/90 border-indigo-500/80 text-white shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/30'
                  : 'bg-neutral-900/70 border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    meta.category === 'continuous'
                      ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/30'
                      : 'bg-amber-950/60 text-amber-400 border border-amber-800/30'
                  }`}
                >
                  {meta.category === 'continuous' ? 'Cont.' : 'Disc.'}
                </span>
                {isCurrent && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400 animate-pulse" />
                )}
              </div>
              <span className="font-semibold text-xs sm:text-sm tracking-tight group-hover:text-white transition-colors">
                {meta.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
