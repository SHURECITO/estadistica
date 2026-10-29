declare module 'jstat' {
  export const jStat: {
    normal: {
      pdf(x: number, mean: number, std: number): number;
      cdf(x: number, mean: number, std: number): number;
      inv(p: number, mean: number, std: number): number;
      mean(mean: number, std: number): number;
      variance(mean: number, std: number): number;
    };
    studentt: {
      pdf(x: number, df: number): number;
      cdf(x: number, df: number): number;
      inv(p: number, df: number): number;
      mean(df: number): number;
      variance(df: number): number;
    };
    chisquare: {
      pdf(x: number, df: number): number;
      cdf(x: number, df: number): number;
      inv(p: number, df: number): number;
      mean(df: number): number;
      variance(df: number): number;
    };
    centralF: {
      pdf(x: number, df1: number, df2: number): number;
      cdf(x: number, df1: number, df2: number): number;
      inv(p: number, df1: number, df2: number): number;
      mean(df1: number, df2: number): number;
      variance(df1: number, df2: number): number;
    };
    gamma: {
      pdf(x: number, shape: number, scale: number): number;
      cdf(x: number, shape: number, scale: number): number;
      inv(p: number, shape: number, scale: number): number;
      mean(shape: number, scale: number): number;
      variance(shape: number, scale: number): number;
    };
    binomial: {
      pdf(k: number, n: number, p: number): number;
      cdf(k: number, n: number, p: number): number;
      mean(n: number, p: number): number;
      variance(n: number, p: number): number;
    };
    poisson: {
      pdf(k: number, lambda: number): number;
      cdf(k: number, lambda: number): number;
      mean(lambda: number): number;
      variance(lambda: number): number;
    };
    gammafn(x: number): number;
    gammaln(x: number): number;
    betafn(x: number, y: number): number;
  };
}
