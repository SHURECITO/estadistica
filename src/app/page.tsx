'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { DistributionSelector } from '@/components/DistributionSelector';
import { ParametersPanel } from '@/components/ParametersPanel';
import { ModeSelector } from '@/components/ModeSelector';
import { DistributionChart } from '@/components/DistributionChart';
import { ResultsBanner } from '@/components/ResultsBanner';
import { MomentsCard } from '@/components/MomentsCard';
import { FormulaCard } from '@/components/FormulaCard';
import { ProbabilityTable } from '@/components/ProbabilityTable';
import { HelpModal } from '@/components/HelpModal';
import { DistributionType, CalculationMode } from '@/types/distributions';
import { DISTRIBUTION_METAS, calculateDistribution, isDiscrete } from '@/lib/distributions';
import { Server, Sparkles, RefreshCw } from 'lucide-react';

export default function Home() {
  const [selectedType, setSelectedType] = useState<DistributionType>('normal');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'continuous' | 'discrete'>('all');
  const [mode, setMode] = useState<CalculationMode>('left');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Parameter state per distribution
  const [paramsState, setParamsState] = useState<Record<DistributionType, Record<string, number>>>({
    normal: { mean: 0, std: 1 },
    studentt: { df: 10 },
    chisquare: { df: 5 },
    f: { df1: 5, df2: 10 },
    gamma: { shape: 3, scale: 2 },
    binomial: { n: 20, p: 0.5 },
    poisson: { lambda: 5 },
  });

  // Cutoff points state
  const [xVal, setXVal] = useState<number>(1.96);
  const [x1Val, setX1Val] = useState<number>(-1.96);
  const [x2Val, setX2Val] = useState<number>(1.96);
  const [alphaVal, setAlphaVal] = useState<number>(0.05);

  // Backend verification test state
  const [apiTesting, setApiTesting] = useState(false);
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  const currentParams = paramsState[selectedType];
  const discrete = isDiscrete(selectedType);

  const handleSelectType = (type: DistributionType) => {
    setSelectedType(type);
    // If switching from discrete to continuous and mode was 'exact', reset to 'left'
    if (!isDiscrete(type) && mode === 'exact') {
      setMode('left');
    }

    // Set reasonable default cutoff values based on the distribution
    if (type === 'normal') {
      setXVal(1.96);
      setX1Val(-1.96);
      setX2Val(1.96);
    } else if (type === 'studentt') {
      setXVal(2.228);
      setX1Val(-2.228);
      setX2Val(2.228);
    } else if (type === 'chisquare') {
      setXVal(11.07);
      setX1Val(1.15);
      setX2Val(11.07);
    } else if (type === 'f') {
      setXVal(3.33);
      setX1Val(0.2);
      setX2Val(3.33);
    } else if (type === 'gamma') {
      setXVal(8.0);
      setX1Val(2.0);
      setX2Val(10.0);
    } else if (type === 'binomial') {
      setXVal(10);
      setX1Val(7);
      setX2Val(13);
    } else if (type === 'poisson') {
      setXVal(5);
      setX1Val(2);
      setX2Val(8);
    }
  };

  const handleChangeParam = (key: string, value: number) => {
    setParamsState((prev) => ({
      ...prev,
      [selectedType]: {
        ...prev[selectedType],
        [key]: value,
      },
    }));
  };

  const handleResetParams = () => {
    const meta = DISTRIBUTION_METAS.find((m) => m.id === selectedType);
    if (!meta) return;
    const defaults: Record<string, number> = {};
    for (const [key, config] of Object.entries(meta.parameterLabels)) {
      defaults[key] = config.default;
    }
    setParamsState((prev) => ({
      ...prev,
      [selectedType]: defaults,
    }));
  };

  const handleSetStandardNormal = () => {
    setParamsState((prev) => ({
      ...prev,
      normal: { mean: 0, std: 1 },
    }));
    setXVal(1.96);
    setX1Val(-1.96);
    setX2Val(1.96);
  };

  const handleSelectPreset = (presetId: string) => {
    if (presetId === 'rule_68_95_99') {
      setSelectedType('normal');
      setParamsState((prev) => ({ ...prev, normal: { mean: 0, std: 1 } }));
      setMode('between');
      setX1Val(-1.96);
      setX2Val(1.96);
    } else if (presetId === 't_student_p05') {
      setSelectedType('studentt');
      setParamsState((prev) => ({ ...prev, studentt: { df: 10 } }));
      setMode('outside');
      setX1Val(-2.228);
      setX2Val(2.228);
    } else if (presetId === 'chi_p05') {
      setSelectedType('chisquare');
      setParamsState((prev) => ({ ...prev, chisquare: { df: 5 } }));
      setMode('right');
      setXVal(11.07);
    } else if (presetId === 'poisson_rare') {
      setSelectedType('poisson');
      setParamsState((prev) => ({ ...prev, poisson: { lambda: 4 } }));
      setMode('exact');
      setXVal(2);
    } else if (presetId === 'binomial_coins') {
      setSelectedType('binomial');
      setParamsState((prev) => ({ ...prev, binomial: { n: 20, p: 0.5 } }));
      setMode('between');
      setX1Val(8);
      setX2Val(12);
    }
  };

  // Test backend API route
  const handleTestApi = async () => {
    setApiTesting(true);
    setApiStatus('Consultando /api/distribution...');
    try {
      const res = await fetch('/api/distribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          params: currentParams,
          mode,
          x: xVal,
          x1: x1Val,
          x2: x2Val,
          alpha: alphaVal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setApiStatus(`API OK (200) - P = ${data.result.formattedProbability}`);
      } else {
        setApiStatus('Error en API');
      }
    } catch {
      setApiStatus('Error de conexión con la API');
    } finally {
      setApiTesting(false);
      setTimeout(() => setApiStatus(null), 4000);
    }
  };

  // Compute results (client-side for instant 60fps responsiveness)
  const calculationResult = useMemo(() => {
    return calculateDistribution(selectedType, currentParams, mode, {
      x: xVal,
      x1: x1Val,
      x2: x2Val,
      alpha: alphaVal,
    });
  }, [selectedType, currentParams, mode, xVal, x1Val, x2Val, alphaVal]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      {/* Top Header */}
      <Header
        onOpenHelp={() => setIsHelpOpen(true)}
        onSelectPreset={handleSelectPreset}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Distribution Selector */}
        <DistributionSelector
          selected={selectedType}
          onSelect={handleSelectType}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />

        {/* Main Grid: Left Controls & Right Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Parameters and Modes (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <ParametersPanel
              type={selectedType}
              params={currentParams}
              onChangeParam={handleChangeParam}
              onResetParams={handleResetParams}
              onSetStandardNormal={handleSetStandardNormal}
            />

            <ModeSelector
              mode={mode}
              onSelectMode={setMode}
              isDiscrete={discrete}
              x={xVal}
              x1={x1Val}
              x2={x2Val}
              alpha={alphaVal}
              onChangeX={setXVal}
              onChangeX1={setX1Val}
              onChangeX2={setX2Val}
              onChangeAlpha={setAlphaVal}
            />

            {/* Backend API verification badge */}
            <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span className="text-neutral-300 font-mono text-[11px]">
                  Backend API: <code className="text-indigo-400">/api/distribution</code>
                </span>
              </div>
              <button
                onClick={handleTestApi}
                disabled={apiTesting}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${apiTesting ? 'animate-spin' : ''}`} />
                <span>{apiStatus || 'Test API'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Chart and Results (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Prominent Result Banner */}
            <ResultsBanner
              result={calculationResult}
              mode={mode}
              isDiscrete={discrete}
              x={xVal}
              x1={x1Val}
              x2={x2Val}
            />

            {/* Interactive SVG Chart */}
            <DistributionChart
              points={calculationResult.chartPoints}
              isDiscrete={discrete}
              mode={mode}
              xMin={calculationResult.xMin}
              xMax={calculationResult.xMax}
              yMax={calculationResult.yMax}
              xVal={xVal}
              x1Val={x1Val}
              x2Val={x2Val}
              inverseX={calculationResult.inverseX}
            />
          </div>
        </div>

        {/* Moments Statistics Card */}
        <MomentsCard moments={calculationResult.moments} />

        {/* Formula & Step-by-Step Breakdown */}
        <FormulaCard
          formulaLatex={calculationResult.formulaLatex}
          substitutionLatex={calculationResult.substitutionLatex}
          stepDescription={calculationResult.stepDescription}
        />

        {/* Interactive Probability Table (with CSV export) */}
        <ProbabilityTable
          type={selectedType}
          params={currentParams}
          xMin={calculationResult.xMin}
          xMax={calculationResult.xMax}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 text-center text-xs text-neutral-500 mt-12">
        <p>
          DistriLab • Calculadora y Visualizador de Distribuciones de Probabilidad • Compatible 100% con Vercel
        </p>
      </footer>

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
