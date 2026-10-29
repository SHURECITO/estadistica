'use client';

import React from 'react';
import { X, BookOpen, Lightbulb } from 'lucide-react';
import { KatexView } from './KatexView';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Guía de Distribuciones Estadísticas</h3>
              <p className="text-xs text-neutral-400">Conceptos clave, fórmulas y aplicaciones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-neutral-300 text-xs sm:text-sm">
          {/* Tip */}
          <div className="bg-indigo-950/40 border border-indigo-500/30 p-3.5 rounded-xl flex items-start space-x-3 text-indigo-200">
            <Lightbulb className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
            <p className="text-xs leading-relaxed">
              <strong>Modo Inverso (Cuantiles):</strong> Permite calcular valores críticos $x^*$ para pruebas de hipótesis o intervalos de confianza especificando la significancia $\alpha$ (p. ej. $\alpha = 0.05$ para $95\%$ de confianza).
            </p>
          </div>

          {/* Distributions */}
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-1.5">
              <h4 className="font-semibold text-white text-sm flex items-center justify-between">
                <span>1. Normal & Normal Estándar Z</span>
                <span className="text-[10px] text-cyan-400 font-mono">Continua</span>
              </h4>
              <p className="text-neutral-400 text-xs">
                La piedra angular de la estadística por el Teorema Central del Límite. La estándar $Z$ tiene $\mu = 0$ y $\sigma = 1$.
              </p>
              <div className="pt-1 text-neutral-200">
                <KatexView math="f(x) = \frac{1}{\sigma \sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}" block />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-1.5">
              <h4 className="font-semibold text-white text-sm flex items-center justify-between">
                <span>2. t de Student</span>
                <span className="text-[10px] text-cyan-400 font-mono">Continua</span>
              </h4>
              <p className="text-neutral-400 text-xs">
                Ideal para inferencia sobre medias con muestras pequeñas ($n &lt; 30$) o cuando la varianza poblacional es desconocida. A medida que $\nu \to \infty$, converge a la Normal.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-1.5">
              <h4 className="font-semibold text-white text-sm flex items-center justify-between">
                <span>3. Chi-cuadrado (χ²)</span>
                <span className="text-[10px] text-cyan-400 font-mono">Continua</span>
              </h4>
              <p className="text-neutral-400 text-xs">
                Suma de los cuadrados de $\nu$ variables normales estándar independientes. Fundamental para pruebas de bondad de ajuste y tablas de contingencia.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-1.5">
              <h4 className="font-semibold text-white text-sm flex items-center justify-between">
                <span>4. F de Fisher-Snedecor</span>
                <span className="text-[10px] text-cyan-400 font-mono">Continua</span>
              </h4>
              <p className="text-neutral-400 text-xs">
                Razón entre dos varianzas muestrales independientes normalizadas. Usada en análisis de varianza (ANOVA) y regresión lineal múltiple.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-1.5">
              <h4 className="font-semibold text-white text-sm flex items-center justify-between">
                <span>5. Gamma</span>
                <span className="text-[10px] text-cyan-400 font-mono">Continua</span>
              </h4>
              <p className="text-neutral-400 text-xs">
                Generalización continua para modelar tiempos hasta la ocurrencia de $k$ eventos. Contiene como casos particulares a la Exponencial y Chi-cuadrado.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-1.5">
              <h4 className="font-semibold text-white text-sm flex items-center justify-between">
                <span>6. Binomial</span>
                <span className="text-[10px] text-amber-400 font-mono">Discreta</span>
              </h4>
              <p className="text-neutral-400 text-xs">
                Cuenta el número de éxitos en $n$ ensayos independientes idénticos de Bernoulli con probabilidad $p$.
              </p>
              <div className="pt-1 text-neutral-200">
                <KatexView math="P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}" block />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-1.5">
              <h4 className="font-semibold text-white text-sm flex items-center justify-between">
                <span>7. Poisson</span>
                <span className="text-[10px] text-amber-400 font-mono">Discreta</span>
              </h4>
              <p className="text-neutral-400 text-xs">
                Modela el número de eventos raros en un intervalo de tiempo o espacio con una tasa promedio constante $\lambda$.
              </p>
              <div className="pt-1 text-neutral-200">
                <KatexView math="P(X = k) = \frac{\lambda^k e^{-\lambda}}{k!}" block />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
