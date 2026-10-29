'use client';

import React from 'react';
import { Calculator, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHelp }) => {
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
                Proyecto Estadística
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Calculadora Interactiva de Distribuciones Estadísticas & Probabilidad
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenHelp}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs transition-colors shadow-sm"
            title="Guía de Distribuciones y Fórmulas"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>Guía & Fórmulas</span>
          </button>
        </div>
      </div>
    </header>
  );
};
