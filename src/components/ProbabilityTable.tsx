'use client';

import React, { useState } from 'react';
import { DistributionType } from '@/types/distributions';
import { computePDF, computeCDF, isDiscrete } from '@/lib/distributions';
import { Table, Download, ChevronDown, ChevronUp } from 'lucide-react';

interface ProbabilityTableProps {
  type: DistributionType;
  params: Record<string, number>;
  xMin: number;
  xMax: number;
}

export const ProbabilityTable: React.FC<ProbabilityTableProps> = ({
  type,
  params,
  xMin,
  xMax,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const discrete = isDiscrete(type);

  // Generate rows
  const rows: { val: number; pdf: number; cdf: number; rightCdf: number }[] = [];

  if (discrete) {
    const start = Math.max(0, Math.floor(xMin));
    const end = Math.min(start + 40, Math.ceil(xMax));
    for (let k = start; k <= end; k++) {
      const pdf = computePDF(type, k, params);
      const cdf = computeCDF(type, k, params);
      rows.push({ val: k, pdf, cdf, rightCdf: 1 - computeCDF(type, k - 1, params) });
    }
  } else {
    const numSteps = 25;
    const step = (xMax - xMin) / (numSteps - 1);
    for (let i = 0; i < numSteps; i++) {
      const x = xMin + i * step;
      const pdf = computePDF(type, x, params);
      const cdf = computeCDF(type, x, params);
      rows.push({ val: Number(x.toFixed(2)), pdf, cdf, rightCdf: 1 - cdf });
    }
  }

  const exportCSV = () => {
    const headers = discrete
      ? ['k', 'P(X = k)', 'P(X <= k)', 'P(X >= k)']
      : ['x', 'f(x) [Densidad]', 'P(X <= x) [CDF]', 'P(X >= x)'];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => [r.val, r.pdf.toFixed(6), r.cdf.toFixed(6), r.rightCdf.toFixed(6)].join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `distribucion_${type}_tabla.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-800/50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Table className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">
            Tabla de Probabilidades {discrete ? 'Puntuales y Acumuladas' : 'de Referencia'}
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
            {rows.length} filas
          </span>
        </div>
        <div className="flex items-center space-x-2 text-neutral-400">
          <span className="text-xs">{isOpen ? 'Ocultar' : 'Ver tabla'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 space-y-3 border-t border-neutral-800/60">
          <div className="flex justify-between items-center pt-3">
            <span className="text-xs text-neutral-400">
              Valores calculados dinámicamente con los parámetros actuales:
            </span>
            <button
              onClick={exportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Exportar CSV</span>
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-950 text-neutral-400 sticky top-0 border-b border-neutral-800">
                <tr>
                  <th className="py-2 px-3">{discrete ? 'k' : 'x'}</th>
                  <th className="py-2 px-3">{discrete ? 'P(X = k)' : 'f(x)'}</th>
                  <th className="py-2 px-3">{discrete ? 'P(X ≤ k)' : 'P(X ≤ x)'}</th>
                  <th className="py-2 px-3">{discrete ? 'P(X ≥ k)' : 'P(X ≥ x)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-1.5 px-3 font-bold text-white">{row.val}</td>
                    <td className="py-1.5 px-3 text-neutral-300">{row.pdf.toFixed(5)}</td>
                    <td className="py-1.5 px-3 text-indigo-400">{row.cdf.toFixed(5)}</td>
                    <td className="py-1.5 px-3 text-purple-400">{row.rightCdf.toFixed(5)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
