'use client';

import React from 'react';
import { Sparkles, Calculator, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenHelp: () => void;
  onSelectPreset: (presetId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHelp, onSelectPreset }) => {
  return (
    <header className="border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                DistriLab
              </span>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Calculadora Interactiva de Distribuciones Estadísticas & Probabilidad
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Presets Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 hover:text-white transition-all shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ejemplos Típicos</span>
              <span className="sm:hidden">Ejemplos</span>
            </button>
            <div className="absolute right-0 mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-1.5 hidden group-hover:block transition-all z-50">
              <div className="text-[10px] font-bold text-neutral-500 uppercase px-2 py-1">
                Casos de Estudio
              </div>
              <button
                onClick={() => onSelectPreset('rule_68_95_99')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                📐 Regla Empírica Normal (95%)
              </button>
              <button
                onClick={() => onSelectPreset('t_student_p05')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                🔬 t-Student Crítico Bilateral (gl=10)
              </button>
              <button
                onClick={() => onSelectPreset('chi_p05')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                📊 Chi-cuadrado α = 0.05
              </button>
              <button
                onClick={() => onSelectPreset('poisson_rare')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                ⏱️ Poisson: Tasa de Llegadas λ = 4
              </button>
              <button
                onClick={() => onSelectPreset('binomial_coins')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                🪙 Binomial: 20 Lanzamientos (p=0.5)
              </button>
            </div>
          </div>

          <button
            onClick={onOpenHelp}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200 text-xs transition-colors"
            title="Ayuda y Fórmulas"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Guía</span>
          </button>

          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs transition-colors"
            title="Desplegable en Vercel"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden md:inline font-mono">Vercel Ready</span>
          </a>
        </div>
      </div>
    </header>
  );
};
