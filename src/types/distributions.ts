export type DistributionType =
  | 'normal'
  | 'binomial'
  | 'poisson'
  | 'studentt'
  | 'chisquare'
  | 'f'
  | 'gamma';

export type CalculationMode =
  | 'left'      // P(X <= x)
  | 'right'     // P(X >= x)
  | 'between'   // P(x1 <= X <= x2)
  | 'outside'   // P(X < x1 or X > x2)
  | 'exact'     // P(X = x) - discrete only
  | 'inverse';  // Given probability alpha, find x

export interface NormalParams {
  mean: number;
  std: number;
}

export interface BinomialParams {
  n: number;
  p: number;
}

export interface PoissonParams {
  lambda: number;
}

export interface StudentTParams {
  df: number;
}

export interface ChiSquareParams {
  df: number;
}

export interface FParams {
  df1: number;
  df2: number;
}

export interface GammaParams {
  shape: number; // k or alpha
  scale: number; // theta (or 1/beta rate)
}

export type DistributionParams =
  | NormalParams
  | BinomialParams
  | PoissonParams
  | StudentTParams
  | ChiSquareParams
  | FParams
  | GammaParams;

export interface Moments {
  mean: number | null;
  variance: number | null;
  std: number | null;
  skewness: number | null;
  kurtosis: number | null; // Excess kurtosis
}

export interface ChartPoint {
  x: number;
  y: number;
  isShaded: boolean;
}

export interface CalculationResult {
  probability: number;
  formattedProbability: string;
  percentage: string;
  inverseX?: number;
  inverseX1?: number;
  inverseX2?: number;
  moments: Moments;
  chartPoints: ChartPoint[];
  xMin: number;
  xMax: number;
  yMax: number;
  formulaLatex: string;
  substitutionLatex: string;
  stepDescription: string;
}

export interface DistributionMeta {
  id: DistributionType;
  name: string;
  category: 'continuous' | 'discrete';
  description: string;
  parameterLabels: { [key: string]: { label: string; symbol: string; min: number; max: number; step: number; default: number } };
  isStandardNormal?: boolean;
}
