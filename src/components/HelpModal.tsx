'use client';

import React from 'react';
import { X, BookOpen, Lightbulb } from 'lucide-react';
import { KatexView, MathText } from './KatexView';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Guía de Distribuciones Estadísticas</h3>
              <p className="text-xs text-neutral-400">Conceptos clave, notación matemática y fórmulas</p>
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
            <div className="text-xs leading-relaxed">
              <strong>Modo Inverso (Cuantiles): </strong>
              <MathText text="Permite calcular valores críticos $x^*$ para pruebas de hipótesis o intervalos de confianza especificando el nivel de probabilidad o significancia $\alpha$ (por ejemplo $\alpha = 0.05$ para $95\%$ de confianza acumulada)." />
            </div>
          </div>

          {/* Distributions List */}
          <div className="space-y-4">
            {/* 1. Normal */}
            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-sm">
                  1. Normal & Normal Estándar <KatexView math="Z" />
                </h4>
                <span className="text-[10px] text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                  Continua
                </span>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                <MathText text="La piedra angular de la estadística por el Teorema Central del Límite. La estándar $Z$ tiene media $\mu = 0$ y desviación estándar $\sigma = 1$." />
              </p>
              <div className="pt-1.5 pb-0.5 text-neutral-200 bg-neutral-900/60 p-2 rounded-lg border border-neutral-800/60 overflow-x-auto">
                <KatexView math="f(x) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right), \quad x \in \mathbb{R}" block />
              </div>
            </div>

            {/* 2. Student's t */}
            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-sm">
                  2. t de Student
                </h4>
                <span className="text-[10px] text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                  Continua
                </span>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                <MathText text="Ideal para inferencia sobre medias con muestras pequeñas ($n < 30$) o cuando la varianza poblacional es desconocida. A medida que los grados de libertad $\nu \to \infty$, converge a la Normal estándar." />
              </p>
              <div className="pt-1.5 pb-0.5 text-neutral-200 bg-neutral-900/60 p-2 rounded-lg border border-neutral-800/60 overflow-x-auto">
                <KatexView math="f(x) = \frac{\Gamma\left(\frac{\nu+1}{2}\right)}{\sqrt{\nu\pi}\,\Gamma\left(\frac{\nu}{2}\right)} \left(1 + \frac{x^2}{\nu}\right)^{-\frac{\nu+1}{2}}" block />
              </div>
            </div>

            {/* 3. Chi-square */}
            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-sm">
                  3. Chi-cuadrado (<KatexView math="\chi^2" />)
                </h4>
                <span className="text-[10px] text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                  Continua
                </span>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                <MathText text="Suma de los cuadrados de $\nu$ variables normales estándar independientes. Fundamental para pruebas de bondad de ajuste, tablas de contingencia e inferencia de varianzas." />
              </p>
              <div className="pt-1.5 pb-0.5 text-neutral-200 bg-neutral-900/60 p-2 rounded-lg border border-neutral-800/60 overflow-x-auto">
                <KatexView math="f(x) = \frac{1}{2^{\nu/2}\Gamma(\nu/2)} x^{\nu/2 - 1} e^{-x/2}, \quad x > 0" block />
              </div>
            </div>

            {/* 4. F de Fisher-Snedecor */}
            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-sm">
                  4. F de Fisher-Snedecor
                </h4>
                <span className="text-[10px] text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                  Continua
                </span>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                <MathText text="Cociente de dos varianzas muestrales independientes normalizadas por sus grados de libertad $d_1$ y $d_2$. Es la base del análisis de varianza (ANOVA) y regresión." />
              </p>
              <div className="pt-1.5 pb-0.5 text-neutral-200 bg-neutral-900/60 p-2 rounded-lg border border-neutral-800/60 overflow-x-auto">
                <KatexView math="f(x) = \frac{1}{\mathrm{B}(d_1/2, d_2/2)} \left(\frac{d_1}{d_2}\right)^{d_1/2} \frac{x^{d_1/2 - 1}}{\left(1 + \frac{d_1}{d_2}x\right)^{(d_1+d_2)/2}}, \quad x > 0" block />
              </div>
            </div>

            {/* 5. Gamma */}
            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-sm">
                  5. Gamma
                </h4>
                <span className="text-[10px] text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                  Continua
                </span>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                <MathText text="Distribución continua para modelar tiempos hasta la ocurrencia de $k$ eventos. Depende del parámetro de forma $k$ (o $\alpha$) y escala $\theta$ (con tasa $\beta = 1/\theta$)." />
              </p>
              <div className="pt-1.5 pb-0.5 text-neutral-200 bg-neutral-900/60 p-2 rounded-lg border border-neutral-800/60 overflow-x-auto">
                <KatexView math="f(x) = \frac{1}{\theta^k \Gamma(k)} x^{k-1} e^{-x/\theta}, \quad x > 0" block />
              </div>
            </div>

            {/* 6. Binomial */}
            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-sm">
                  6. Binomial
                </h4>
                <span className="text-[10px] text-amber-400 font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
                  Discreta
                </span>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                <MathText text="Cuenta el número de éxitos $k$ en $n$ ensayos independientes idénticos de Bernoulli con probabilidad constante $p$." />
              </p>
              <div className="pt-1.5 pb-0.5 text-neutral-200 bg-neutral-900/60 p-2 rounded-lg border border-neutral-800/60 overflow-x-auto">
                <KatexView math="P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}, \quad k \in \{0, 1, \dots, n\}" block />
              </div>
            </div>

            {/* 7. Poisson */}
            <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-sm">
                  7. Poisson
                </h4>
                <span className="text-[10px] text-amber-400 font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
                  Discreta
                </span>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                <MathText text="Modela el número de eventos en un intervalo fijo de tiempo o espacio cuando los eventos ocurren a una tasa promedio constante $\lambda$ de forma independiente." />
              </p>
              <div className="pt-1.5 pb-0.5 text-neutral-200 bg-neutral-900/60 p-2 rounded-lg border border-neutral-800/60 overflow-x-auto">
                <KatexView math="P(X = k) = \frac{\lambda^k e^{-\lambda}}{k!}, \quad k \in \{0, 1, 2, \dots\}" block />
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
            Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  );
};
