import { jStat } from 'jstat';
import {
  DistributionType,
  CalculationMode,
  NormalParams,
  BinomialParams,
  PoissonParams,
  StudentTParams,
  ChiSquareParams,
  FParams,
  GammaParams,
  Moments,
  ChartPoint,
  CalculationResult,
  DistributionMeta,
} from '@/types/distributions';

export const DISTRIBUTION_METAS: DistributionMeta[] = [
  {
    id: 'normal',
    name: 'Normal (Gaussiana)',
    category: 'continuous',
    description: 'Distribución en forma de campana simétrica descrita por su media (μ) y desviación estándar (σ).',
    parameterLabels: {
      mean: { label: 'Media', symbol: 'μ', min: -100, max: 100, step: 0.1, default: 0 },
      std: { label: 'Desv. Estándar', symbol: 'σ', min: 0.1, max: 50, step: 0.1, default: 1 },
    },
  },
  {
    id: 'studentt',
    name: 't de Student',
    category: 'continuous',
    description: 'Distribución simétrica con colas más pesadas que la Normal, utilizada en muestras pequeñas con σ desconocida.',
    parameterLabels: {
      df: { label: 'Grados de Libertad', symbol: 'ν', min: 1, max: 120, step: 1, default: 10 },
    },
  },
  {
    id: 'chisquare',
    name: 'Chi-cuadrado (χ²)',
    category: 'continuous',
    description: 'Distribución asimétrica positiva surgida de la suma de variables normales estándar al cuadrado.',
    parameterLabels: {
      df: { label: 'Grados de Libertad', symbol: 'ν', min: 1, max: 100, step: 1, default: 5 },
    },
  },
  {
    id: 'f',
    name: 'F de Fisher-Snedecor',
    category: 'continuous',
    description: 'Cociente de dos variables Chi-cuadrado independientes normalizadas por sus grados de libertad (ANOVA).',
    parameterLabels: {
      df1: { label: 'Grados Libertad 1 (Num)', symbol: 'd₁', min: 1, max: 100, step: 1, default: 5 },
      df2: { label: 'Grados Libertad 2 (Den)', symbol: 'd₂', min: 1, max: 100, step: 1, default: 10 },
    },
  },
  {
    id: 'gamma',
    name: 'Gamma',
    category: 'continuous',
    description: 'Distribución continua flexible para modelar tiempos de espera y variables positivas con forma y escala.',
    parameterLabels: {
      shape: { label: 'Forma (Shape)', symbol: 'k (α)', min: 0.5, max: 30, step: 0.5, default: 3 },
      scale: { label: 'Escala (Scale)', symbol: 'θ', min: 0.2, max: 20, step: 0.2, default: 2 },
    },
  },
  {
    id: 'binomial',
    name: 'Binomial',
    category: 'discrete',
    description: 'Número de éxitos k en n ensayos independientes de Bernoulli con probabilidad constante p.',
    parameterLabels: {
      n: { label: 'Ensayos (n)', symbol: 'n', min: 1, max: 200, step: 1, default: 20 },
      p: { label: 'Probabilidad de éxito', symbol: 'p', min: 0.01, max: 0.99, step: 0.01, default: 0.5 },
    },
  },
  {
    id: 'poisson',
    name: 'Poisson',
    category: 'discrete',
    description: 'Número de eventos que ocurren en un intervalo fijo de tiempo o espacio a una tasa media constante λ.',
    parameterLabels: {
      lambda: { label: 'Tasa media (Lambda)', symbol: 'λ', min: 0.1, max: 80, step: 0.5, default: 5 },
    },
  },
];

export function getMoments(type: DistributionType, params: Record<string, number>): Moments {
  switch (type) {
    case 'normal': {
      const { mean, std } = params as unknown as NormalParams;
      return {
        mean,
        variance: std * std,
        std,
        skewness: 0,
        kurtosis: 0,
      };
    }
    case 'studentt': {
      const { df } = params as unknown as StudentTParams;
      const mean = df > 1 ? 0 : null;
      const variance = df > 2 ? df / (df - 2) : df > 1 ? Infinity : null;
      const std = variance !== null && isFinite(variance) ? Math.sqrt(variance) : null;
      const skewness = df > 3 ? 0 : null;
      const kurtosis = df > 4 ? 6 / (df - 4) : null;
      return { mean, variance, std, skewness, kurtosis };
    }
    case 'chisquare': {
      const { df } = params as unknown as ChiSquareParams;
      const mean = df;
      const variance = 2 * df;
      const std = Math.sqrt(variance);
      const skewness = Math.sqrt(8 / df);
      const kurtosis = 12 / df;
      return { mean, variance, std, skewness, kurtosis };
    }
    case 'f': {
      const { df1, df2 } = params as unknown as FParams;
      const mean = df2 > 2 ? df2 / (df2 - 2) : null;
      const variance =
        df2 > 4 ? (2 * df2 * df2 * (df1 + df2 - 2)) / (df1 * Math.pow(df2 - 2, 2) * (df2 - 4)) : null;
      const std = variance !== null ? Math.sqrt(variance) : null;
      const skewness =
        df2 > 6
          ? ((2 * df1 + df2 - 2) * Math.sqrt(8 * (df2 - 4))) /
            ((df2 - 6) * Math.sqrt(df1 * (df1 + df2 - 2)))
          : null;
      const kurtosis =
        df2 > 8
          ? (12 * (df1 * (5 * df2 - 22) * (df1 + df2 - 2) + (df2 - 4) * Math.pow(df2 - 2, 2))) /
            (df1 * (df2 - 6) * (df2 - 8) * (df1 + df2 - 2))
          : null;
      return { mean, variance, std, skewness, kurtosis };
    }
    case 'gamma': {
      const { shape, scale } = params as unknown as GammaParams;
      const mean = shape * scale;
      const variance = shape * scale * scale;
      const std = Math.sqrt(variance);
      const skewness = 2 / Math.sqrt(shape);
      const kurtosis = 6 / shape;
      return { mean, variance, std, skewness, kurtosis };
    }
    case 'binomial': {
      const { n, p } = params as unknown as BinomialParams;
      const mean = n * p;
      const variance = n * p * (1 - p);
      const std = Math.sqrt(variance);
      const skewness = (1 - 2 * p) / Math.sqrt(variance);
      const kurtosis = (1 - 6 * p * (1 - p)) / variance;
      return { mean, variance, std, skewness, kurtosis };
    }
    case 'poisson': {
      const { lambda } = params as unknown as PoissonParams;
      const mean = lambda;
      const variance = lambda;
      const std = Math.sqrt(lambda);
      const skewness = 1 / Math.sqrt(lambda);
      const kurtosis = 1 / lambda;
      return { mean, variance, std, skewness, kurtosis };
    }
  }
}

export function computePDF(type: DistributionType, x: number, params: Record<string, number>): number {
  if (isNaN(x)) return 0;
  switch (type) {
    case 'normal':
      return jStat.normal.pdf(x, params.mean, params.std);
    case 'studentt':
      return jStat.studentt.pdf(x, params.df);
    case 'chisquare':
      return x < 0 ? 0 : jStat.chisquare.pdf(x, params.df);
    case 'f':
      return x < 0 ? 0 : jStat.centralF.pdf(x, params.df1, params.df2);
    case 'gamma':
      return x < 0 ? 0 : jStat.gamma.pdf(x, params.shape, params.scale);
    case 'binomial':
      return x < 0 || x > params.n || !Number.isInteger(Math.round(x))
        ? 0
        : jStat.binomial.pdf(Math.round(x), params.n, params.p);
    case 'poisson':
      return x < 0 || !Number.isInteger(Math.round(x))
        ? 0
        : jStat.poisson.pdf(Math.round(x), params.lambda);
  }
}

export function computeCDF(type: DistributionType, x: number, params: Record<string, number>): number {
  if (isNaN(x)) return 0;
  switch (type) {
    case 'normal':
      return jStat.normal.cdf(x, params.mean, params.std);
    case 'studentt':
      return jStat.studentt.cdf(x, params.df);
    case 'chisquare':
      return x <= 0 ? 0 : jStat.chisquare.cdf(x, params.df);
    case 'f':
      return x <= 0 ? 0 : jStat.centralF.cdf(x, params.df1, params.df2);
    case 'gamma':
      return x <= 0 ? 0 : jStat.gamma.cdf(x, params.shape, params.scale);
    case 'binomial':
      if (x < 0) return 0;
      if (x >= params.n) return 1;
      return jStat.binomial.cdf(Math.floor(x), params.n, params.p);
    case 'poisson':
      if (x < 0) return 0;
      return jStat.poisson.cdf(Math.floor(x), params.lambda);
  }
}

export function computeQuantile(type: DistributionType, p: number, params: Record<string, number>): number {
  const boundedP = Math.max(1e-7, Math.min(1 - 1e-7, p));
  switch (type) {
    case 'normal':
      return jStat.normal.inv(boundedP, params.mean, params.std);
    case 'studentt':
      return jStat.studentt.inv(boundedP, params.df);
    case 'chisquare':
      return jStat.chisquare.inv(boundedP, params.df);
    case 'f':
      return jStat.centralF.inv(boundedP, params.df1, params.df2);
    case 'gamma':
      return jStat.gamma.inv(boundedP, params.shape, params.scale);
    case 'binomial': {
      // Find smallest integer k such that CDF(k) >= boundedP
      const n = params.n;
      for (let k = 0; k <= n; k++) {
        if (jStat.binomial.cdf(k, n, params.p) >= boundedP) return k;
      }
      return n;
    }
    case 'poisson': {
      // Find smallest integer k such that CDF(k) >= boundedP
      const lambda = params.lambda;
      const maxK = Math.max(50, Math.ceil(lambda + 6 * Math.sqrt(lambda)));
      for (let k = 0; k <= maxK; k++) {
        if (jStat.poisson.cdf(k, lambda) >= boundedP) return k;
      }
      return maxK;
    }
  }
}

export function isDiscrete(type: DistributionType): boolean {
  return type === 'binomial' || type === 'poisson';
}

export function calculateDistribution(
  type: DistributionType,
  params: Record<string, number>,
  mode: CalculationMode,
  inputs: {
    x?: number;
    x1?: number;
    x2?: number;
    alpha?: number;
  }
): CalculationResult {
  const discrete = isDiscrete(type);
  const moments = getMoments(type, params);

  let probability = 0;
  let inverseX: number | undefined = undefined;
  let inverseX1: number | undefined = undefined;
  let inverseX2: number | undefined = undefined;

  let x = inputs.x ?? 0;
  let x1 = inputs.x1 ?? 0;
  let x2 = inputs.x2 ?? 0;
  const alpha = inputs.alpha ?? 0.05;

  if (x1 > x2) {
    const temp = x1;
    x1 = x2;
    x2 = temp;
  }

  let formulaLatex = '';
  let substitutionLatex = '';
  let stepDescription = '';

  if (mode === 'inverse') {
    // Mode Inverse: compute critical values
    const alphaClamped = Math.max(0.0001, Math.min(0.9999, alpha));
    inverseX = computeQuantile(type, alphaClamped, params);
    probability = alphaClamped;

    formulaLatex = `F(x) = P(X \\le x) = \\alpha = ${alphaClamped.toFixed(4)}`;
    substitutionLatex = `x = F^{-1}(${alphaClamped.toFixed(4)}) \\approx ${inverseX.toFixed(4)}`;
    stepDescription = `Buscando el cuantil o valor crítico x tal que la probabilidad acumulada sea ${alphaClamped.toFixed(4)} (${(alphaClamped * 100).toFixed(2)}%).`;
  } else if (discrete) {
    // Discrete distributions
    const intX = Math.round(x);
    const intX1 = Math.round(x1);
    const intX2 = Math.round(x2);

    switch (mode) {
      case 'left':
        probability = computeCDF(type, intX, params);
        formulaLatex = `P(X \\le ${intX}) = \\sum_{k=0}^{${intX}} P(X = k)`;
        substitutionLatex = `P(X \\le ${intX}) = ${probability.toFixed(5)}`;
        stepDescription = `Suma de las probabilidades puntuales desde k = 0 hasta k = ${intX}.`;
        break;
      case 'right':
        probability = 1 - computeCDF(type, intX - 1, params);
        formulaLatex = `P(X \\ge ${intX}) = 1 - P(X \\le ${intX - 1})`;
        substitutionLatex = `P(X \\ge ${intX}) = 1 - ${(1 - probability).toFixed(5)} = ${probability.toFixed(5)}`;
        stepDescription = `Complemento de la probabilidad acumulada hasta ${intX - 1}.`;
        break;
      case 'between':
        probability = computeCDF(type, intX2, params) - computeCDF(type, intX1 - 1, params);
        formulaLatex = `P(${intX1} \\le X \\le ${intX2}) = P(X \\le ${intX2}) - P(X \\le ${intX1 - 1})`;
        substitutionLatex = `P(${intX1} \\le X \\le ${intX2}) = ${computeCDF(type, intX2, params).toFixed(5)} - ${computeCDF(type, intX1 - 1, params).toFixed(5)} = ${probability.toFixed(5)}`;
        stepDescription = `Probabilidad en el intervalo cerrado de enteros [${intX1}, ${intX2}].`;
        break;
      case 'outside':
        probability = computeCDF(type, intX1 - 1, params) + (1 - computeCDF(type, intX2, params));
        formulaLatex = `P(X < ${intX1} \\text{ ó } X > ${intX2}) = P(X \\le ${intX1 - 1}) + [1 - P(X \\le ${intX2})]`;
        substitutionLatex = `P = ${computeCDF(type, intX1 - 1, params).toFixed(5)} + ${(1 - computeCDF(type, intX2, params)).toFixed(5)} = ${probability.toFixed(5)}`;
        stepDescription = `Suma de las dos colas excluyendo el intervalo central.`;
        break;
      case 'exact':
        probability = computePDF(type, intX, params);
        formulaLatex = `P(X = ${intX})`;
        if (type === 'binomial') {
          const { n, p } = params as unknown as BinomialParams;
          formulaLatex = `P(X = ${intX}) = \\binom{${n}}{${intX}} (${p})^{${intX}} (1-${p})^{${n - intX}}`;
        } else if (type === 'poisson') {
          const { lambda } = params as unknown as PoissonParams;
          formulaLatex = `P(X = ${intX}) = \\frac{${lambda}^{${intX}} e^{-${lambda}}}{${intX}!}`;
        }
        substitutionLatex = `P(X = ${intX}) = ${probability.toFixed(5)}`;
        stepDescription = `Masa de probabilidad puntual en el valor exacto ${intX}.`;
        break;
    }
  } else {
    // Continuous distributions
    switch (mode) {
      case 'left':
        probability = computeCDF(type, x, params);
        formulaLatex = `P(X \\le ${x.toFixed(3)}) = \\int_{-\\infty}^{${x.toFixed(3)}} f(t)\\,dt`;
        if (type === 'normal') {
          const z = (x - params.mean) / params.std;
          formulaLatex += ` = \\Phi\\left(\\frac{${x.toFixed(3)} - ${params.mean}}{${params.std}}\\right) = \\Phi(${z.toFixed(3)})`;
        }
        substitutionLatex = `P(X \\le ${x.toFixed(3)}) = ${probability.toFixed(5)}`;
        stepDescription = `Área bajo la curva de densidad desde el extremo inferior hasta x = ${x.toFixed(3)}.`;
        break;
      case 'right':
        probability = 1 - computeCDF(type, x, params);
        formulaLatex = `P(X \\ge ${x.toFixed(3)}) = 1 - P(X \\le ${x.toFixed(3)})`;
        if (type === 'normal') {
          const z = (x - params.mean) / params.std;
          formulaLatex += ` = 1 - \\Phi(${z.toFixed(3)})`;
        }
        substitutionLatex = `P(X \\ge ${x.toFixed(3)}) = 1 - ${(1 - probability).toFixed(5)} = ${probability.toFixed(5)}`;
        stepDescription = `Área bajo la curva de densidad en la cola derecha a partir de x = ${x.toFixed(3)}.`;
        break;
      case 'between':
        probability = computeCDF(type, x2, params) - computeCDF(type, x1, params);
        formulaLatex = `P(${x1.toFixed(3)} \\le X \\le ${x2.toFixed(3)}) = F(${x2.toFixed(3)}) - F(${x1.toFixed(3)})`;
        if (type === 'normal') {
          const z1 = (x1 - params.mean) / params.std;
          const z2 = (x2 - params.mean) / params.std;
          formulaLatex = `P(${x1.toFixed(3)} \\le X \\le ${x2.toFixed(3)}) = \\Phi(${z2.toFixed(3)}) - \\Phi(${z1.toFixed(3)})`;
        }
        substitutionLatex = `P(${x1.toFixed(3)} \\le X \\le ${x2.toFixed(3)}) = ${computeCDF(type, x2, params).toFixed(5)} - ${computeCDF(type, x1, params).toFixed(5)} = ${probability.toFixed(5)}`;
        stepDescription = `Área acumulada en el intervalo central [${x1.toFixed(3)}, ${x2.toFixed(3)}].`;
        break;
      case 'outside':
        probability = computeCDF(type, x1, params) + (1 - computeCDF(type, x2, params));
        formulaLatex = `P(X < ${x1.toFixed(3)} \\cup X > ${x2.toFixed(3)}) = F(${x1.toFixed(3)}) + [1 - F(${x2.toFixed(3)})]`;
        substitutionLatex = `P = ${computeCDF(type, x1, params).toFixed(5)} + ${(1 - computeCDF(type, x2, params)).toFixed(5)} = ${probability.toFixed(5)}`;
        stepDescription = `Suma de las dos áreas exteriores a los valores ${x1.toFixed(3)} y ${x2.toFixed(3)}.`;
        break;
      case 'exact':
        probability = 0;
        formulaLatex = `P(X = ${x.toFixed(3)}) = 0`;
        substitutionLatex = `P(X = ${x.toFixed(3)}) = 0.00000`;
        stepDescription = `En cualquier distribución continua, la probabilidad de un punto exacto es estrictamente 0. La altura de la curva f(${x.toFixed(3)}) = ${computePDF(type, x, params).toFixed(5)} representa la densidad, no la probabilidad acumulada.`;
        break;
    }
  }

  // Clamping probability between 0 and 1
  probability = Math.max(0, Math.min(1, probability));

  // Determine chart range
  let xMin = 0;
  let xMax = 10;

  if (discrete) {
    if (type === 'binomial') {
      xMin = 0;
      xMax = params.n;
    } else {
      // Poisson
      xMin = 0;
      xMax = Math.max(15, Math.ceil(params.lambda + 4 * Math.sqrt(params.lambda)));
    }
  } else {
    // Continuous bounds
    if (type === 'normal') {
      const mean = params.mean;
      const std = params.std;
      xMin = mean - 4 * std;
      xMax = mean + 4 * std;
    } else if (type === 'studentt') {
      const df = params.df;
      const spread = df > 2 ? Math.sqrt(df / (df - 2)) * 4.2 : 5.5;
      xMin = -spread;
      xMax = spread;
    } else if (type === 'chisquare') {
      const df = params.df;
      xMin = 0;
      xMax = Math.max(10, df + 4 * Math.sqrt(2 * df));
    } else if (type === 'f') {
      const q99 = computeQuantile('f', 0.99, params);
      xMin = 0;
      xMax = Math.min(25, Math.max(5, q99 * 1.15));
    } else if (type === 'gamma') {
      const { shape, scale } = params;
      const mean = shape * scale;
      const std = Math.sqrt(shape) * scale;
      xMin = 0;
      xMax = Math.max(8, mean + 4 * std);
    }
  }

  // Generate chart data points
  const chartPoints: ChartPoint[] = [];
  let yMax = 0;

  const checkShaded = (val: number): boolean => {
    if (mode === 'inverse' && inverseX !== undefined) {
      return val <= inverseX;
    }
    if (discrete) {
      const k = Math.round(val);
      const intX = Math.round(x);
      const intX1 = Math.round(x1);
      const intX2 = Math.round(x2);
      switch (mode) {
        case 'left':
          return k <= intX;
        case 'right':
          return k >= intX;
        case 'between':
          return k >= intX1 && k <= intX2;
        case 'outside':
          return k < intX1 || k > intX2;
        case 'exact':
          return k === intX;
        default:
          return false;
      }
    } else {
      switch (mode) {
        case 'left':
          return val <= x;
        case 'right':
          return val >= x;
        case 'between':
          return val >= x1 && val <= x2;
        case 'outside':
          return val < x1 || val > x2;
        case 'exact':
          return Math.abs(val - x) < (xMax - xMin) / 400;
        default:
          return false;
      }
    }
  };

  if (discrete) {
    const startK = Math.max(0, Math.floor(xMin));
    const endK = Math.ceil(xMax);
    for (let k = startK; k <= endK; k++) {
      const y = computePDF(type, k, params);
      if (y > yMax) yMax = y;
      chartPoints.push({
        x: k,
        y,
        isShaded: checkShaded(k),
      });
    }
  } else {
    const numPoints = 250;
    const step = (xMax - xMin) / (numPoints - 1);
    for (let i = 0; i < numPoints; i++) {
      const curX = xMin + i * step;
      const y = computePDF(type, curX, params);
      if (y > yMax) yMax = y;
      chartPoints.push({
        x: curX,
        y: isNaN(y) || !isFinite(y) ? 0 : y,
        isShaded: checkShaded(curX),
      });
    }
  }

  return {
    probability,
    formattedProbability: probability.toFixed(5),
    percentage: (probability * 100).toFixed(3) + '%',
    inverseX,
    inverseX1,
    inverseX2,
    moments,
    chartPoints,
    xMin,
    xMax,
    yMax: yMax * 1.15 || 1,
    formulaLatex,
    substitutionLatex,
    stepDescription,
  };
}
