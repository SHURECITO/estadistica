'use client';

import React from 'react';
import { KatexView, MathText } from './KatexView';
import { BookOpen, Info } from 'lucide-react';

interface FormulaCardProps {
  formulaLatex: string;
  substitutionLatex: string;
  stepDescription: string;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({
  formulaLatex,
  substitutionLatex,
  stepDescription,
}) => {
  return (
    <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
      <div className="flex items-center space-x-2">
        <BookOpen className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-white">Desglose Matemático & Procedimiento</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Formula General */}
        <div className="bg-neutral-950/50 p-3 rounded-xl border border-neutral-800/60 space-y-1.5">
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
            Fórmula de Cálculo
          </span>
          <div className="overflow-x-auto py-2 text-white">
            <KatexView math={formulaLatex} block />
          </div>
        </div>

        {/* Sustitución */}
        <div className="bg-neutral-950/50 p-3 rounded-xl border border-neutral-800/60 space-y-1.5">
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
            Sustitución Numérica
          </span>
          <div className="overflow-x-auto py-2 text-indigo-300">
            <KatexView math={substitutionLatex} block />
          </div>
        </div>
      </div>

      {/* Explicación didáctica */}
      {stepDescription && (
        <div className="flex items-start space-x-2 bg-neutral-950/40 p-3 rounded-xl border border-neutral-800/50 text-xs text-neutral-300">
          <Info className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            <MathText text={stepDescription} />
          </p>
        </div>
      )}
    </div>
  );
};
