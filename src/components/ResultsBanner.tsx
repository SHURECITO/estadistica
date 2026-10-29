'use client';

import React, { useState } from 'react';
import { CalculationResult, CalculationMode } from '@/types/distributions';
import { Copy, Check, TrendingUp } from 'lucide-react';

interface ResultsBannerProps {
  result: CalculationResult;
  mode: CalculationMode;
  isDiscrete: boolean;
  x: number;
  x1: number;
  x2: number;
}

export const ResultsBanner: React.FC<ResultsBannerProps> = ({
  result,
  mode,
  isDiscrete,
  x,
  x1,
  x2,
}) => {
  const [copied, setCopied] = useState(false);

  const getExpressionText = () => {
    if (mode === 'inverse') {
      return `Cuantil F⁻¹(${result.probability}) = ${result.inverseX?.toFixed(5)}`;
    }
    const varSymbol = isDiscrete ? 'k' : 'x';
    switch (mode) {
      case 'left':
        return `P(X ≤ ${isDiscrete ? Math.round(x) : x.toFixed(3)})`;
      case 'right':
        return `P(X ≥ ${isDiscrete ? Math.round(x) : x.toFixed(3)})`;
      case 'between':
        return `P(${isDiscrete ? Math.round(x1) : x1.toFixed(3)} ≤ X ≤ ${isDiscrete ? Math.round(x2) : x2.toFixed(3)})`;
      case 'outside':
        return `P(X < ${isDiscrete ? Math.round(x1) : x1.toFixed(3)} ∪ X > ${isDiscrete ? Math.round(x2) : x2.toFixed(3)})`;
      case 'exact':
        return `P(X = ${isDiscrete ? Math.round(x) : x.toFixed(3)})`;
    }
  };

  const handleCopy = () => {
    const textToCopy = `${getExpressionText()} = ${result.formattedProbability} (${result.percentage})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/60 via-neutral-900 to-neutral-950 border border-indigo-500/30 p-5 shadow-2xl backdrop-blur-xl">
      {/* Background glow circle */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 font-mono">
              {getExpressionText()}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Resultado
            </span>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
              {mode === 'inverse' ? result.inverseX?.toFixed(5) : result.formattedProbability}
            </span>
            <span className="text-lg font-semibold text-neutral-400">
              {mode === 'inverse' ? (
                <span className="text-pink-400 text-sm font-normal">
                  (Valor crítico x*)
                </span>
              ) : (
                result.percentage
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700/80 transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual probability fill bar */}
      {mode !== 'inverse' && (
        <div className="mt-4 pt-3 border-t border-neutral-800/80">
          <div className="flex justify-between text-[11px] text-neutral-400 mb-1.5 font-mono">
            <span>0%</span>
            <span>Área bajo la curva: {result.percentage}</span>
            <span>100%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 shadow-sm"
              style={{ width: `${Math.min(100, Math.max(0, result.probability * 100))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
