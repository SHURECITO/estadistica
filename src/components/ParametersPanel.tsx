'use client';

import React from 'react';
import { DistributionType } from '@/types/distributions';
import { DISTRIBUTION_METAS } from '@/lib/distributions';
import { Sliders, RotateCcw, Check } from 'lucide-react';

interface ParametersPanelProps {
  type: DistributionType;
  params: Record<string, number>;
  onChangeParam: (key: string, value: number) => void;
  onResetParams: () => void;
  onSetStandardNormal?: () => void;
}

export const ParametersPanel: React.FC<ParametersPanelProps> = ({
  type,
  params,
  onChangeParam,
  onResetParams,
  onSetStandardNormal,
}) => {
  const meta = DISTRIBUTION_METAS.find((m) => m.id === type);
  if (!meta) return null;

  const isStandardNormalActive =
    type === 'normal' && params.mean === 0 && params.std === 1;

  return (
    <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Parámetros</h3>
        </div>
        <div className="flex items-center space-x-2">
          {type === 'normal' && onSetStandardNormal && (
            <button
              onClick={onSetStandardNormal}
              className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium flex items-center space-x-1 transition-all ${
                isStandardNormalActive
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white hover:border-neutral-600'
              }`}
            >
              {isStandardNormalActive && <Check className="w-3 h-3 text-indigo-400" />}
              <span>Estándar Z (μ=0, σ=1)</span>
            </button>
          )}
          <button
            onClick={onResetParams}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            title="Restablecer valores por defecto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(meta.parameterLabels).map(([key, config]) => {
          const val = params[key] ?? config.default;
          return (
            <div key={key} className="space-y-1.5 bg-neutral-950/40 p-3 rounded-xl border border-neutral-800/60">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-300 flex items-center space-x-1.5">
                  <span className="text-indigo-400 font-mono font-bold">{config.symbol}</span>
                  <span>{config.label}</span>
                </span>
                <input
                  type="number"
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  value={val}
                  onChange={(e) => {
                    const parsed = parseFloat(e.target.value);
                    if (!isNaN(parsed)) {
                      onChangeParam(key, parsed);
                    }
                  }}
                  className="w-20 px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-700 text-right text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="range"
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  value={val}
                  onChange={(e) => onChangeParam(key, parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>{config.min}</span>
                <span>{config.max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
