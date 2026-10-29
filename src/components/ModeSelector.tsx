'use client';

import React from 'react';
import { CalculationMode } from '@/types/distributions';
import { Target, ArrowLeftRight } from 'lucide-react';

interface ModeSelectorProps {
  mode: CalculationMode;
  onSelectMode: (mode: CalculationMode) => void;
  isDiscrete: boolean;
  x: number;
  x1: number;
  x2: number;
  alpha: number;
  onChangeX: (val: number) => void;
  onChangeX1: (val: number) => void;
  onChangeX2: (val: number) => void;
  onChangeAlpha: (val: number) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  onSelectMode,
  isDiscrete,
  x,
  x1,
  x2,
  alpha,
  onChangeX,
  onChangeX1,
  onChangeX2,
  onChangeAlpha,
}) => {
  return (
    <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
          <ArrowLeftRight className="w-4 h-4 text-indigo-400" />
          <span>Región de Probabilidad / Modo de Cálculo</span>
        </h3>
      </div>

      {/* Mode selection buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {/* Left Tail */}
        <button
          onClick={() => onSelectMode('left')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
            mode === 'left'
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 ring-1 ring-white/20'
              : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <div className="w-8 h-4 mb-1.5 flex items-end justify-center">
            <svg viewBox="0 0 40 20" className="w-full h-full">
              <path
                d="M 2 18 Q 12 18, 15 5 Q 20 2, 25 5 Q 28 18, 38 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M 2 18 Q 12 18, 15 5 Q 18 3, 20 3 L 20 18 Z"
                fill="currentColor"
                opacity={mode === 'left' ? '0.7' : '0.4'}
              />
            </svg>
          </div>
          <span className="text-xs font-semibold">Cola Izq.</span>
          <span className="text-[10px] opacity-75 font-mono">P(X ≤ x)</span>
        </button>

        {/* Right Tail */}
        <button
          onClick={() => onSelectMode('right')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
            mode === 'right'
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 ring-1 ring-white/20'
              : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <div className="w-8 h-4 mb-1.5 flex items-end justify-center">
            <svg viewBox="0 0 40 20" className="w-full h-full">
              <path
                d="M 2 18 Q 12 18, 15 5 Q 20 2, 25 5 Q 28 18, 38 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M 20 3 Q 22 3, 25 5 Q 28 18, 38 18 L 20 18 Z"
                fill="currentColor"
                opacity={mode === 'right' ? '0.7' : '0.4'}
              />
            </svg>
          </div>
          <span className="text-xs font-semibold">Cola Der.</span>
          <span className="text-[10px] opacity-75 font-mono">P(X ≥ x)</span>
        </button>

        {/* Between */}
        <button
          onClick={() => onSelectMode('between')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
            mode === 'between'
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 ring-1 ring-white/20'
              : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <div className="w-8 h-4 mb-1.5 flex items-end justify-center">
            <svg viewBox="0 0 40 20" className="w-full h-full">
              <path
                d="M 2 18 Q 12 18, 15 5 Q 20 2, 25 5 Q 28 18, 38 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M 14 6 Q 20 2, 26 6 L 26 18 L 14 18 Z"
                fill="currentColor"
                opacity={mode === 'between' ? '0.7' : '0.4'}
              />
            </svg>
          </div>
          <span className="text-xs font-semibold">Entre</span>
          <span className="text-[10px] opacity-75 font-mono">P(x₁ ≤ X ≤ x₂)</span>
        </button>

        {/* Outside / Two Tails */}
        <button
          onClick={() => onSelectMode('outside')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
            mode === 'outside'
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 ring-1 ring-white/20'
              : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <div className="w-8 h-4 mb-1.5 flex items-end justify-center">
            <svg viewBox="0 0 40 20" className="w-full h-full">
              <path
                d="M 2 18 Q 12 18, 15 5 Q 20 2, 25 5 Q 28 18, 38 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M 2 18 Q 10 18, 13 8 L 13 18 Z"
                fill="currentColor"
                opacity={mode === 'outside' ? '0.7' : '0.4'}
              />
              <path
                d="M 27 8 Q 30 18, 38 18 L 27 18 Z"
                fill="currentColor"
                opacity={mode === 'outside' ? '0.7' : '0.4'}
              />
            </svg>
          </div>
          <span className="text-xs font-semibold">Exteriores</span>
          <span className="text-[10px] opacity-75 font-mono">2 Colas</span>
        </button>

        {/* Exact (Discrete only) */}
        {isDiscrete ? (
          <button
            onClick={() => onSelectMode('exact')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
              mode === 'exact'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 ring-1 ring-white/20'
                : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <div className="w-8 h-4 mb-1.5 flex items-end justify-center">
              <div className="w-1.5 h-3.5 bg-current rounded-sm" />
            </div>
            <span className="text-xs font-semibold">Puntual</span>
            <span className="text-[10px] opacity-75 font-mono">P(X = k)</span>
          </button>
        ) : (
          <button
            disabled
            className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-neutral-800/40 text-neutral-600 bg-neutral-950/20 cursor-not-allowed text-center"
            title="En continuas, P(X = x) = 0"
          >
            <div className="w-8 h-4 mb-1.5 flex items-end justify-center">
              <span className="text-[11px] font-mono">P=0</span>
            </div>
            <span className="text-xs font-semibold">Puntual</span>
            <span className="text-[10px] font-mono">(Solo disc.)</span>
          </button>
        )}

        {/* Inverse Quantile Mode */}
        <button
          onClick={() => onSelectMode('inverse')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
            mode === 'inverse'
              ? 'bg-pink-600 text-white border-pink-400 shadow-md shadow-pink-600/30 ring-1 ring-white/20'
              : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Target className="w-4 h-4 mb-1.5 text-current" />
          <span className="text-xs font-semibold">Inverso</span>
          <span className="text-[10px] opacity-75 font-mono">Cuantil (α)</span>
        </button>
      </div>

      {/* Input controls based on mode */}
      <div className="bg-neutral-950/50 p-3 rounded-xl border border-neutral-800/70">
        {mode === 'inverse' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-300">
                Probabilidad acumulada deseada (<span className="text-pink-400 font-mono font-bold">α</span>)
              </span>
              <input
                type="number"
                min="0.0001"
                max="0.9999"
                step="0.01"
                value={alpha}
                onChange={(e) => onChangeAlpha(parseFloat(e.target.value) || 0.05)}
                className="w-24 px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-right text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <input
              type="range"
              min="0.001"
              max="0.999"
              step="0.005"
              value={alpha}
              onChange={(e) => onChangeAlpha(parseFloat(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
            />
            {/* Quick alpha presets */}
            <div className="flex items-center space-x-1.5 pt-1">
              <span className="text-[10px] text-neutral-500">Valores típicos:</span>
              {[0.01, 0.025, 0.05, 0.1, 0.9, 0.95, 0.975, 0.99].map((preset) => (
                <button
                  key={preset}
                  onClick={() => onChangeAlpha(preset)}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                    Math.abs(alpha - preset) < 0.0001
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        ) : mode === 'between' || mode === 'outside' ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-mono">
                  {isDiscrete ? 'Límite k₁' : 'Límite x₁'}
                </span>
                <input
                  type="number"
                  step={isDiscrete ? '1' : '0.1'}
                  value={x1}
                  onChange={(e) => onChangeX1(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-right text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <input
                type="range"
                min={-30}
                max={30}
                step={isDiscrete ? 1 : 0.1}
                value={x1}
                onChange={(e) => onChangeX1(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-mono">
                  {isDiscrete ? 'Límite k₂' : 'Límite x₂'}
                </span>
                <input
                  type="number"
                  step={isDiscrete ? '1' : '0.1'}
                  value={x2}
                  onChange={(e) => onChangeX2(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-right text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <input
                type="range"
                min={-30}
                max={30}
                step={isDiscrete ? 1 : 0.1}
                value={x2}
                onChange={(e) => onChangeX2(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-300">
                Punto de corte (<span className="text-indigo-400 font-mono font-bold">{isDiscrete ? 'k' : 'x'}</span>)
              </span>
              <input
                type="number"
                step={isDiscrete ? '1' : '0.1'}
                value={x}
                onChange={(e) => onChangeX(parseFloat(e.target.value) || 0)}
                className="w-24 px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-right text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <input
              type="range"
              min={-30}
              max={30}
              step={isDiscrete ? 1 : 0.1}
              value={x}
              onChange={(e) => onChangeX(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};
